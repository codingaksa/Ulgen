import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import SidebarVoiceChannel from "./voice/SidebarVoiceChannel";

type TextChannel = { id: string; name: string };
type VoiceChannel = { id: string; name: string };

type ChannelSidebarProps = {
  textChannels: TextChannel[];
  voiceChannels: VoiceChannel[];
  activeTextId: string | null;
  unreadById?: Record<string, number>;
  onSelectText: (id: string) => void;
  onCreateText: () => void;
  onRenameText: (id: string, currentName: string) => void;
  onDeleteText: (id: string, name: string) => void;
  onCreateVoice: () => void;
  activeVoiceId: string | null;
  onToggleActiveVoice: (id: string) => void;
};

const ChannelSidebar: React.FC<ChannelSidebarProps> = ({
  textChannels,
  voiceChannels,
  activeTextId,
  unreadById,
  onSelectText,
  onCreateText,
  onRenameText,
  onDeleteText,
  onCreateVoice,
  activeVoiceId,
  onToggleActiveVoice,
}) => {
  const [ctx, setCtx] = useState<{
    open: boolean;
    x: number;
    y: number;
    id?: string;
    name?: string;
  }>({ open: false, x: 0, y: 0 });
  useEffect(() => {
    if (!ctx.open) return;
    const close = () => setCtx({ open: false, x: 0, y: 0 });
    window.addEventListener("click", close);
    window.addEventListener("contextmenu", close);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("contextmenu", close);
    };
  }, [ctx.open]);
  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-hidden">
      {/* Metin Kanalları */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
            METIN KANALLARI
          </h3>
          <button
            onClick={onCreateText}
            className="text-gray-400 hover:text-white"
            title="Kanal Oluştur"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-1">
          {textChannels.length === 0 ? (
            <div className="text-gray-500 text-sm bg-gray-800/50 border border-dashed border-gray-700 rounded-lg p-4 text-center">
              Sunucu seçin veya kanal ekleyin.
            </div>
          ) : (
            textChannels.map((ch) => {
              const isActive = activeTextId === ch.id;
              const unread = unreadById?.[ch.id] || 0;
              return (
                <div
                  key={ch.id}
                  onClick={() => onSelectText(ch.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setCtx({
                      open: true,
                      x: e.clientX,
                      y: e.clientY,
                      id: ch.id,
                      name: ch.name,
                    });
                  }}
                  className={`relative group flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                    isActive
                      ? "bg-blue-900/30 text-white border border-blue-700 border-l-4 border-l-blue-500"
                      : "text-gray-300 bg-gray-800/40 hover:text-white hover:bg-gray-700/70"
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="text-gray-400">#</span>
                    <span className="font-medium truncate">{ch.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {unread > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-semibold">
                        {unread}
                      </span>
                    )}
                    <div className="hidden group-hover:flex items-center space-x-2">
                      <button
                        title="Yeniden adlandır"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRenameText(ch.id, ch.name);
                        }}
                        className="text-gray-300 hover:text-white"
                        aria-label="Yeniden adlandır"
                      >
                        <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                      </button>
                      <button
                        title="Sil"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteText(ch.id, ch.name);
                        }}
                        className="text-red-400 hover:text-red-300"
                        aria-label="Sil"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {ctx.open && (
        <div
          className="fixed z-50 bg-gray-800 border border-gray-700 rounded-md shadow-lg text-gray-100"
          style={{ left: ctx.x + 4, top: ctx.y + 4 }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (ctx.id) onSelectText(ctx.id);
              setCtx({ open: false, x: 0, y: 0 });
            }}
            className="block w-full text-left px-3 py-2 hover:bg-gray-700"
          >
            Kanala Git
          </button>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              try {
                const url = `${window.location.origin}/dashboard?channel=${
                  ctx.id || ""
                }`;
                await navigator.clipboard.writeText(url);
              } catch {}
              setCtx({ open: false, x: 0, y: 0 });
            }}
            className="block w-full text-left px-3 py-2 hover:bg-gray-700"
          >
            Linki Kopyala
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCtx({ open: false, x: 0, y: 0 });
              if (ctx.id && ctx.name) onRenameText(ctx.id, ctx.name);
            }}
            className="block w-full text-left px-3 py-2 hover:bg-gray-700"
          >
            Yeniden Adlandır
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCtx({ open: false, x: 0, y: 0 });
              if (ctx.id && ctx.name) onDeleteText(ctx.id, ctx.name);
            }}
            className="block w-full text-left px-3 py-2 hover:bg-gray-700 text-red-300"
          >
            Sil
          </button>
        </div>
      )}

      {/* Sesli Kanallar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
            SESLI KANALLAR
          </h3>
          <button
            onClick={onCreateVoice}
            className="text-gray-400 hover:text-white"
            title="Sesli Kanal Oluştur"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1">
          {voiceChannels.length === 0 ? (
            <div className="text-gray-500 text-sm bg-gray-800/50 border border-dashed border-gray-700 rounded-lg p-4 text-center">
              Sesli kanal ekleyin.
            </div>
          ) : (
            voiceChannels.map((vc) => (
              <div key={vc.id} className="text-gray-300">
                <button
                  onClick={() => onToggleActiveVoice(vc.id)}
                  className="w-full text-left"
                  type="button"
                >
                  <SidebarVoiceChannel
                    channelId={vc.id}
                    name={vc.name}
                    isActive={vc.id === activeVoiceId}
                  />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelSidebar;
