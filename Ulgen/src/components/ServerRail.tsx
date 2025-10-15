// components/ServerRail.tsx
import React from "react";

type Server = {
  id: string;
  name: string;
  icon?: string | null;
};

type ServerRailProps = {
  servers: Server[];
  selectedServerId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onInvite: (serverId: string | null) => void;
  onEdit: (serverId: string | null) => void;
  onDelete: (server: { id: string; name: string }) => void;
  loading?: boolean;
};

const InitialsCircle: React.FC<{ name: string }> = ({ name }) => {
  const letter = (name?.[0] || "?").toUpperCase();
  return (
    <span className="w-12 h-12 rounded-full bg-gray-600 text-white flex items-center justify-center text-base font-semibold select-none">
      {letter}
    </span>
  );
};

const ServerAvatar: React.FC<{ name: string; icon?: string | null }> = ({
  name,
  icon,
}) => {
  const [error, setError] = React.useState(false);
  if (!icon || error) {
    return <InitialsCircle name={name} />;
  }
  return (
    <img
      src={icon}
      alt={name}
      className="w-12 h-12 object-cover rounded-full"
      onError={() => setError(true)}
      draggable={false}
    />
  );
};

const SkeletonDot: React.FC = () => (
  <div className="w-12 h-12 rounded-full bg-gray-700/60 border border-gray-600 animate-pulse" />
);

const ServerRail: React.FC<ServerRailProps> = ({
  servers,
  selectedServerId,
  onSelect,
  onCreate,
  onInvite,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const handleKeyActivate = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    id: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <aside
      className="w-16 bg-gray-800 border-r border-gray-700 h-full min-h-full flex flex-col items-center py-3 space-y-3 overflow-y-auto"
      aria-label="Sunucu Çubuğu"
    >
      {/* Kısa İşlem Butonları */}
      <div className="flex flex-col items-center space-y-2">
        <button
          onClick={() => onInvite(selectedServerId)}
          title="Sunucu davet bağlantısı"
          aria-label="Sunucu davet bağlantısı"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-700/60 text-gray-200 hover:text-white hover:bg-gray-600 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="button"
        >
          {/* Info icon */}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m2-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        <button
          onClick={() => onEdit(selectedServerId)}
          title="Sunucuyu düzenle"
          aria-label="Sunucuyu düzenle"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-700/60 text-gray-200 hover:text-white hover:bg-gray-600 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="button"
        >
          {/* Edit icon */}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"
            />
          </svg>
        </button>

        <button
          onClick={onCreate}
          title="Sunucu oluştur"
          aria-label="Sunucu oluştur"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 text-white hover:bg-blue-500 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="button"
        >
          {/* Plus icon */}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Ayırıcı */}
      <div className="w-10 h-px bg-gray-700" />

      {/* Sunucular */}
      <div className="flex flex-col items-center space-y-3 w-full">
        {console.log('ServerRail: servers prop:', servers, 'length:', servers.length)}
        {loading ? (
          <>
            <SkeletonDot />
            <SkeletonDot />
            <SkeletonDot />
          </>
        ) : servers.length === 0 ? (
          <div className="text-[10px] text-gray-400 text-center px-2">
            Henüz bir sunucu yok.
            <br />
            Sağ üstteki <span className="text-gray-300">+</span> ile oluştur.
          </div>
        ) : (
          servers.map((s) => {
            const selected = selectedServerId === s.id;
            return (
              <div key={s.id} className="relative group">
                <button
                  onClick={() => onSelect(s.id)}
                  onKeyDown={(e) => handleKeyActivate(e, s.id)}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center text-white text-base border transition-all focus:outline-none ${
                    selected
                      ? "bg-gray-700/80 border-blue-500 ring-2 ring-blue-500/40 shadow-[0_0_0_2px_rgba(37,99,235,0.35)]"
                      : "bg-gray-700/60 border-gray-600 hover:bg-gray-600"
                  }`}
                  title={s.name}
                  aria-current={selected ? "page" : undefined}
                  aria-label={`Sunucu: ${s.name}${selected ? " (seçili)" : ""}`}
                  type="button"
                >
                  <ServerAvatar name={s.name} icon={s.icon} />
                </button>

                {/* Sil butonu (hover’da görünür) */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete({ id: s.id, name: s.name });
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shadow-lg hover:bg-red-700 border border-red-500 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
                  title="Sunucuyu Sil"
                  type="button"
                  aria-label={`${s.name} sunucusunu sil`}
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default ServerRail;
