import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
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

  useEffect(() => {
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
      <div className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-gray-700/40 transition-colors text-gray-300 hover:text-white group">
        <FontAwesomeIcon icon={faVolumeHigh} className="w-4 h-4" />
        <span className="text-sm font-medium select-none cursor-default">
          {name}
        </span>
        <span className="ml-auto text-xs opacity-60">{members.length}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((v) => !v);
          }}
          className="ml-2 px-1 text-gray-400 hover:text-white"
          title={isExpanded ? "Daralt" : "Genişlet"}
          type="button"
        >
          {isExpanded ? (
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01-.02-1.06L10.94 10 7.19 6.29a.75.75 0 111.06-1.06l4.24 4.24a.75.75 0 010 1.06l-4.24 4.24a.75.75 0 01-1.06 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
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
