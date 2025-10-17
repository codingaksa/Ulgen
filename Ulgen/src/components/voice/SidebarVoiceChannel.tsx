import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeHigh,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import SidebarVoiceUser from "./SidebarVoiceUser";
import { useAuth } from "../../contexts/AuthContext.tsx";

type SidebarVoiceChannelProps = {
  channelId: string;
  name: string;
  isActive?: boolean;
};

const SidebarVoiceChannel: React.FC<SidebarVoiceChannelProps> = ({
  channelId,
  name,
  isActive,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [members, setMembers] = useState<
    {
      id: string;
      username: string;
      isMuted?: boolean;
      isDeafened?: boolean;
      isSpeaking?: boolean;
    }[]
  >([]);
  const { currentUser } = useAuth();
  const prevMembersRef = useRef<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Ensure socket connection for presence
    if (!socketRef.current) {
      const SOCKET_BASE =
        (import.meta as any).env?.VITE_SOCKET_BASE || "http://localhost:5000";
      socketRef.current = io(SOCKET_BASE, {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
    }
    const s = socketRef.current!;

    // Ask backend for current room members without joining
    const fetchState = () => {
      try {
        s.emit("get-room-state", String(channelId), (resp: any) => {
          const list = Array.isArray(resp?.users) ? resp.users : [];
          setMembers(
            list.map((u: any) => ({
              id: u.userId,
              username:
                u.username || `Kullanıcı ${String(u.userId || "").slice(0, 4)}`,
              isMuted: !!u.isMuted,
              isDeafened: !!u.isDeafened,
              isSpeaking: !!u.isSpeaking,
            }))
          );
        });
      } catch {}
    };

    const onJoined = (p: any) => {
      if (!p?.userId) return;
      setMembers((prev) => {
        if (prev.some((m) => m.id === p.userId)) return prev;
        return [
          ...prev,
          {
            id: p.userId,
            username: `Kullanıcı ${String(p.userId).slice(0, 4)}`,
            isMuted: false,
            isDeafened: false,
            isSpeaking: false,
          },
        ];
      });
    };
    const onLeft = (p: any) => {
      if (!p?.userId) return;
      setMembers((prev) => prev.filter((m) => m.id !== p.userId));
    };
    const onPresence = (p: any) => {
      const { userId, username, isMuted, isDeafened, isSpeaking } = p || {};
      if (!userId) return;
      setMembers((prev) =>
        prev.map((m) =>
          m.id === userId
            ? {
                ...m,
                username: username || m.username,
                isMuted: typeof isMuted === "boolean" ? isMuted : m.isMuted,
                isDeafened:
                  typeof isDeafened === "boolean" ? isDeafened : m.isDeafened,
                isSpeaking:
                  typeof isSpeaking === "boolean" ? isSpeaking : m.isSpeaking,
              }
            : m
        )
      );
    };

    s.on("user-joined", onJoined);
    s.on("user-left", onLeft);
    s.on("presence-update", onPresence);

    // Initial fetch and periodic refresh as fallback
    fetchState();
    const iv = setInterval(fetchState, 5000);
    const read = () => {
      try {
        const raw = localStorage.getItem("voicePresence");
        const map = raw ? JSON.parse(raw) : {};
        const chanId = String(channelId);
        const next = Array.isArray(map[chanId]) ? map[chanId] : [];
        // Join/Leave farkını bul ve toast göster
        try {
          const prevIds = new Set(prevMembersRef.current);
          const nextIds = new Set<string>(next.map((m: any) => m.id));
          const joined: string[] = [];
          const left: string[] = [];
          next.forEach((m: any) => {
            if (!prevIds.has(m.id)) joined.push(m.username || m.id);
          });
          prevMembersRef.current.forEach((pid) => {
            if (!nextIds.has(pid)) left.push(pid);
          });
          if (joined.length > 0) {
            // basit toast
            try {
              (window as any).showToast?.(
                "info",
                `${joined.join(", ")} ses kanalına katıldı`
              );
            } catch {}
          }
          if (left.length > 0) {
            try {
              (window as any).showToast?.(
                "info",
                `${left.join(", ")} ses kanalından ayrıldı`
              );
            } catch {}
          }
          prevMembersRef.current = next.map((m: any) => m.id);
        } catch {}
        setMembers(next);
      } catch {
        setMembers([]);
      }
    };
    read();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "voicePresence") read();
    };
    const onImmediate = () => {
      // Aynı sekmeden tetiklenen hızlı güncellemeleri yakala
      read();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("voice-presence-updated", onImmediate as any);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("voice-presence-updated", onImmediate as any);
      try {
        s.off("user-joined", onJoined);
        s.off("user-left", onLeft);
        s.off("presence-update", onPresence);
      } catch {}
      clearInterval(iv);
    };
  }, [channelId]);

  // Aktifken members boşsa kendini geçici olarak göster (anlık geri bildirim)
  useEffect(() => {
    if (isActive && members.length === 0 && currentUser?.username) {
      setMembers([
        {
          id: `self-${currentUser.username}`,
          username: currentUser.username,
          isMuted: false,
          isDeafened: false,
          isSpeaking: false,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, currentUser?.username]);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-[#1F1B24]/60 transition-colors text-gray-100 hover:text-gray-100 group relative">
        <FontAwesomeIcon icon={faVolumeHigh} className="w-4 h-4" />
        <span className="text-sm font-medium select-none cursor-default">
          {name}
        </span>
        <span className="text-xs opacity-60">{members.length}</span>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((v) => !v);
          }}
          className="ml-auto px-1 text-gray-400 hover:text-gray-100 cursor-pointer"
          title={isExpanded ? "Daralt" : "Genişlet"}
        >
          {isExpanded ? (
            <FontAwesomeIcon icon={faChevronUp} className="w-3.5 h-3.5" />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} className="w-3.5 h-3.5" />
          )}
        </div>
      </div>

      {isExpanded && members.length > 0 && (
        <div className="space-y-1 ml-6 pr-2">
          {members.map((u) => (
            <SidebarVoiceUser
              key={u.id}
              channelId={channelId}
              id={u.id}
              name={u.username}
              isMuted={u.isMuted}
              isDeafened={u.isDeafened}
              isSelf={u.username === (currentUser?.username || "")}
              speaking={!!u.isSpeaking}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarVoiceChannel;
