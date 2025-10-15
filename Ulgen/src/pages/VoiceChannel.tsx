// client/src/pages/VoiceChannel.tsx
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faHeadphonesSimple,
  faEarDeaf,
  faLink,
  faDisplay,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext.tsx";

interface User {
  id: string;
  username: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isDeafened: boolean;
}

type PresenceUser = {
  id?: string;
  username?: string;
  isMuted?: boolean;
  isDeafened?: boolean;
  isSpeaking?: boolean;
};

interface VoiceChannelProps {
  channelId?: string;
  noUI?: boolean;
}

const VoiceChannel: React.FC<VoiceChannelProps> = ({ channelId, noUI }) => {
  const { id: routeId } = useParams<{ id: string }>();
  const id = channelId || routeId;
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const joinedRoomRef = useRef<string | null>(null);
  const selfKeyRef = useRef<string>("");
  // const [selfId, setSelfId] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null); // legacy, removed after Worklet
  const analyserRef = useRef<AnalyserNode | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const workletLoadedRef = useRef<boolean>(false);
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const shareVideoRef = useRef<HTMLVideoElement>(null);
  const shareStreamRef = useRef<MediaStream | null>(null);
  const [selfLevel, setSelfLevel] = useState(0);
  const lastLevelRef = useRef(0);
  const prevSpeakingRef = useRef<boolean>(false);
  const lastScheduledTimeRef = useRef<number>(0);

  const playRemoteAudio = (audioData: ArrayBuffer, srcSampleRate?: number) => {
    try {
      if (isDeafened) return;
      const Ctx =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx: AudioContext = audioContextRef.current || new Ctx();
      audioContextRef.current = ctx;
      const input = new Float32Array(audioData);
      const targetRate = ctx.sampleRate;
      const sourceRate =
        typeof srcSampleRate === "number" && srcSampleRate > 0
          ? srcSampleRate
          : targetRate;
      let pcm: Float32Array;
      if (sourceRate === targetRate) {
        pcm = input;
      } else {
        const ratio = targetRate / sourceRate;
        const outLen = Math.max(1, Math.round(input.length * ratio));
        const out = new Float32Array(outLen);
        for (let i = 0; i < outLen; i++) {
          const srcIdx = i / ratio;
          const i0 = Math.floor(srcIdx);
          const i1 = Math.min(input.length - 1, i0 + 1);
          const t = srcIdx - i0;
          out[i] = (1 - t) * input[i0] + t * input[i1];
        }
        pcm = out;
      }
      const buffer = ctx.createBuffer(1, pcm.length, targetRate);
      buffer.copyToChannel(pcm as any, 0);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(ctx.destination);
      // schedule to reduce pops/clicks and jitter; keep slight buffer
      const now = ctx.currentTime;
      const startAt = Math.max(now + 0.01, lastScheduledTimeRef.current);
      try {
        src.start(startAt);
      } catch {
        src.start();
      }
      lastScheduledTimeRef.current = startAt + buffer.duration;
    } catch {}
  };

  const leaveChannelAndCleanup = () => {
    try {
      // Stop audio capture
      try {
        processorRef.current?.disconnect();
        sourceNodeRef.current?.disconnect();
        workletNodeRef.current?.disconnect();
      } catch {}
      try {
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      } catch {}
      processorRef.current = null;
      sourceNodeRef.current = null;
      mediaStreamRef.current = null;
      workletNodeRef.current = null;
    } catch {}

    // Leave socket room and disconnect
    try {
      const sid = joinedRoomRef.current;
      if (socketRef.current && sid) {
        socketRef.current.emit("leave-channel", sid);
      }
    } catch {}
    try {
      socketRef.current?.disconnect();
    } catch {}
    socketRef.current = null;
    joinedRoomRef.current = null;

    // Remove self from localStorage presence
    try {
      if (id) {
        const key = "voicePresence";
        const raw = localStorage.getItem(key);
        const map: Record<string, PresenceUser[] | undefined> = raw
          ? JSON.parse(raw)
          : {};
        const cur: any = socketRef.current as any;
        const selfId: string = cur && cur.id ? String(cur.id) : "self-local";
        const chanId = String(id);
        const list = map[chanId];
        const arr: PresenceUser[] = Array.isArray(list)
          ? (list as PresenceUser[])
          : [];
        if (arr.length > 0) {
          map[chanId] = arr.filter(
            (u) =>
              (u?.id ?? "") !== selfId &&
              (u?.username ?? "") !== (currentUser?.username || "You")
          );
          localStorage.setItem(key, JSON.stringify(map));
          window.dispatchEvent(
            new CustomEvent("voice-presence-updated", {
              detail: { channelId: chanId },
            })
          );
        }
      }
    } catch {}
  };

  // Push-to-talk / push-to-mute
  useEffect(() => {
    let cfg: any = {
      code: "Space",
      ctrl: false,
      alt: false,
      shift: false,
      mode: "ptt",
    };
    try {
      const rawV2 = localStorage.getItem("voiceKeybindV2");
      if (rawV2) cfg = JSON.parse(rawV2);
      else {
        const raw = localStorage.getItem("voiceKeybind");
        if (raw) cfg.code = JSON.parse(raw);
      }
    } catch {}
    let pressed = false;
    const match = (e: KeyboardEvent) =>
      (e.code || e.key) === cfg.code &&
      !!e.ctrlKey === !!cfg.ctrl &&
      !!e.altKey === !!cfg.alt &&
      !!e.shiftKey === !!cfg.shift;
    const down = (e: KeyboardEvent) => {
      if (match(e) && !pressed) {
        pressed = true;
        if (cfg.mode === "ptt") {
          if (isMuted) toggleMute();
        } else {
          if (!isMuted) toggleMute();
        }
      }
    };
    const up = (e: KeyboardEvent) => {
      if (match(e) && pressed) {
        pressed = false;
        if (cfg.mode === "ptt") {
          if (!isMuted) toggleMute();
        } else {
          if (isMuted) toggleMute();
        }
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [isMuted]);

  // Socket bağlantısı ve kanal katılımı
  useEffect(() => {
    if (!id) return;

    // Kendini hemen ekle (socket bağlanmasa bile local presence olsun)
    setUsers((prev) => {
      // clear any stale self entries with previous username or temp ids
      const selfNameLocal = currentUser?.username || "You";
      const filtered = prev.filter(
        (u) => !(u.username === selfNameLocal && u.id.startsWith("self-"))
      );
      if (!selfKeyRef.current) {
        selfKeyRef.current = socketRef.current?.id || `self-${selfNameLocal}`;
      }
      const selfExisting = filtered.some((u) => u.id === selfKeyRef.current);
      if (selfExisting) return filtered;
      return [
        ...filtered,
        {
          id: selfKeyRef.current,
          username: selfNameLocal,
          isSpeaking: false,
          isMuted,
          isDeafened,
        },
      ];
    });

    // Hemen localStorage presence yaz (socket bağlanmasa bile anında görünür)
    try {
      const key = "voicePresence";
      const raw = localStorage.getItem(key);
      const map = raw ? JSON.parse(raw) : {};
      const chanId = String(id);
      if (!selfKeyRef.current) {
        selfKeyRef.current =
          socketRef.current?.id || `self-${currentUser?.username || "You"}`;
      }
      const self = {
        id: selfKeyRef.current,
        username: currentUser?.username || "You",
        isSpeaking: false,
        isMuted,
        isDeafened,
      };
      const others = Array.isArray(map[chanId])
        ? map[chanId].filter((u: any) => u.username !== self.username)
        : [];
      map[chanId] = [self, ...others];
      localStorage.setItem(key, JSON.stringify(map));
      window.dispatchEvent(
        new CustomEvent("voice-presence-updated", {
          detail: { channelId: chanId },
        })
      );
    } catch {}

    // idempotent init: varsa tekrar kurma
    if (socketRef.current) return;

    const SOCKET_BASE =
      (import.meta as any).env?.VITE_SOCKET_BASE ||
      "https://ulgen-backend.onrender.com";
    const socket = io(SOCKET_BASE, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      if (id && joinedRoomRef.current !== id) {
        if (joinedRoomRef.current) {
          socket.emit("leave-channel", joinedRoomRef.current);
        }
        socket.emit("join-channel", id);
        joinedRoomRef.current = id;
      }
      setUsers((prev) => {
        const newId = socket.id;
        if (!newId) return prev;
        selfKeyRef.current = newId;
        const selfName = currentUser?.username || "You";
        // Self kaydını id veya kullanıcı adına göre yeni id ile eşle
        const mapped = prev.map((u) =>
          u.username === selfName
            ? {
                id: newId,
                username: selfName,
                isSpeaking: u.isSpeaking,
                isMuted: isMuted,
                isDeafened: isDeafened,
              }
            : u
        );
        // Eğer listede yoksa ekle
        if (!mapped.some((u) => u.username === selfName)) {
          mapped.push({
            id: newId,
            username: selfName,
            isSpeaking: false,
            isMuted,
            isDeafened,
          });
        }
        return mapped;
      });

      // initial presence
      try {
        if (id) {
          socket.emit("presence-update", {
            channelId: id,
            username: currentUser?.username || "You",
            isMuted,
            isDeafened,
            isSpeaking: false,
          });
        }
      } catch {}
    });

    socket.on("user-joined", (payload: { userId: string }) => {
      setUsers((prev) => {
        if (prev.some((u) => u.id === payload.userId)) return prev;
        return [
          ...prev,
          {
            id: payload.userId,
            username: `Kullanıcı ${payload.userId.slice(0, 4)}`,
            isSpeaking: false,
            isMuted: false,
            isDeafened: false,
          },
        ];
      });
    });

    socket.on("user-left", (payload: { userId: string }) => {
      setUsers((prev) => prev.filter((u) => u.id !== payload.userId));
    });

    socket.on(
      "presence-update",
      (payload: {
        userId: string;
        username?: string;
        isMuted?: boolean;
        isDeafened?: boolean;
        isSpeaking?: boolean;
      }) => {
        const {
          userId,
          username,
          isMuted: m,
          isDeafened: d,
          isSpeaking: s,
        } = (payload || ({} as any)) as any;
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  username: username || u.username,
                  isMuted: typeof m === "boolean" ? m : u.isMuted,
                  isDeafened: typeof d === "boolean" ? d : u.isDeafened,
                  isSpeaking: typeof s === "boolean" ? s : u.isSpeaking,
                }
              : u
          )
        );
      }
    );

    socket.on(
      "voice-data",
      (payload: {
        userId: string;
        audioData: ArrayBuffer;
        sampleRate?: number;
      }) => {
        const { audioData, sampleRate } = payload || ({} as any);
        if (!audioData) return;
        playRemoteAudio(audioData, sampleRate);
      }
    );

    socket.on("connect_error", (err: any) => {
      // eslint-disable-next-line no-console
      console.error("Socket connect_error:", err?.message || err);
    });

    const handleBeforeUnload = () => {
      try {
        if (socketRef.current) {
          socketRef.current.emit("leave-channel", id);
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      } catch {}
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Kanal id değişirse oda değiştir
    const maybeSwitchRoom = (newId: string | undefined | null) => {
      if (!socketRef.current || !newId) return;
      if (joinedRoomRef.current === newId) return;
      try {
        if (joinedRoomRef.current) {
          socketRef.current.emit("leave-channel", joinedRoomRef.current);
        }
        socketRef.current.emit("join-channel", newId);
        joinedRoomRef.current = newId;
      } catch {}
    };
    maybeSwitchRoom(id);

    return () => {
      // React StrictMode dev ortamında double-invoke cleanup disconnect etmesin
      // Sadece listenerları temizle
      try {
        socket.off("connect");
        socket.off("user-joined");
        socket.off("user-left");
        socket.off("presence-update");
        socket.off("voice-data");
        socket.off("connect_error");
      } catch {}
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Disconnect'i burada yapmıyoruz; gerçek ayrılma "Ayrıl" butonunda veya beforeunload'da
    };
  }, [id, currentUser?.username, isDeafened]);

  // Presence'i localStorage'a yaz
  useEffect(() => {
    if (!id) return;
    try {
      const key = "voicePresence";
      const raw = localStorage.getItem(key);
      const map = raw ? JSON.parse(raw) : {};
      const cur2: any = socketRef.current as any;
      const selfId = cur2 && cur2.id ? String(cur2.id) : "self-local";
      const chanId = String(id);
      map[chanId] = users.map((u) => ({
        id: u.id,
        username: u.username,
        isMuted: u.id === selfId ? isMuted : u.isMuted,
        isDeafened: u.id === selfId ? isDeafened : u.isDeafened,
        isSpeaking: u.isSpeaking,
      }));
      localStorage.setItem(key, JSON.stringify(map));
    } catch {}
    // also emit our latest presence for robustness
    try {
      if (socketRef.current && id) {
        socketRef.current.emit("presence-update", {
          channelId: id,
          username: currentUser?.username || "You",
          isMuted,
          isDeafened,
          isSpeaking: prevSpeakingRef.current,
        });
      }
    } catch {}
  }, [id, users, isMuted, isDeafened]);

  // Başlangıçta mikrofon/kulaklık durumunu localStorage'dan oku
  useEffect(() => {
    try {
      const raw = localStorage.getItem("voiceSettings");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed?.isMuted === "boolean") setIsMuted(parsed.isMuted);
        if (typeof parsed?.isDeafened === "boolean")
          setIsDeafened(parsed.isDeafened);
      }
    } catch {}
  }, []);

  const persistSettings = (nextMuted: boolean, nextDeafened: boolean) => {
    try {
      localStorage.setItem(
        "voiceSettings",
        JSON.stringify({ isMuted: nextMuted, isDeafened: nextDeafened })
      );
    } catch {}
    // Aynı sekmede hızlı UI güncellemesi için event yayınla
    if (id) {
      try {
        window.dispatchEvent(
          new CustomEvent("voice-presence-updated", {
            detail: { channelId: id },
          })
        );
      } catch {}
    }
  };

  // Unmount olurken kendi kaydını sil
  useEffect(() => {
    return () => {
      if (!id) return;
      // Full cleanup on unmount
      leaveChannelAndCleanup();
    };
  }, [id]);

  // Mikrofonu başlat ve ses verisini soket ile gönder
  useEffect(() => {
    const startCapture = async () => {
      if (!socketRef.current) return;
      if (isMuted || isDeafened) return;
      try {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx: AudioContext = audioContextRef.current || new Ctx();
        audioContextRef.current = ctx;
        if (ctx.state === "suspended") {
          try {
            await ctx.resume();
          } catch {}
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStreamRef.current = stream;

        const source = ctx.createMediaStreamSource(stream);
        sourceNodeRef.current = source;

        // AudioWorklet kullan
        if (!workletLoadedRef.current) {
          try {
            await (ctx as any).audioWorklet.addModule(
              "/worklets/voice-processor.js"
            );
            workletLoadedRef.current = true;
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(
              "AudioWorklet module load failed, fallback disabled warnings:",
              e
            );
          }
        }

        if (workletLoadedRef.current) {
          const workletNode = new (window as any).AudioWorkletNode(
            ctx,
            "voice-processor"
          );
          workletNodeRef.current = workletNode as any;

          // PCM verisini al ve gönder
          workletNode.port.onmessage = (ev: MessageEvent) => {
            if (!socketRef.current || isMuted || isDeafened) return;
            const input = ev.data as Float32Array;
            const copied = new Float32Array(input.length);
            copied.set(input);
            socketRef.current.emit("voice-data", {
              channelId: id,
              audioData: copied.buffer,
              sampleRate: ctx.sampleRate,
            });

            // RMS konuşuyor göstergesi
            let sumSquares = 0;
            for (let i = 0; i < input.length; i++)
              sumSquares += input[i] * input[i];
            const rms = Math.sqrt(sumSquares / input.length);
            const threshold = 0.02;
            setUsers((prev) =>
              prev.map((u) =>
                u.id === (socketRef.current?.id || "")
                  ? { ...u, isSpeaking: rms > threshold }
                  : u
              )
            );
          };

          source.connect(workletNode);
          // workletNode.connect(ctx.destination); // monitör etmek istemiyorsan yorumlu bırak
        }

        // Analyser sadece RMS/visual için kalabilir
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        analyserRef.current = analyser;
        source.connect(analyser);
      } catch {}
    };

    const stopCapture = () => {
      try {
        processorRef.current?.disconnect();
        sourceNodeRef.current?.disconnect();
        workletNodeRef.current?.disconnect();
      } catch {}
      try {
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      } catch {}
      processorRef.current = null;
      sourceNodeRef.current = null;
      mediaStreamRef.current = null;
      workletNodeRef.current = null;
    };

    if (!isMuted && !isDeafened) {
      startCapture();
    } else {
      stopCapture();
    }

    return () => {
      stopCapture();
    };
  }, [id, isMuted, isDeafened]);

  // Konuşma seviyesi (self) için görsel seviye göstergesi
  useEffect(() => {
    let raf: number | null = null;
    const analyser = analyserRef.current;
    if (!analyser) return;
    const buffer = new Float32Array(analyser.fftSize);

    const loop = () => {
      try {
        analyser.getFloatTimeDomainData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
        const rms = Math.sqrt(sum / buffer.length);
        const level = Math.max(0, Math.min(1, rms * 5));
        // Sadece anlamlı fark varsa UI'ı güncelle (layout jitter azaltma)
        if (Math.abs(level - lastLevelRef.current) > 0.03) {
          lastLevelRef.current = level;
          setSelfLevel(level);
        }

        // Speaking eşiği (düşük eşik ile daha duyarlı)
        const speaking = level > 0.04;
        if (speaking !== prevSpeakingRef.current) {
          prevSpeakingRef.current = speaking;
          const selfId =
            (socketRef.current as any)?.id ||
            selfKeyRef.current ||
            "self-local";
          // State'i güncelle
          setUsers((prev) =>
            prev.map((u) =>
              u.id === selfId ? { ...u, isSpeaking: speaking } : u
            )
          );
          // Presence'i hızlıca yaz ve bildir
          try {
            if (id) {
              const key = "voicePresence";
              const raw = localStorage.getItem(key);
              const map = raw ? JSON.parse(raw) : {};
              const chanId = String(id);
              const list = Array.isArray(map[chanId]) ? map[chanId] : [];
              map[chanId] = list.map((u: any) =>
                u.id === selfId ||
                u.username === (currentUser?.username || "You")
                  ? { ...u, isSpeaking: speaking }
                  : u
              );
              localStorage.setItem(key, JSON.stringify(map));
              window.dispatchEvent(
                new CustomEvent("voice-presence-updated", {
                  detail: { channelId: chanId },
                })
              );
            }
          } catch {}
        }
      } catch {}
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMuted, isDeafened]);

  // UI kapalı mod
  if (noUI) {
    return null;
  }

  // Ekran paylaşımı başlat/durdur
  const toggleShare = async () => {
    if (isSharing) {
      try {
        shareStreamRef.current?.getTracks().forEach((t) => t.stop());
      } catch {}
      if (shareVideoRef.current) shareVideoRef.current.srcObject = null;
      shareStreamRef.current = null;
      setIsSharing(false);
      return;
    }
    try {
      // Basic screenshare
      // @ts-ignore - older types
      const stream: MediaStream = await (
        navigator.mediaDevices as any
      ).getDisplayMedia({ video: true, audio: false });
      shareStreamRef.current = stream;
      if (shareVideoRef.current) {
        shareVideoRef.current.srcObject = stream as any;
        await shareVideoRef.current.play().catch(() => {});
      }
      const onEnded = () => {
        setIsSharing(false);
        if (shareVideoRef.current) shareVideoRef.current.srcObject = null;
      };
      stream.getVideoTracks().forEach((tr) => (tr.onended = onEnded));
      setIsSharing(true);
    } catch {}
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      const selfId = socketRef.current?.id;
      if (selfId) {
        setUsers((curr) =>
          curr.map((u) => (u.id === selfId ? { ...u, isMuted: next } : u))
        );
      }
      persistSettings(next, isDeafened);
      try {
        if (socketRef.current && id) {
          socketRef.current.emit("presence-update", {
            channelId: id,
            username: currentUser?.username || "You",
            isMuted: next,
            isDeafened: isDeafened,
            isSpeaking: prevSpeakingRef.current,
          });
        }
      } catch {}
      return next;
    });
    // Gerçek uygulamada WebRTC mute işlemi burada yapılacak
  };

  const toggleDeafen = () => {
    setIsDeafened((prev) => {
      const next = !prev;
      const selfId = socketRef.current?.id;
      if (selfId) {
        setUsers((curr) =>
          curr.map((u) => (u.id === selfId ? { ...u, isDeafened: next } : u))
        );
      }
      persistSettings(isMuted, next);
      try {
        if (socketRef.current && id) {
          socketRef.current.emit("presence-update", {
            channelId: id,
            username: currentUser?.username || "You",
            isMuted: isMuted,
            isDeafened: next,
            isSpeaking: prevSpeakingRef.current,
          });
        }
      } catch {}
      return next;
    });
    // Gerçek uygulamada WebRTC deafen işlemi burada yapılacak
  };

  useEffect(() => {
    const onToggle = (e: any) => {
      const detail = e.detail || {};
      if (!id || detail.channelId !== id) return;
      if (detail.action === "toggle-mic") toggleMute();
      if (detail.action === "toggle-deafen") toggleDeafen();
    };
    window.addEventListener("voice-toggle", onToggle as any);
    const onLeave = (e: any) => {
      const detail = e.detail || {};
      if (!id || detail.channelId !== id) return;
      leaveChannelAndCleanup();
    };
    window.addEventListener("voice-leave", onLeave as any);
    return () => {
      window.removeEventListener("voice-toggle", onToggle as any);
      window.removeEventListener("voice-leave", onLeave as any);
    };
  }, [id, isMuted, isDeafened]);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Kullanıcı Listesi */}
      <div className="w-80 bg-gray-800 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Ses Kanalı #{id}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {users.length} çevrimiçi üye
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Invite */}
              <button
                onClick={() => {
                  setShowInvite(true);
                  setCopied(false);
                }}
                title="Davet bağlantısı"
                className="px-2 py-2 rounded bg-green-600 hover:bg-green-500 text-white"
              >
                <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
              </button>
              {/* Mic */}
              <button
                onClick={toggleMute}
                title={isMuted ? "Mikrofon kapalı" : "Mikrofon açık"}
                className={`p-2 rounded ${
                  isMuted
                    ? "bg-red-600 text-white"
                    : "bg-green-600 text-white hover:bg-green-500"
                }`}
              >
                <FontAwesomeIcon
                  icon={isMuted ? faMicrophoneSlash : faMicrophone}
                  className="w-4 h-4"
                />
              </button>
              {/* Headphones */}
              <button
                onClick={toggleDeafen}
                title={isDeafened ? "Kulaklık kapalı" : "Kulaklık açık"}
                className={`p-2 rounded ${
                  isDeafened
                    ? "bg-red-600 text-white"
                    : "bg-green-600 text-white hover:bg-green-500"
                }`}
              >
                <FontAwesomeIcon
                  icon={isDeafened ? faEarDeaf : faHeadphonesSimple}
                  className="w-4 h-4"
                />
              </button>
              {/* Screenshare */}
              <button
                onClick={toggleShare}
                title={
                  isSharing
                    ? "Ekran paylaşımını durdur"
                    : "Ekran paylaşımı başlat"
                }
                className={`p-2 rounded ${
                  isSharing
                    ? "bg-red-600 text-white"
                    : "bg-green-600 text-white hover:bg-green-500"
                }`}
              >
                <FontAwesomeIcon icon={faDisplay} className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center p-3 rounded-lg ${
                  user.isSpeaking ? "bg-green-900 bg-opacity-30" : "bg-gray-700"
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      user.id === currentUser?.id
                        ? "bg-indigo-500"
                        : "bg-gray-600"
                    }`}
                  >
                    <span className="text-white font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {user.isSpeaking && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-white font-medium">
                    {user.username}
                    {user.id === currentUser?.id && " (Siz)"}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Mic status pill - clickable only for self */}
                  {user.id === socketRef.current?.id ||
                  user.username === (currentUser?.username || "") ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      title={user.isMuted ? "Mikrofon kapalı" : "Mikrofon açık"}
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-700/60 hover:bg-gray-600/60 ${
                        user.isMuted ? "text-red-500" : "text-green-400"
                      }`}
                      type="button"
                    >
                      <FontAwesomeIcon
                        icon={user.isMuted ? faMicrophoneSlash : faMicrophone}
                        className="w-3.5 h-3.5"
                      />
                    </button>
                  ) : (
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-700/60 ${
                        user.isMuted ? "text-red-500" : "text-green-400"
                      }`}
                      title={user.isMuted ? "Mikrofon kapalı" : "Mikrofon açık"}
                    >
                      <FontAwesomeIcon
                        icon={user.isMuted ? faMicrophoneSlash : faMicrophone}
                        className="w-3.5 h-3.5"
                      />
                    </span>
                  )}

                  {/* Headphones status pill - clickable only for self */}
                  {user.id === socketRef.current?.id ||
                  user.username === (currentUser?.username || "") ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDeafen();
                      }}
                      title={
                        user.isDeafened ? "Kulaklık kapalı" : "Kulaklık açık"
                      }
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-700/60 hover:bg-gray-600/60 ${
                        user.isDeafened ? "text-red-500" : "text-green-400"
                      }`}
                      type="button"
                    >
                      <FontAwesomeIcon
                        icon={user.isDeafened ? faEarDeaf : faHeadphonesSimple}
                        className="w-3.5 h-3.5"
                      />
                    </button>
                  ) : (
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-700/60 ${
                        user.isDeafened ? "text-red-500" : "text-green-400"
                      }`}
                      title={
                        user.isDeafened ? "Kulaklık kapalı" : "Kulaklık açık"
                      }
                    >
                      <FontAwesomeIcon
                        icon={user.isDeafened ? faEarDeaf : faHeadphonesSimple}
                        className="w-3.5 h-3.5"
                      />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative bg-gray-900">
          {/* Ekran Paylaşımı Önizleme */}
          {isSharing && (
            <div className="absolute inset-x-0 top-0 flex justify-center p-6 pointer-events-none">
              <div className="rounded-xl overflow-hidden border border-gray-700 w-full max-w-4xl shadow-2xl">
                <video
                  ref={shareVideoRef}
                  className="w-full bg-black"
                  muted
                  playsInline
                />
              </div>
            </div>
          )}

          {/* Katılımcı Grid'i */}
          <div className={`h-full ${isSharing ? "pt-72" : "pt-10"} pb-28 px-6`}>
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={`group relative bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-2xl p-5 transition-colors`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            user.id === currentUser?.id
                              ? "bg-indigo-500"
                              : "bg-gray-600"
                          } ${
                            user.isSpeaking
                              ? "ring-4 ring-green-500/60 shadow-lg shadow-green-700/20"
                              : ""
                          }`}
                        >
                          <span className="text-white font-semibold">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {/* Sadece kendiniz için seviye göstergesi */}
                        {user.id === socketRef.current?.id && (
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{
                                width: `${Math.round(selfLevel * 100)}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="mt-4 text-white font-medium text-center">
                        {user.username}
                        {user.id === currentUser?.id && " (Siz)"}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span
                          className={`${
                            user.isMuted ? "text-red-500" : "text-green-400"
                          }`}
                          title={
                            user.isMuted ? "Mikrofon kapalı" : "Mikrofon açık"
                          }
                        >
                          <FontAwesomeIcon
                            icon={
                              user.isMuted ? faMicrophoneSlash : faMicrophone
                            }
                          />
                        </span>
                        <span
                          className={`${
                            user.isDeafened ? "text-red-500" : "text-green-400"
                          }`}
                          title={
                            user.isDeafened
                              ? "Kulaklık kapalı"
                              : "Kulaklık açık"
                          }
                        >
                          <FontAwesomeIcon
                            icon={
                              user.isDeafened ? faEarDeaf : faHeadphonesSimple
                            }
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alt Cam Efektli Kontrol Barı */}
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
            <div className="pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-gray-800/60 backdrop-blur shadow-2xl">
              <button
                onClick={toggleMute}
                title={isMuted ? "Mikrofon kapalı" : "Mikrofon açık"}
                className={`p-2 rounded-full ${
                  isMuted
                    ? "bg-red-600 text-white"
                    : "bg-green-600 text-white hover:bg-green-500"
                }`}
              >
                <FontAwesomeIcon
                  icon={isMuted ? faMicrophoneSlash : faMicrophone}
                  className="w-4 h-4"
                />
              </button>
              <button
                onClick={toggleDeafen}
                title={isDeafened ? "Kulaklık kapalı" : "Kulaklık açık"}
                className={`p-2 rounded-full ${
                  isDeafened
                    ? "bg-red-600 text-white"
                    : "bg-green-600 text-white hover:bg-green-500"
                }`}
              >
                <FontAwesomeIcon
                  icon={isDeafened ? faEarDeaf : faHeadphonesSimple}
                  className="w-4 h-4"
                />
              </button>
              <button
                onClick={toggleShare}
                title={
                  isSharing
                    ? "Ekran paylaşımını durdur"
                    : "Ekran paylaşımı başlat"
                }
                className={`p-2 rounded-full ${
                  isSharing
                    ? "bg-red-600 text-white"
                    : "bg-green-600 text-white hover:bg-green-500"
                }`}
              >
                <FontAwesomeIcon icon={faDisplay} className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gizli audio element (WebRTC için) */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Davet Modali */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">
                Davet Bağlantısı
              </h3>
              <button
                onClick={() => setShowInvite(false)}
                title="Kapat"
                className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-100"
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Bağlantı
                </label>
                <div className="flex items-stretch">
                  <input
                    readOnly
                    value={`${window.location.origin}/channel/${id}`}
                    className="flex-1 px-3 py-2 rounded-l bg-gray-900 border border-gray-700 text-gray-100 focus:outline-none"
                  />
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          `${window.location.origin}/channel/${id}`
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      } catch {}
                    }}
                    className={`px-3 rounded-r border border-l-0 ${
                      copied
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-gray-700 text-gray-100 hover:bg-gray-600 border-gray-700"
                    }`}
                    title="Kopyala"
                  >
                    {copied ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M8 12h8a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6a2 2 0 012-2z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Bu bağlantıyı arkadaşlarınla paylaşarak kanala davet
                  edebilirsin.
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowInvite(false)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-100"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceChannel;
