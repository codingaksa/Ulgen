// client/src/pages/Dashboard.tsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";
import { io, Socket } from "socket.io-client";
import {
  getServers,
  createServer,
  getChannels,
  deleteServer,
  createChannel,
  updateServer,
  updateChannelService,
  deleteChannelService,
} from "../services/serverService.ts";
import { useToast } from "../components/Toast.tsx";
import { avatarService } from "../services/avatarService";
import {
  messageService,
  type Message as MessageType,
} from "../services/messageService";
import { friendService } from "../services/friendService";
import { fileService } from "../services/fileService";
import {
  createInviteLink,
  verifyInviteToken,
  consumeInviteToken,
  listInvites,
  revokeInvite,
} from "../services/inviteService.ts";
import VoiceChannel from "./VoiceChannel.tsx";
import ServerRail from "../components/ServerRail.tsx";
import ChannelSidebar from "../components/ChannelSidebar.tsx";

interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

interface User {
  id: string;
  username: string;
  status: "online" | "away" | "dnd" | "offline";
  avatar?: string;
  role?: "owner" | "admin" | "member";
  email?: string;
  lastSeen?: string;
  joinedAt?: string;
}

const Dashboard: React.FC = () => {
  const { currentUser, updateStatus } = useAuth();
  const { showToast } = useToast();
  const [isMembersOpen, setIsMembersOpen] = useState(true);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [userStatus, setUserStatus] = useState<
    "online" | "away" | "dnd" | "offline"
  >("online");

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("#status-menu-trigger") &&
        !target.closest("#status-menu-panel")
      ) {
        setIsStatusOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [servers, setServers] = useState<
    { id: string; name: string; owner?: string }[]
  >([]);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [channelsList, setChannelsList] = useState<
    { id: string; name: string; description?: string }[]
  >([]);
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [newServerName, setNewServerName] = useState("");
  const [newServerIcon, setNewServerIcon] = useState("");
  const [joinLink, setJoinLink] = useState("");

  // Girilen metinden davet tokenını daha toleranslı çek
  const extractInviteToken = (raw: string): string | null => {
    if (!raw) return null;
    const input = raw.trim();
    // 1) inviteToken=... desenini yakala (metnin herhangi bir yerinde)
    const m = input.match(/inviteToken=([^&\s]+)/i);
    if (m && m[1]) return m[1];
    // 2) Tam URL ise normal parse dene
    if (/^https?:\/\//i.test(input)) {
      try {
        const u = new URL(input);
        const t = u.searchParams.get("inviteToken");
        if (t) return t;
      } catch {}
    }
    // 3) Boşluksuz metin ise token olarak kabul et
    if (!/\s/.test(input) && input.length >= 8) return input;
    return null;
  };
  const [showEditServer, setShowEditServer] = useState(false);
  const [editServerName, setEditServerName] = useState("");
  const [editServerIcon, setEditServerIcon] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    serverId?: string;
    serverName?: string;
  }>({ open: false });
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [unreadById, setUnreadById] = useState<Record<string, number>>({});
  const [confirmChannel, setConfirmChannel] = useState<{
    open: boolean;
    channelId?: string;
    channelName?: string;
  }>({ open: false });
  const [voiceChannels, setVoiceChannels] = useState<
    { id: string; name: string }[]
  >([]);
  const [showCreateVoiceChannel, setShowCreateVoiceChannel] = useState(false);
  const [newVoiceChannelName, setNewVoiceChannelName] = useState("");
  const [voiceServerId, setVoiceServerId] = useState<string | null>(null);
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>(null); // aktif ses kanalı (presence için)
  const [showServerInvite, setShowServerInvite] = useState(false);
  const [serverInviteCopied, setServerInviteCopied] = useState(false);
  const [currentInviteLink, setCurrentInviteLink] = useState("");
  const [inviteMaxUses, setInviteMaxUses] = useState<number>(1);
  const [inviteExpiresIn, setInviteExpiresIn] = useState<number>(
    3 * 24 * 60 * 60 * 1000
  );
  const [existingInvites, setExistingInvites] = useState<
    Array<{
      id: string;
      createdAt: number;
      expiresAt: number | null;
      remainingUses: number;
    }>
  >([]);
  const [renameModal, setRenameModal] = useState<{
    open: boolean;
    channelId?: string;
    currentName?: string;
    name: string;
    saving?: boolean;
    description?: string;
    error?: string;
  }>({ open: false, name: "", description: "" });

  // Socket.IO bağlantısı
  const socketRef = useRef<Socket | null>(null);
  const selectedChannelId = activeChannelId;

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Mesajlar başlangıçta boş, kanal seçildiğinde yüklenecek
  }, []);

  // Mesaj geçmişini yükle
  const loadMessageHistory = async (channelId: string) => {
    if (!channelId) return;

    try {
      const response = await messageService.getMessages(channelId, 1, 50);
      if (response.success) {
        // Mesajları formatla
        const formattedMessages = response.messages.map((msg: MessageType) => ({
          id: msg._id,
          username: msg.username,
          content: msg.content,
          timestamp: msg.formattedTime,
          avatar: msg.avatar,
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Mesaj geçmişi yüklenirken hata:", error);
      showToast("error", "Mesaj geçmişi yüklenirken hata oluştu");
    }
  };

  // Kanal değiştiğinde mesaj geçmişini yükle
  useEffect(() => {
    if (selectedChannelId) {
      loadMessageHistory(selectedChannelId);
    } else {
      setMessages([]);
    }
  }, [selectedChannelId]);

  // Fetch servers on mount
  useEffect(() => {
    (async () => {
      // URL'deki davet ile sunucuyu otomatik seç
      try {
        const params = new URLSearchParams(window.location.search);
        const inviteToken = params.get("inviteToken");
        const invite = params.get("invite");
        const channelParam = params.get("channel");
        if (inviteToken) {
          try {
            // Önce doğrula
            const verifyRes = await verifyInviteToken(inviteToken);
            if (verifyRes.valid && verifyRes.serverId) {
              // Sonra tüket ve sunucuya katıl
              const consumeRes = await consumeInviteToken(inviteToken);
              if (consumeRes.success) {
                setSelectedServerId(consumeRes.serverId || verifyRes.serverId);
                showToast("success", "Sunucuya başarıyla katıldınız!");
                // Sunucu listesini yenile
                const token = localStorage.getItem("token");
                if (token) {
                  getServers(token);
                }
              } else {
                showToast("error", "Davet kullanılamadı veya süresi dolmuş");
              }
            } else {
              showToast("error", "Geçersiz davet linki");
            }
          } catch (error) {
            console.error("Invite processing error:", error);
            showToast("error", "Davet işlenirken hata oluştu");
          }
          const url = new URL(window.location.href);
          url.searchParams.delete("inviteToken");
          window.history.replaceState({}, "", url.toString());
        } else if (invite) {
          setSelectedServerId(invite);
          const url = new URL(window.location.href);
          url.searchParams.delete("invite");
          window.history.replaceState({}, "", url.toString());
        } else if (channelParam) {
          setActiveChannelId(channelParam);
          const url = new URL(window.location.href);
          url.searchParams.delete("channel");
          window.history.replaceState({}, "", url.toString());
        }
      } catch {}
      const token = localStorage.getItem("token");
      console.log(
        "Dashboard: Token from localStorage:",
        token ? "present" : "missing"
      );
      if (!token) return;
      getServers(token)
        .then((list) => {
          console.log("Dashboard: Received servers list:", list);
          const apiServers: { id: string; name: string; owner?: string }[] =
            list.map((s) => ({
              id: (s as any).id || (s as any)._id || s.id,
              name: s.name,
              owner: (s as any).owner,
            }));
          // Sadece backend'den gelen sunucuları kullan, localStorage'dan eski sunucuları ekleme
          console.log("Setting servers state to:", apiServers);
          setServers(apiServers);
        })
        .catch(() => {});
    })();
  }, []);

  // Fetch channels when server changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !selectedServerId) return;
    getChannels(token, selectedServerId)
      .then((chs) => {
        setChannelsList(
          chs.map((c) => ({
            id: (c as any).id || (c as any)._id || c.id,
            name: c.name,
            description: (c as any).description,
          }))
        );
        const init: Record<string, number> = {};
        chs.forEach((c: any) => {
          const id = (c as any).id || (c as any)._id || c.id;
          init[id] = 0;
        });
        setUnreadById(init);
        // Load voice channels from backend (channels with type "voice")
        const voiceChannels = chs
          .filter((c: any) => c.type === "voice")
          .map((c: any) => ({
            id: (c as any).id || (c as any)._id || c.id,
            name: c.name,
          }));
        setVoiceChannels(voiceChannels);

        // Fallback: Load from localStorage if no backend channels
        if (voiceChannels.length === 0) {
          try {
            const raw = localStorage.getItem("voiceChannels");
            const map = raw ? JSON.parse(raw) : {};
            const arr = Array.isArray(map[selectedServerId])
              ? map[selectedServerId]
              : [];
            setVoiceChannels(arr);
          } catch {
            setVoiceChannels([]);
          }
        }
      })
      .catch(() => {});
  }, [selectedServerId]);

  // Socket.IO bağlantısını kur
  useEffect(() => {
    if (!socketRef.current) {
      const SOCKET_BASE =
        (import.meta as any).env?.VITE_SOCKET_BASE || "http://localhost:5000";
      socketRef.current = io(SOCKET_BASE, {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });

      // Mesaj dinleyicisi
      socketRef.current.on("new-message", (messageData) => {
        const message: Message = {
          id: messageData.id,
          username: messageData.username,
          content: messageData.content,
          timestamp: new Date(messageData.timestamp).toLocaleTimeString(
            "tr-TR",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        };
        setMessages((prev) => [...prev, message]);
      });

      // Kanal üyelerini güncelle
      socketRef.current.on("get-channel-members", (data) => {
        if (data?.members) {
          const realUsers = data.members.map((member: any) => ({
            id: member.userId,
            username: member.username,
            status: member.isOnline ? "online" : "offline",
          }));
          setUsers(realUsers);
        }
      });

      // Gerçek zamanlı ayar güncellemelerini dinle
      socketRef.current.on("user-settings-updated", (data) => {
        console.log("Kullanıcı ayarları güncellendi:", data);
        // Toast bildirimi göster
        showToast("info", `${data.username} ayarlarını güncelledi`);
      });

      socketRef.current.on("user-status-updated", (data) => {
        console.log("Kullanıcı durumu güncellendi:", data);
        // Kullanıcı durumunu güncelle
        setUsers((prev) =>
          prev.map((user) =>
            user.id === data.userId ? { ...user, status: data.status } : user
          )
        );
        showToast(
          "info",
          `${data.username} durumunu ${data.status} olarak değiştirdi`
        );
      });

      // Backend'in bağlantı anında çevrimiçi kullanıcıları göndermesi için
      socketRef.current.emit("get-online-users");

      socketRef.current.on("audio-video-settings-updated", (data) => {
        console.log("Ses/video ayarları güncellendi:", data);
        showToast("info", `${data.username} ses/video ayarlarını güncelledi`);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Sunucu değiştiğinde gerçek üyeleri güncelle
  useEffect(() => {
    if (selectedServerId && socketRef.current) {
      socketRef.current.emit(
        "get-server-members",
        selectedServerId,
        (data: any) => {
          if (data?.members) {
            const realUsers = data.members.map((member: any) => ({
              id: member.userId,
              username: member.username,
              // Backend artık status alanını döndürüyor; yoksa isOnline'a göre türet
              status: member.status || (member.isOnline ? "online" : "offline"),
              role: member.role,
              avatar: member.avatar,
              email: member.email,
              lastSeen: member.lastSeen,
              joinedAt: member.joinedAt,
            }));
            setUsers(realUsers);
          }
        }
      );
    }
  }, [selectedServerId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedChannelId && socketRef.current) {
      // Socket.IO ile mesajı gönder
      socketRef.current.emit("send-message", {
        channelId: selectedChannelId,
        message: newMessage,
        username: currentUser?.username || "Sen",
        userId: currentUser?.id,
      });
      setNewMessage("");
    }
  };

  // Dosya yükleme fonksiyonu
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !selectedChannelId) return;

    // Dosya boyutu kontrolü (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast("error", "Dosya boyutu 10MB'dan küçük olmalıdır");
      return;
    }

    try {
      const response = await fileService.uploadFile(file, selectedChannelId);
      if (response.success && response.file) {
        // Dosya mesajı olarak gönder
        const fileMessage = `${fileService.getFileIcon(file.type)} **${
          response.file.originalName
        }** (${fileService.formatFileSize(response.file.size)})`;

        if (socketRef.current) {
          socketRef.current.emit("send-message", {
            channelId: selectedChannelId,
            message: fileMessage,
            username: currentUser?.username || "Sen",
            userId: currentUser?.id,
          });
        }

        showToast("success", "Dosya başarıyla yüklendi");
      }
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Dosya yüklenirken hata oluştu"
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "dnd":
        return "bg-red-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <div className="h-[calc(100vh-4.15rem)] bg-black flex overflow-hidden">
        {/* Sol tarafta: Sunucu şeridi */}
        <ServerRail
          servers={servers as any}
          selectedServerId={selectedServerId}
          onSelect={(id) => setSelectedServerId(id)}
          onCreate={() => {
            setNewServerName("");
            setNewServerIcon("");
            setShowCreateServer(true);
          }}
          onInvite={async () => {
            if (!selectedServerId) return;
            const link = await createInviteLink(selectedServerId, {
              maxUses: inviteMaxUses,
              expiresInMs: inviteExpiresIn,
            });
            setCurrentInviteLink(link);
            setShowServerInvite(true);
            setServerInviteCopied(false);
            try {
              const list = await listInvites(selectedServerId);
              setExistingInvites(
                list.map((it) => ({
                  id: it.id,
                  createdAt: it.createdAt,
                  expiresAt: it.expiresAt,
                  remainingUses: it.remainingUses,
                }))
              );
            } catch {}
          }}
          onEdit={() => {
            if (!selectedServerId) return;
            const current = servers.find((s) => s.id === selectedServerId);
            setEditServerName(current?.name || "");
            setEditServerIcon(null);
            setShowEditServer(true);
          }}
          onDelete={(srv) =>
            setConfirmDelete({
              open: true,
              serverId: srv.id,
              serverName: srv.name,
            })
          }
        />
        {/* Kanal ve kullanıcı bölümü */}
        <div className="w-68 bg-black flex flex-col h-full min-h-full border-r border-gray-800">
          {/* Kanallar */}
          <div className="flex-1 p-4 space-y-4 overflow-y-hidden">
            <ChannelSidebar
              textChannels={channelsList}
              voiceChannels={voiceChannels}
              activeTextId={activeChannelId}
              unreadById={unreadById}
              activeVoiceId={activeVoiceId}
              onSelectText={(id) => {
                setActiveChannelId(id);
                // Aktif olunca unread'i sıfırla
                setUnreadById((prev) => ({ ...prev, [id]: 0 }));
              }}
              onCreateText={() => {
                if (!selectedServerId) return;
                const me = currentUser?.id;
                const sel = servers.find((s) => s.id === selectedServerId);
                if (sel && me && sel.owner && sel.owner !== me) {
                  showToast(
                    "error",
                    "Bu sunucuda kanal oluşturma yetkiniz yok (sahip değilsiniz)."
                  );
                  return;
                }
                setNewChannelName("");
                setShowCreateChannel(true);
              }}
              onRenameText={async (id, currentName) => {
                setRenameModal({
                  open: true,
                  channelId: id,
                  currentName,
                  name: currentName,
                });
              }}
              onDeleteText={(id, name) =>
                setConfirmChannel({
                  open: true,
                  channelId: id,
                  channelName: name,
                })
              }
              onCreateVoice={() => {
                const me = currentUser?.id;
                const sel = servers.find((s) => s.id === selectedServerId);
                if (!selectedServerId || !sel) return;
                if (sel && me && sel.owner && sel.owner !== me) {
                  showToast("error", "Only owner can create channels");
                  return;
                }
                setVoiceServerId(selectedServerId || null);
                setNewVoiceChannelName("");
                setShowCreateVoiceChannel(true);
              }}
              onToggleActiveVoice={(id) => {
                setActiveVoiceId((prev) => (prev === id ? prev : id));
                // Tek tıklamada anında görünür kıl (VoiceChannel mount beklemeden)
                if (activeVoiceId !== id) {
                  try {
                    const key = "voicePresence";
                    const raw = localStorage.getItem(key);
                    const map = raw ? JSON.parse(raw) : {};
                    const chanId = String(id);
                    const selfName = currentUser?.username || "You";
                    const selfRec = {
                      id: `self-${selfName}`,
                      username: selfName,
                      isMuted: false,
                      isDeafened: false,
                      isSpeaking: false,
                    };
                    const others = Array.isArray(map[chanId])
                      ? map[chanId].filter((u: any) => u.username !== selfName)
                      : [];
                    map[chanId] = [selfRec, ...others];
                    localStorage.setItem(key, JSON.stringify(map));
                    window.dispatchEvent(
                      new CustomEvent("voice-presence-updated", {
                        detail: { channelId: chanId },
                      })
                    );
                  } catch {}
                }
              }}
              onDeleteVoice={(id, name) => {
                setConfirmChannel({
                  open: true,
                  channelId: id,
                  channelName: name,
                });
              }}
            />

            {/* Aktif ses kanalı için görünmez mount (presence/state) */}
            {activeVoiceId && (
              <div className="hidden">
                {/* eslint-disable-next-line react/jsx-no-undef */}
                {/* @ts-ignore */}
                <VoiceChannel channelId={activeVoiceId} />
              </div>
            )}

            {showEditServer && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="w-full max-w-md bg-[#121212] border border-gray-700 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Sunucuyu Düzenle
                  </h3>
                  <div className="space-y-3">
                    <input
                      value={editServerName}
                      onChange={(e) => setEditServerName(e.target.value)}
                      placeholder="Sunucu adı"
                      className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Logo
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-700 bg-[#121212] flex items-center justify-center">
                          {editServerIcon ? (
                            <img
                              src={editServerIcon}
                              alt="Önizleme"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-600 text-xs">
                              Değiştirmezseniz aynı kalır
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            id="serverLogoEdit"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) {
                                setEditServerIcon(null);
                                return;
                              }
                              const r = new FileReader();
                              r.onload = () =>
                                setEditServerIcon(String(r.result));
                              r.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="serverLogoEdit"
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-[#121212] hover:bg-[#1F1B24] text-gray-100 cursor-pointer"
                          >
                            Dosya Seç
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      onClick={() => setShowEditServer(false)}
                      className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-[#121212]"
                    >
                      İptal
                    </button>
                    <button
                      onClick={async () => {
                        if (!selectedServerId) return;
                        const token = localStorage.getItem("token");
                        if (!token) return;
                        try {
                          const updated = await updateServer(
                            token,
                            selectedServerId,
                            {
                              name: editServerName.trim() || undefined,
                              icon:
                                editServerIcon === null
                                  ? undefined
                                  : editServerIcon,
                            }
                          );
                          setServers((prev) =>
                            prev.map((s) =>
                              s.id === selectedServerId
                                ? {
                                    id: s.id,
                                    name:
                                      (updated as any).name || editServerName,
                                    ...((updated as any).icon
                                      ? { icon: (updated as any).icon }
                                      : {}),
                                  }
                                : s
                            )
                          );
                          setShowEditServer(false);
                          if (
                            typeof window !== "undefined" &&
                            typeof (window as any).showToast === "function"
                          ) {
                            (window as any).showToast(
                              "success",
                              "Sunucu güncellendi"
                            );
                          }
                        } catch {
                          if (
                            typeof window !== "undefined" &&
                            typeof (window as any).showToast === "function"
                          ) {
                            (window as any).showToast(
                              "error",
                              "Sunucu güncellenemedi"
                            );
                          }
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-scroll-accent hover:bg-scroll-accent-strong text-white"
                    >
                      Kaydet
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showCreateVoiceChannel && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
                <div className="w-full max-w-sm bg-[#121212] border border-gray-700 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-white text-lg font-semibold mb-3">
                    Yeni Sesli Kanal
                  </h3>
                  {(!selectedServerId || voiceServerId === null) && (
                    <div className="mb-3">
                      <label className="block text-gray-300 text-sm mb-2">
                        Sunucu
                      </label>
                      <select
                        value={voiceServerId || ""}
                        onChange={(e) =>
                          setVoiceServerId(e.target.value || null)
                        }
                        className="w-full px-3 py-2 rounded bg-[#121212] border border-gray-700 text-gray-100"
                      >
                        <option value="">Sunucu seçin</option>
                        {servers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <input
                    value={newVoiceChannelName}
                    onChange={(e) => setNewVoiceChannelName(e.target.value)}
                    placeholder="Kanal adı"
                    className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      onClick={() => setShowCreateVoiceChannel(false)}
                      className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-[#121212]"
                    >
                      İptal
                    </button>
                    <button
                      onClick={async () => {
                        if (!newVoiceChannelName.trim()) return;
                        const name = newVoiceChannelName.trim();
                        const targetServerId =
                          selectedServerId || voiceServerId;
                        if (!targetServerId) {
                          showToast("error", "Önce bir sunucu seçin");
                          return;
                        }

                        // Create voice channel in backend
                        const token = localStorage.getItem("token");
                        if (token && targetServerId) {
                          try {
                            const newChannel = await createChannel(
                              token,
                              targetServerId,
                              name,
                              "Voice Channel",
                              "voice"
                            );
                            setVoiceChannels((prev) => [
                              ...prev,
                              { id: newChannel.id, name: newChannel.name },
                            ]);
                            showToast("success", "Ses kanalı oluşturuldu");
                          } catch (error) {
                            console.error(
                              "Voice channel creation failed:",
                              error
                            );
                            showToast(
                              "error",
                              "Ses kanalı oluşturulamadı: " +
                                (error as any).message
                            );
                          }
                        }
                        setShowCreateVoiceChannel(false);
                        setNewVoiceChannelName("");
                      }}
                      className="px-4 py-2 rounded-lg bg-scroll-accent hover:bg-scroll-accent-strong text-white"
                    >
                      Oluştur
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showCreateChannel && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="w-full max-w-sm bg-[#121212] border border-gray-700 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-white text-lg font-semibold mb-3">
                    Yeni Kanal
                  </h3>
                  <input
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="Kanal adı"
                    className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      onClick={() => setShowCreateChannel(false)}
                      className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-[#121212]"
                    >
                      İptal
                    </button>
                    <button
                      onClick={async () => {
                        if (!newChannelName.trim() || !selectedServerId) return;
                        const token = localStorage.getItem("token");
                        if (!token) return;
                        try {
                          const created = await createChannel(
                            token,
                            selectedServerId,
                            newChannelName.trim()
                          );
                          setChannelsList((prev) => [
                            ...prev,
                            {
                              id:
                                (created as any).id ||
                                (created as any)._id ||
                                created.id,
                              name: created.name,
                            },
                          ]);
                          setUnreadById((prev) => ({
                            ...prev,
                            [(created as any).id ||
                            (created as any)._id ||
                            created.id]: 0,
                          }));
                          setActiveChannelId(
                            (created as any).id ||
                              (created as any)._id ||
                              created.id
                          );
                          setShowCreateChannel(false);
                          showToast("success", "Kanal oluşturuldu");
                        } catch {
                          showToast("error", "Kanal oluşturulamadı");
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-scroll-accent hover:bg-scroll-accent-strong text-white"
                    >
                      Oluştur
                    </button>
                  </div>
                </div>
              </div>
            )}
            {confirmChannel.open && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="w-full max-w-sm bg-[#121212] border border-gray-700 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-white text-lg font-semibold mb-3">
                    Kanalı sil?
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {confirmChannel.channelName} kalıcı olarak silinecek.
                  </p>
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      onClick={() => setConfirmChannel({ open: false })}
                      className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-[#121212]"
                    >
                      İptal
                    </button>
                    <button
                      onClick={async () => {
                        const token = localStorage.getItem("token");
                        if (
                          !token ||
                          !selectedServerId ||
                          !confirmChannel.channelId
                        )
                          return;
                        try {
                          await deleteChannelService(
                            token,
                            selectedServerId,
                            confirmChannel.channelId
                          );

                          // UI'dan hem metin hem ses kanalı listelerinden temizle
                          setChannelsList((prev) =>
                            prev.filter(
                              (c) => c.id !== confirmChannel.channelId
                            )
                          );
                          setVoiceChannels((prev) =>
                            prev.filter(
                              (v) => v.id !== confirmChannel.channelId
                            )
                          );
                          setUnreadById((prev) => {
                            const cp = { ...prev } as Record<string, number>;
                            delete cp[confirmChannel.channelId!];
                            return cp;
                          });
                          if (activeChannelId === confirmChannel.channelId)
                            setActiveChannelId(null);
                          if (activeVoiceId === confirmChannel.channelId)
                            setActiveVoiceId(null);
                          setConfirmChannel({ open: false });
                          showToast("success", "Kanal silindi");
                        } catch (error) {
                          console.error("Channel deletion failed:", error);
                          showToast(
                            "error",
                            "Kanal silinemedi: " + (error as any).message
                          );
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-scroll-accent hover:bg-scroll-accent-strong text-white"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kullanıcı Bilgisi */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {getInitials(currentUser?.username || "Kullanıcı")}
                  </span>
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                    userStatus
                  )} rounded-full border-2 border-gray-800`}
                ></div>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium leading-tight mb-0">
                  {currentUser?.username}
                </p>
                <div className="relative inline-block">
                  <button
                    id="status-menu-trigger"
                    onClick={() => setIsStatusOpen((v) => !v)}
                    className="text-gray-400 text-xs hover:text-white flex items-center space-x-1 mt-0.5"
                    type="button"
                  >
                    <span>
                      {userStatus === "online"
                        ? "Çevrimiçi"
                        : userStatus === "away"
                        ? "Uzakta"
                        : userStatus === "dnd"
                        ? "Rahatsız Etmeyin"
                        : "Çevrimdışı"}
                    </span>
                    <svg
                      className={`w-3 h-3 transform transition-transform ${
                        isStatusOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isStatusOpen && (
                    <div
                      id="status-menu-panel"
                      className="absolute left-0 bottom-6 bg-[#121212] border border-gray-700 rounded-lg shadow-lg w-44 z-10 py-1"
                    >
                      <button
                        onClick={async () => {
                          setUserStatus("online");
                          setIsStatusOpen(false);
                          try {
                            await updateStatus("online");
                          } catch {}
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#121212]"
                      >
                        Çevrimiçi
                      </button>
                      <button
                        onClick={async () => {
                          setUserStatus("away");
                          setIsStatusOpen(false);
                          try {
                            await updateStatus("away");
                          } catch {}
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#121212]"
                      >
                        Uzakta
                      </button>
                      <button
                        onClick={async () => {
                          setUserStatus("dnd");
                          setIsStatusOpen(false);
                          try {
                            await updateStatus("dnd");
                          } catch {}
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#121212]"
                      >
                        Rahatsız Etmeyin
                      </button>
                      <button
                        onClick={async () => {
                          setUserStatus("offline");
                          setIsStatusOpen(false);
                          try {
                            await updateStatus("offline");
                          } catch {}
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#121212]"
                      >
                        Çevrimdışı
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {activeVoiceId && (
                <button
                  onClick={() => {
                    try {
                      window.dispatchEvent(
                        new CustomEvent("voice-leave", {
                          detail: { channelId: activeVoiceId },
                        })
                      );
                    } catch {}
                    setActiveVoiceId(null);
                  }}
                  className="p-1 text-red-500 hover:text-red-400"
                  title="Ses kanalından ayrıl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320zM576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320zM188.7 308.7C182.5 314.9 182.5 325.1 188.7 331.3L292.7 435.3C297.3 439.9 304.2 441.2 310.1 438.8C316 436.4 320 430.5 320 424L320 352L424 352C437.3 352 448 341.3 448 328L448 312C448 298.7 437.3 288 424 288L320 288L320 216C320 209.5 316.1 203.7 310.1 201.2C304.1 198.7 297.2 200.1 292.7 204.7L188.7 308.7z"
                    />
                  </svg>
                </button>
              )}
              <Link
                to="/settings"
                className="p-1 text-gray-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Ana Chat Alanı */}
        <div className="flex-1 flex flex-col">
          {/* Modern Chat Header */}
          <div className="h-16 bg-black border-b border-gray-800 flex items-center px-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-scroll-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">#</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg">
                  {channelsList.length > 0 && activeChannelId
                    ? channelsList.find((c) => c.id === activeChannelId)
                        ?.name || "kanal"
                    : "—"}
                </span>
                <p className="text-gray-400 text-sm">Metin kanalı</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 ml-auto">
              <button className="p-1 text-gray-400 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <button className="p-1 text-gray-400 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h6v-2H4v2zM4 11h6V9H4v2zM4 7h6V5H4v2z"
                  />
                </svg>
              </button>
              <button className="p-1 text-gray-400 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsMembersOpen((v) => !v)}
                className="p-1 text-gray-400 hover:text-white"
                title="Üyeleri göster/gizle"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
              <span className="text-gray-400 text-sm">
                Üyeler - {users.length}
              </span>
            </div>
          </div>

          {/* Chat İçeriği */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Metin kanalı yoksa sohbet alanı gösterme */}
            {channelsList.length === 0 || !activeChannelId ? (
              <div className="text-center py-10 text-gray-400">
                <div className="w-14 h-14 bg-[#121212] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">#</span>
                </div>
                <p>Önce bir metin kanalı oluşturun.</p>
              </div>
            ) : (
              <>
                {/* Kanal açıklaması (başlık gösterilmez) */}
                <div className="mb-3">
                  {channelsList.find((c) => c.id === activeChannelId)
                    ?.description && (
                    <p className="text-gray-400 text-sm">
                      {
                        channelsList.find((c) => c.id === activeChannelId)
                          ?.description
                      }
                    </p>
                  )}
                </div>

                {/* Mesajlar */}
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">
                          {getInitials(message.username)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-white font-medium">
                            {message.username}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {message.timestamp}
                          </span>
                        </div>
                        <p className="text-gray-300 mt-1">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mesaj Input */}
          {channelsList.length > 0 && activeChannelId ? (
            <div className="p-4 border-t border-gray-700">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-3"
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`+ #${
                      channelsList.find((c) => c.id === activeChannelId)
                        ?.name || ""
                    } kanalına mesaj gönder`}
                    className="w-full px-4 py-3 bg-[#121212] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
                <label className="p-2 text-gray-400 hover:text-white cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
                  />
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </label>
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>
                <button
                  type="submit"
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>
            </div>
          ) : null}
        </div>

        {/* Sağ Sidebar - Üye Listesi */}
        <div
          className={`bg-black border-l border-gray-800 h-full min-h-full flex flex-col overflow-hidden transition-all duration-300 ${
            isMembersOpen ? "w-60 translate-x-0" : "w-0 translate-x-full"
          }`}
          aria-hidden={!isMembersOpen}
        >
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMembersOpen((v) => !v)}
                className="p-1 text-gray-400 hover:text-white"
                title="Üyeleri göster/gizle"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
              <h3 className="text-white font-semibold">
                Üyeler - {users.length}
              </h3>
              {/* Sunucu Davet - buradan kaldırıldı, sol üst başlığa taşındı */}
            </div>
          </div>
          <div
            className={`flex-1 p-4 space-y-4 overflow-y-auto transition-opacity ${
              isMembersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Çevrimiçi */}
            <div>
              <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">
                ÇEVRİMİÇİ - {users.filter((u) => u.status === "online").length}
              </h4>
              <div className="space-y-2">
                {users
                  .filter((u) => u.status === "online")
                  .map((user) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img
                              src={avatarService.getAvatarUrl(user.avatar)}
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-medium text-sm">
                              {getInitials(user.username)}
                            </span>
                          )}
                        </div>
                        {user.role === "owner" && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-black text-xs font-bold">
                              👑
                            </span>
                          </div>
                        )}
                        {user.role === "admin" && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              A
                            </span>
                          </div>
                        )}
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                            user.status
                          )} rounded-full border-2 border-gray-800`}
                        ></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white text-sm">
                          {user.username}
                        </span>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={async () => {
                              try {
                                const response =
                                  await friendService.sendFriendRequest(
                                    user.id
                                  );
                                if (response.success) {
                                  showToast(
                                    "success",
                                    "Arkadaşlık isteği gönderildi!"
                                  );
                                }
                              } catch (error) {
                                showToast(
                                  "error",
                                  error instanceof Error
                                    ? error.message
                                    : "Hata oluştu"
                                );
                              }
                            }}
                            className="text-xs bg-scroll-accent hover:bg-scroll-accent-strong text-white px-2 py-1 rounded transition-colors"
                            title="Arkadaş ekle"
                          >
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Uzakta */}
            <div>
              <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">
                UZAKTA - {users.filter((u) => u.status === "away").length}
              </h4>
              <div className="space-y-2">
                {users
                  .filter((u) => u.status === "away")
                  .map((user) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img
                              src={avatarService.getAvatarUrl(user.avatar)}
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-medium text-sm">
                              {getInitials(user.username)}
                            </span>
                          )}
                        </div>
                        {user.role === "owner" && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-black text-xs font-bold">
                              👑
                            </span>
                          </div>
                        )}
                        {user.role === "admin" && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              A
                            </span>
                          </div>
                        )}
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                            user.status
                          )} rounded-full border-2 border-gray-800`}
                        ></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white text-sm">
                          {user.username}
                        </span>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={async () => {
                              try {
                                const response =
                                  await friendService.sendFriendRequest(
                                    user.id
                                  );
                                if (response.success) {
                                  showToast(
                                    "success",
                                    "Arkadaşlık isteği gönderildi!"
                                  );
                                }
                              } catch (error) {
                                showToast(
                                  "error",
                                  error instanceof Error
                                    ? error.message
                                    : "Hata oluştu"
                                );
                              }
                            }}
                            className="text-xs bg-scroll-accent hover:bg-scroll-accent-strong text-white px-2 py-1 rounded transition-colors"
                            title="Arkadaş ekle"
                          >
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Rahatsız Etmeyin */}
            <div>
              <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">
                RAHATSIZ ETMEYİN -{" "}
                {users.filter((u) => u.status === "dnd").length}
              </h4>
              <div className="space-y-2">
                {users
                  .filter((u) => u.status === "dnd")
                  .map((user) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img
                              src={avatarService.getAvatarUrl(user.avatar)}
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-medium text-sm">
                              {getInitials(user.username)}
                            </span>
                          )}
                        </div>
                        {user.role === "owner" && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-black text-xs font-bold">
                              👑
                            </span>
                          </div>
                        )}
                        {user.role === "admin" && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              A
                            </span>
                          </div>
                        )}
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                            user.status
                          )} rounded-full border-2 border-gray-800`}
                        ></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white text-sm">
                          {user.username}
                        </span>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={async () => {
                              try {
                                const response =
                                  await friendService.sendFriendRequest(
                                    user.id
                                  );
                                if (response.success) {
                                  showToast(
                                    "success",
                                    "Arkadaşlık isteği gönderildi!"
                                  );
                                }
                              } catch (error) {
                                showToast(
                                  "error",
                                  error instanceof Error
                                    ? error.message
                                    : "Hata oluştu"
                                );
                              }
                            }}
                            className="text-xs bg-scroll-accent hover:bg-scroll-accent-strong text-white px-2 py-1 rounded transition-colors"
                            title="Arkadaş ekle"
                          >
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Çevrimdışı */}
            <div>
              <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">
                ÇEVRİMDIŞI -{" "}
                {users.filter((u) => u.status === "offline").length}
              </h4>
              <div className="space-y-2">
                {users
                  .filter((u) => u.status === "offline")
                  .map((user) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img
                              src={avatarService.getAvatarUrl(user.avatar)}
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-medium text-sm">
                              {getInitials(user.username)}
                            </span>
                          )}
                        </div>
                        {user.role === "owner" && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-black text-xs font-bold">
                              👑
                            </span>
                          </div>
                        )}
                        {user.role === "admin" && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              A
                            </span>
                          </div>
                        )}
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                            user.status
                          )} rounded-full border-2 border-gray-800`}
                        ></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white text-sm">
                          {user.username}
                        </span>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={async () => {
                              try {
                                const response =
                                  await friendService.sendFriendRequest(
                                    user.id
                                  );
                                if (response.success) {
                                  showToast(
                                    "success",
                                    "Arkadaşlık isteği gönderildi!"
                                  );
                                }
                              } catch (error) {
                                showToast(
                                  "error",
                                  error instanceof Error
                                    ? error.message
                                    : "Hata oluştu"
                                );
                              }
                            }}
                            className="text-xs bg-scroll-accent hover:bg-scroll-accent-strong text-white px-2 py-1 rounded transition-colors"
                            title="Arkadaş ekle"
                          >
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      {showCreateServer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-[#121212] border border-gray-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-white text-lg font-semibold mb-4">
              Yeni Sunucu Oluştur
            </h3>
            <div className="space-y-3">
              <input
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                placeholder="Sunucu adı"
                className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="mt-4 p-3 rounded-lg bg-[#121212] border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-200 text-sm font-semibold">
                    Var olan sunucuya katıl
                  </span>
                  <button
                    onClick={async () => {
                      try {
                        const token = extractInviteToken(joinLink);
                        if (!token) {
                          showToast("error", "Geçerli bir davet linki girin");
                          return;
                        }

                        // Önce doğrula
                        const verifyRes = await verifyInviteToken(token);
                        if (verifyRes.valid && verifyRes.serverId) {
                          // Sonra tüket ve sunucuya katıl
                          const consumeRes = await consumeInviteToken(token);
                          if (consumeRes.success) {
                            setSelectedServerId(
                              consumeRes.serverId || verifyRes.serverId
                            );
                            setShowCreateServer(false);
                            setJoinLink("");
                            showToast(
                              "success",
                              "Sunucuya başarıyla katıldınız!"
                            );

                            // Sunucu listesini yenile
                            const token = localStorage.getItem("token");
                            if (token) {
                              getServers(token);
                            }
                          } else {
                            showToast(
                              "error",
                              "Davet kullanılamadı veya süresi dolmuş"
                            );
                          }
                        } else {
                          showToast("error", "Geçersiz davet linki veya token");
                        }
                      } catch (error) {
                        console.error("Join server error:", error);
                        showToast(
                          "error",
                          "Davet linki işlenirken hata oluştu"
                        );
                      }
                    }}
                    className="px-3 py-1.5 rounded bg-scroll-accent hover:bg-scroll-accent-strong text-white text-xs"
                  >
                    Katıl
                  </button>
                </div>
                <div className="flex items-stretch gap-2">
                  <input
                    value={joinLink}
                    onChange={(e) => setJoinLink(e.target.value)}
                    placeholder="Davet linkini ya da token'ı yapıştırın"
                    className="flex-1 px-3 py-2 rounded bg-[#121212] border border-gray-700 text-gray-100"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Örnek: https://site.com/dashboard?inviteToken=XXXX ya da
                  sadece token
                </p>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Sunucu Logosu
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-700 bg-[#121212] flex items-center justify-center">
                    {newServerIcon ? (
                      <img
                        src={newServerIcon}
                        alt="Önizleme"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7h2l2-3h10l2 3h2M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7M9 11l2 2 4-4"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      id="serverLogo"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) {
                          setNewServerIcon("");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () =>
                          setNewServerIcon(String(reader.result));
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="serverLogo"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-[#121212] hover:bg-[#1F1B24] text-gray-100 cursor-pointer"
                    >
                      Dosya Seç
                    </label>
                    <p className="text-gray-500 text-xs mt-2">
                      PNG/JPG önerilir. Kare görseller en iyi sonucu verir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCreateServer(false)}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-[#121212]"
              >
                İptal
              </button>
              <button
                onClick={async () => {
                  if (!newServerName.trim()) return;
                  const token = localStorage.getItem("token");
                  if (!token) return;
                  try {
                    const created = await createServer(
                      token,
                      newServerName.trim(),
                      newServerIcon || undefined
                    );
                    setServers((prev) => [
                      ...prev,
                      {
                        id:
                          (created as any).id ||
                          (created as any)._id ||
                          created.id,
                        name: created.name,
                        ...((created as any).icon
                          ? { icon: (created as any).icon }
                          : {}),
                      },
                    ]);
                    setShowCreateServer(false);
                    showToast("success", "Sunucu oluşturuldu");
                  } catch (error) {
                    console.error("Server creation failed:", error);
                    showToast(
                      "error",
                      "Sunucu oluşturulamadı: " + (error as any).message
                    );
                  }
                }}
                className="px-4 py-2 rounded-lg bg-scroll-accent hover:bg-scroll-accent-strong text-white"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sunucu Davet Modali */}
      {showServerInvite && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-[#121212] border border-gray-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">
                Sunucu Davet Bağlantısı
              </h3>
              <button
                onClick={() => setShowServerInvite(false)}
                className="p-1 rounded bg-[#121212] hover:bg-[#1F1B24] text-gray-100"
                title="Kapat"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Bağlantı
              </label>
              <div className="flex">
                <input
                  readOnly
                  value={
                    currentInviteLink || `${window.location.origin}/dashboard`
                  }
                  className="flex-1 px-3 py-2 rounded-l bg-[#121212] border border-gray-700 text-gray-100"
                />
                <button
                  onClick={async () => {
                    try {
                      const link =
                        currentInviteLink ||
                        `${window.location.origin}/dashboard`;
                      await navigator.clipboard.writeText(link);
                      setServerInviteCopied(true);
                      setTimeout(() => setServerInviteCopied(false), 1500);
                    } catch {}
                  }}
                  className={`px-3 rounded-r border border-l-0 ${
                    serverInviteCopied
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-[#121212] text-gray-100 hover:bg-[#1F1B24] border-gray-700"
                  }`}
                  title="Kopyala"
                >
                  {serverInviteCopied ? (
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
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Kullanım Limiti
                </label>
                <select
                  value={inviteMaxUses}
                  onChange={(e) =>
                    setInviteMaxUses(parseInt(e.target.value, 10))
                  }
                  className="w-full px-3 py-2 rounded bg-[#121212] border border-gray-700 text-gray-100"
                >
                  <option value={1}>1 (tek kullanımlık)</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={0}>Sınırsız</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Son Kullanma
                </label>
                <select
                  value={inviteExpiresIn}
                  onChange={(e) =>
                    setInviteExpiresIn(parseInt(e.target.value, 10))
                  }
                  className="w-full px-3 py-2 rounded bg-[#121212] border border-gray-700 text-gray-100"
                >
                  <option value={24 * 60 * 60 * 1000}>24 saat</option>
                  <option value={3 * 24 * 60 * 60 * 1000}>3 gün</option>
                  <option value={7 * 24 * 60 * 60 * 1000}>7 gün</option>
                  <option value={30 * 24 * 60 * 60 * 1000}>30 gün</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Değişiklikler yeni link oluşturduğunuzda geçerli olur.
            </p>

            <div className="mt-6">
              <h4 className="text-gray-200 font-semibold mb-2">
                Mevcut davetler
              </h4>
              <div className="space-y-2 max-h-56 overflow-auto pr-1">
                {existingInvites.length === 0 ? (
                  <div className="text-gray-500 text-sm">
                    Bu sunucu için kayıtlı davet yok.
                  </div>
                ) : (
                  existingInvites.map((it) => {
                    const remaining = it.expiresAt
                      ? Math.max(0, it.expiresAt - Date.now())
                      : null;
                    const human =
                      remaining == null
                        ? "—"
                        : remaining <= 0
                        ? "Süresi doldu"
                        : `${Math.ceil(remaining / (60 * 60 * 1000))}saat`;
                    return (
                      <div
                        key={it.id}
                        className="flex items-center justify-between bg-[#121212] border border-gray-700 rounded px-3 py-2"
                      >
                        <div className="text-sm text-gray-300">
                          <div>
                            Kalan kullanım:{" "}
                            {it.remainingUses === 0
                              ? "Sınırsız"
                              : it.remainingUses}
                          </div>
                          <div className="text-xs text-gray-400">
                            Son kullanma: {human}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              try {
                                if (!selectedServerId) return;
                                const link = await createInviteLink(
                                  selectedServerId,
                                  {
                                    maxUses: inviteMaxUses,
                                    expiresInMs: inviteExpiresIn,
                                  }
                                );
                                await navigator.clipboard.writeText(link);
                                // listeyi tazele
                                const list = await listInvites(
                                  selectedServerId
                                );
                                setExistingInvites(
                                  list.map((x) => ({
                                    id: x.id,
                                    createdAt: x.createdAt,
                                    expiresAt: x.expiresAt,
                                    remainingUses: x.remainingUses,
                                  }))
                                );
                                showToast(
                                  "success",
                                  "Yeni link oluşturuldu ve kopyalandı"
                                );
                              } catch {
                                showToast("error", "Link oluşturulamadı");
                              }
                            }}
                            className="px-2 py-1 text-xs rounded bg-[#121212] hover:bg-[#1F1B24] text-white"
                            title="Yeni link oluştur ve kopyala"
                          >
                            Yeni link
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const ok = await revokeInvite(it.id);
                                if (ok && selectedServerId) {
                                  const list = await listInvites(
                                    selectedServerId
                                  );
                                  setExistingInvites(
                                    list.map((it2) => ({
                                      id: it2.id,
                                      createdAt: it2.createdAt,
                                      expiresAt: it2.expiresAt,
                                      remainingUses: it2.remainingUses,
                                    }))
                                  );
                                }
                              } catch {}
                            }}
                            className="px-2 py-1 text-xs rounded bg-scroll-accent hover:bg-scroll-accent-strong text-white"
                          >
                            İptal Et
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowServerInvite(false)}
                className="px-4 py-2 rounded bg-[#121212] hover:bg-[#1F1B24] text-gray-100"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {renameModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-sm bg-[#121212] border border-gray-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">
                Kanalı Yeniden Adlandır
              </h3>
              <button
                onClick={() => setRenameModal({ open: false, name: "" })}
                className="p-1 rounded bg-[#121212] hover:bg-[#1F1B24] text-gray-100"
                title="Kapat"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <label className="block text-gray-300 text-sm mb-2">
              Yeni kanal adı
            </label>
            <input
              value={renameModal.name}
              onChange={(e) =>
                setRenameModal((m) => ({ ...m, name: e.target.value }))
              }
              className="w-full px-3 py-2 rounded bg-[#121212] border border-gray-700 text-gray-100"
              autoFocus
            />
            <label className="block text-gray-300 text-sm mt-4 mb-2">
              Açıklama (opsiyonel)
            </label>
            <input
              value={renameModal.description || ""}
              onChange={(e) =>
                setRenameModal((m) => ({ ...m, description: e.target.value }))
              }
              className="w-full px-3 py-2 rounded bg-[#121212] border border-gray-700 text-gray-100"
              placeholder="Kanal açıklaması"
            />
            {renameModal.error && (
              <div className="text-red-400 text-xs mt-2">
                {renameModal.error}
              </div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setRenameModal({ open: false, name: "" })}
                className="px-4 py-2 rounded bg-[#121212] hover:bg-[#1F1B24] text-gray-100"
              >
                İptal
              </button>
              <button
                onClick={async () => {
                  if (!renameModal.channelId || !selectedServerId) return;
                  const name = (renameModal.name || "").trim();
                  if (!name) {
                    setRenameModal((m) => ({
                      ...m,
                      error: "Kanal adı boş olamaz",
                    }));
                    return;
                  }
                  const token = localStorage.getItem("token");
                  if (!token) return;
                  setRenameModal((m) => ({ ...m, saving: true }));
                  try {
                    const updated = await updateChannelService(
                      token,
                      selectedServerId,
                      renameModal.channelId,
                      {
                        name,
                        description: renameModal.description || undefined,
                      }
                    );
                    setChannelsList((prev) =>
                      prev.map((c) =>
                        c.id === renameModal.channelId
                          ? {
                              id: c.id,
                              name: (updated as any).name || name,
                              description:
                                renameModal.description || c.description,
                            }
                          : c
                      )
                    );
                    setRenameModal({ open: false, name: "", description: "" });
                  } catch {
                    setRenameModal({ open: false, name: "", description: "" });
                  }
                }}
                className="px-4 py-2 rounded bg-scroll-accent hover:bg-scroll-accent-strong text-white disabled:opacity-60"
                disabled={renameModal.saving}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Server Delete Confirmation Modal */}
      {confirmDelete.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-sm bg-[#121212] border border-gray-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-white text-lg font-semibold mb-3">
              Sunucuyu sil?
            </h3>
            <p className="text-gray-300 text-sm">
              {confirmDelete.serverName} sunucusu ve kanalları kalıcı olarak
              silinecek.
            </p>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setConfirmDelete({ open: false })}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-[#121212]"
              >
                İptal
              </button>
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  if (!token || !confirmDelete.serverId) return;
                  try {
                    await deleteServer(token, confirmDelete.serverId);

                    // localStorage'dan eski sunucu bilgilerini temizle
                    localStorage.removeItem("clientJoinedServers");

                    // Sunucu listesini yeniden yükle
                    const updatedServers = await getServers(token);
                    setServers(updatedServers);

                    if (selectedServerId === confirmDelete.serverId) {
                      setSelectedServerId(null);
                      setChannelsList([]);
                      setVoiceChannels([]);
                      setActiveChannelId(null);
                      setActiveVoiceId(null);
                    }
                    setConfirmDelete({ open: false });
                    showToast("success", "Sunucu silindi");
                  } catch (error) {
                    console.error("Server deletion failed:", error);
                    showToast(
                      "error",
                      "Sunucu silinemedi: " + (error as any).message
                    );
                  }
                }}
                className="px-4 py-2 rounded-lg bg-scroll-accent hover:bg-scroll-accent-strong text-white"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

// Küçük kullanıcı chipleri bileşeni
// deprecated: presence count chip (kullanılmıyor)
/* eslint-disable @typescript-eslint/no-unused-vars */

// Yeni sade kullanıcı listesi (lucide benzeri tasarım)
// deprecated: eski liste (kullanılmıyor)
