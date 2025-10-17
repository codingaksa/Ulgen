import React, { useState } from "react";
import { useUserStatus, type UserStatus } from "../contexts/UserStatusContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface UserStatusSelectorProps {
  className?: string;
}

const UserStatusSelector: React.FC<UserStatusSelectorProps> = ({
  className = "",
}) => {
  const { currentStatus, customStatus, setStatus, setCustomStatus } =
    useUserStatus();
  const [isOpen, setIsOpen] = useState(false);
  const [tempCustomStatus, setTempCustomStatus] = useState(customStatus);

  const statusOptions = [
    {
      value: "online" as UserStatus,
      label: "Çevrimiçi",
      icon: "🟢",
      color: "text-green-500",
    },
    {
      value: "away" as UserStatus,
      label: "Uzakta",
      icon: "🟡",
      color: "text-yellow-500",
    },
    {
      value: "dnd" as UserStatus,
      label: "Rahatsız Etmeyin",
      icon: "🔴",
      color: "text-red-500",
    },
    {
      value: "offline" as UserStatus,
      label: "Çevrimdışı",
      icon: "⚫",
      color: "text-gray-500",
    },
  ];

  const handleStatusChange = (status: UserStatus) => {
    setStatus(status);
    setIsOpen(false);
  };

  const handleCustomStatusSubmit = () => {
    setCustomStatus(tempCustomStatus);
    setIsOpen(false);
  };

  const currentStatusOption = statusOptions.find(
    (option) => option.value === currentStatus
  );

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-[#1F1B24] hover:bg-[#2A2530] rounded-lg transition-colors"
      >
        <span className="text-lg">{currentStatusOption?.icon}</span>
        <span className="text-white text-sm">{currentStatusOption?.label}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#1F1B24] border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  currentStatus === option.value
                    ? "bg-violet-600 text-white"
                    : "hover:bg-[#2A2530] text-gray-300"
                }`}
              >
                <span className="text-lg">{option.icon}</span>
                <span className="text-sm">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-700 p-3">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Özel Durum
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tempCustomStatus}
                onChange={(e) => setTempCustomStatus(e.target.value)}
                placeholder="Özel durum mesajı..."
                className="flex-1 px-3 py-2 bg-[#121212] border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                maxLength={128}
              />
              <button
                onClick={handleCustomStatusSubmit}
                className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Kaydet
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {tempCustomStatus.length}/128 karakter
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatusSelector;
