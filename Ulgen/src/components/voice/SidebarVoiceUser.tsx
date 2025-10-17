import React from "react";

type SidebarVoiceUserProps = {
  name: string;
  isDeafened?: boolean;
  isSelf?: boolean;
  speaking?: boolean;
};

const SidebarVoiceUser: React.FC<SidebarVoiceUserProps> = ({
  name,
  isDeafened,
  isSelf,
  speaking,
}) => {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

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
    </div>
  );
};

export default SidebarVoiceUser;
