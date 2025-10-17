import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faHeadphones,
  faBan,
} from "@fortawesome/free-solid-svg-icons";

type SidebarVoiceUserProps = {
  channelId: string;
  id: string;
  name: string;
  isMuted?: boolean;
  isDeafened?: boolean;
  isSelf?: boolean;
  speaking?: boolean;
};

const SidebarVoiceUser: React.FC<SidebarVoiceUserProps> = ({
  channelId,
  id,
  name,
  isMuted,
  isDeafened,
  isSelf,
  speaking,
}) => {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  const toggle = (action: "toggle-mic" | "toggle-deafen") => {
    if (!isSelf) return;
    window.dispatchEvent(
      new CustomEvent("voice-toggle", { detail: { action, channelId } })
    );
    try {
      const raw = localStorage.getItem("voicePresence");
      const map = raw ? JSON.parse(raw) : {};
      if (Array.isArray(map[channelId])) {
        map[channelId] = map[channelId].map((x: any) =>
          x.id === id
            ? {
                ...x,
                isMuted: action === "toggle-mic" ? !x.isMuted : x.isMuted,
                isDeafened:
                  action === "toggle-deafen" ? !x.isDeafened : x.isDeafened,
              }
            : x
        );
        localStorage.setItem("voicePresence", JSON.stringify(map));
        // Aynı sekmede anında güncelleme için özel event yayınla
        window.dispatchEvent(
          new CustomEvent("voice-presence-updated", {
            detail: { channelId },
          })
        );
      }
    } catch {}
  };

  return (
    <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700/40 transition-colors group">
      <div className="relative">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
            isSelf ? "bg-indigo-500" : "bg-gray-600"
          } ${speaking ? "ring-2 ring-green-500/70" : ""}`}
        >
          {initial}
        </div>
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 ${
            isDeafened ? "bg-red-500" : "bg-green-500"
          }`}
        />
      </div>

      <span className="flex-1 min-w-0 text-sm text-white truncate whitespace-nowrap">
        {name}
      </span>

      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggle("toggle-mic");
          }}
          className={`w-6 h-6 rounded-full flex items-center justify-center border ${
            isMuted
              ? "border-red-500 text-red-400 bg-red-500/10"
              : "border-green-500 text-green-400 bg-green-500/10"
          } ${isSelf ? "cursor-pointer" : "opacity-70 cursor-default"}`}
          title={isMuted ? "Mikrofon kapalı" : "Mikrofon açık"}
        >
          <FontAwesomeIcon
            icon={isMuted ? faMicrophoneSlash : faMicrophone}
            className="w-3 h-3"
          />
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggle("toggle-deafen");
          }}
          className={`w-6 h-6 rounded-full flex items-center justify-center border ${
            isDeafened
              ? "border-red-500 text-red-400 bg-red-500/10"
              : "border-green-500 text-green-400 bg-green-500/10"
          } ${isSelf ? "cursor-pointer" : "opacity-70 cursor-default"}`}
          title={isDeafened ? "Kulaklık kapalı" : "Kulaklık açık"}
        >
          <FontAwesomeIcon
            icon={isDeafened ? faBan : faHeadphones}
            className="w-3.5 h-3.5"
          />
        </div>
      </div>
    </div>
  );
};

export default SidebarVoiceUser;
