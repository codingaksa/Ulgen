// components/ChannelSidebar.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import SidebarVoiceChannel from "./voice/SidebarVoiceChannel";
import { createPortal } from "react-dom";

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
  /** optional: override for link copy (fallback: window.location.origin) */
  baseUrlOverride?: string;
  /** yeni: ses kanalı silme */
  onDeleteVoice?: (id: string, name: string) => void;
};

type CtxState = {
  open: boolean;
  x: number;
  y: number;
  id?: string;
  name?: string;
};

const DEFAULT_CTX: CtxState = { open: false, x: 0, y: 0 };

const ChannelSidebar: React.FC<ChannelSidebarProps> = React.memo(
  ({
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
    baseUrlOverride,
    onDeleteVoice,
  }) => {
    const [ctx, setCtx] = useState<CtxState>(DEFAULT_CTX);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Close context menu on outside click / esc / route changes
    useEffect(() => {
      if (!ctx.open) return;

      const handleDocClick = (e: MouseEvent) => {
        if (!menuRef.current) return setCtx(DEFAULT_CTX);
        if (!menuRef.current.contains(e.target as Node)) setCtx(DEFAULT_CTX);
      };
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setCtx(DEFAULT_CTX);
      };

      document.addEventListener("mousedown", handleDocClick);
      document.addEventListener("contextmenu", handleDocClick);
      document.addEventListener("keydown", handleEsc);
      return () => {
        document.removeEventListener("mousedown", handleDocClick);
        document.removeEventListener("contextmenu", handleDocClick);
        document.removeEventListener("keydown", handleEsc);
      };
    }, [ctx.open]);

    const baseUrl = useMemo(() => {
      const envUrl =
        baseUrlOverride ||
        (typeof import.meta !== "undefined"
          ? (import.meta as any).env?.VITE_CLIENT_URL
          : undefined) ||
        (typeof import.meta !== "undefined"
          ? (import.meta as any).env?.VITE_PUBLIC_CLIENT_URL
          : undefined) ||
        "";
      const cleaned = String(envUrl).replace(/\/+$/, "");
      if (cleaned) return cleaned;
      if (typeof window !== "undefined") return window.location.origin;
      return "";
    }, [baseUrlOverride]);

    const handleContextOpen = useCallback(
      (e: React.MouseEvent, id: string, name: string) => {
        e.preventDefault();
        setCtx({ open: true, x: e.clientX, y: e.clientY, id, name });
      },
      []
    );

    const handleCopyLink = useCallback(async () => {
      try {
        const url = `${baseUrl}/dashboard?channel=${ctx.id ?? ""}`;
        await navigator.clipboard.writeText(url);
      } catch {
        // noop; dilersen toast ekleyebilirsin
        console.warn("Link panoya kopyalanamadı.");
      } finally {
        setCtx(DEFAULT_CTX);
      }
    }, [baseUrl, ctx.id]);

    const handleGoTo = useCallback(() => {
      if (ctx.id) onSelectText(ctx.id);
      setCtx(DEFAULT_CTX);
    }, [ctx.id, onSelectText]);

    const handleRename = useCallback(() => {
      if (ctx.id && ctx.name) onRenameText(ctx.id, ctx.name);
      setCtx(DEFAULT_CTX);
    }, [ctx.id, ctx.name, onRenameText]);

    const handleDelete = useCallback(() => {
      if (ctx.id && ctx.name) onDeleteText(ctx.id, ctx.name);
      setCtx(DEFAULT_CTX);
    }, [ctx.id, ctx.name, onDeleteText]);

    return (
      <div className="flex-1 p-4 space-y-4 overflow-y-hidden">
        {/* Metin Kanalları */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
              METİN KANALLARI
            </h3>
            <button
              onClick={onCreateText}
              className="text-gray-400 hover:text-white transition-colors"
              title="Kanal Oluştur"
              aria-label="Metin kanalı oluştur"
            >
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {textChannels.length === 0 ? (
              <div className="text-gray-500 text-sm bg-black/50 border border-dashed border-gray-800 rounded-lg p-4 text-center">
                Sunucu seçin veya kanal ekleyin.
              </div>
            ) : (
              textChannels.map((ch) => {
                const isActive = activeTextId === ch.id;
                const unread = unreadById?.[ch.id] ?? 0;

                return (
                  <div
                    key={ch.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    onClick={() => onSelectText(ch.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        onSelectText(ch.id);
                    }}
                    onContextMenu={(e) => handleContextOpen(e, ch.id, ch.name)}
                    className={[
                      "relative group flex items-center justify-between p-2 rounded-lg cursor-pointer outline-none transition",
                      isActive
                        ? "bg-blue-900/30 text-white border border-blue-700 border-l-4 border-l-blue-500"
                        : "text-gray-300 bg-black/40 hover:text-white hover:bg-black/70 focus:ring-2 focus:ring-blue-600/50",
                    ].join(" ")}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="text-gray-400">#</span>
                      <span className="font-medium truncate">{ch.name}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {unread > 0 && (
                        <span
                          className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-semibold"
                          aria-label={`${unread} okunmamış mesaj`}
                        >
                          {unread}
                        </span>
                      )}

                      <div className="hidden group-hover:flex items-center space-x-2">
                        <button
                          title="Yeniden adlandır"
                          aria-label="Kanalı yeniden adlandır"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRenameText(ch.id, ch.name);
                          }}
                          className="text-gray-300 hover:text-white"
                        >
                          <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                        </button>
                        <button
                          title="Sil"
                          aria-label="Kanalı sil"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteText(ch.id, ch.name);
                          }}
                          className="text-red-400 hover:text-red-300"
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
        </section>

        {/* Sağ tık menüsü (Portal) */}
        {ctx.open &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              ref={menuRef}
              className="fixed z-50 bg-black border border-gray-800 rounded-md shadow-lg text-gray-100 py-1 w-44"
              style={{ left: ctx.x + 4, top: ctx.y + 4 }}
              role="menu"
              aria-label="Kanal menüsü"
            >
              <button
                onClick={handleGoTo}
                className="block w-full text-left px-3 py-2 hover:bg-black focus:bg-black outline-none"
                role="menuitem"
              >
                Kanala Git
              </button>
              <button
                onClick={handleCopyLink}
                className="block w-full text-left px-3 py-2 hover:bg-black focus:bg-black outline-none"
                role="menuitem"
              >
                Linki Kopyala
              </button>
              <button
                onClick={handleRename}
                className="block w-full text-left px-3 py-2 hover:bg-black focus:bg-black outline-none"
                role="menuitem"
              >
                Yeniden Adlandır
              </button>
              <button
                onClick={handleDelete}
                className="block w-full text-left px-3 py-2 hover:bg-black focus:bg-black text-red-300 outline-none"
                role="menuitem"
              >
                Sil
              </button>
            </div>,
            document.body
          )}

        {/* Sesli Kanallar */}
        <section>
          <div
            className="flex items-center justify-between mb-2 select-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCreateVoice();
              }
            }}
          >
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
              SESLİ KANALLAR
            </h3>
            <button
              onClick={onCreateVoice}
              className="text-gray-400 hover:text-white transition-colors"
              title="Sesli Kanal Oluştur"
              aria-label="Sesli kanal oluştur"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {voiceChannels.length === 0 ? (
              <button
                type="button"
                onClick={onCreateVoice}
                className="w-full text-gray-500 text-sm bg-black/50 border border-dashed border-gray-800 rounded-lg p-4 text-center hover:text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                title="Sesli Kanal Oluştur"
                aria-label="Sesli kanal oluştur"
              >
                Sesli kanal ekleyin.
              </button>
            ) : (
              voiceChannels.map((vc) => (
                <div key={vc.id} className="relative group rounded-lg">
                  <button
                    type="button"
                    onClick={() => onToggleActiveVoice(vc.id)}
                    className="w-full text-left outline-none focus:ring-2 focus:ring-blue-600/40 rounded-lg"
                    aria-pressed={vc.id === activeVoiceId}
                  >
                    <SidebarVoiceChannel
                      channelId={vc.id}
                      name={vc.name}
                      isActive={vc.id === activeVoiceId}
                    />
                  </button>
                  {onDeleteVoice && (
                    <button
                      title="Sil"
                      aria-label="Ses kanalını sil"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteVoice(vc.id, vc.name);
                      }}
                      className="flex items-center justify-center absolute top-1 right-1 w-6 h-6 rounded bg-red-600/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    );
  }
);

ChannelSidebar.displayName = "ChannelSidebar";
export default ChannelSidebar;
