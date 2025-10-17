import React from "react";
import { useUserStatus, type UserStatus } from "../contexts/UserStatusContext";

interface UserStatusProps {
  userId: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const UserStatus: React.FC<UserStatusProps> = ({
  userId,
  showText = false,
  size = "md",
  className = "",
}) => {
  const { getUserStatus } = useUserStatus();
  const userStatus = getUserStatus(userId);

  if (!userStatus) {
    return null;
  }

  const getStatusColor = (status: UserStatus): string => {
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

  const getStatusText = (status: UserStatus): string => {
    switch (status) {
      case "online":
        return "Çevrimiçi";
      case "away":
        return "Uzakta";
      case "dnd":
        return "Rahatsız Etmeyin";
      case "offline":
        return "Çevrimdışı";
      default:
        return "Bilinmiyor";
    }
  };

  const getSizeClasses = (size: string): string => {
    switch (size) {
      case "sm":
        return "w-2 h-2";
      case "md":
        return "w-3 h-3";
      case "lg":
        return "w-4 h-4";
      default:
        return "w-3 h-3";
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <div
          className={`${getSizeClasses(size)} ${getStatusColor(
            userStatus.status
          )} rounded-full border-2 border-white`}
        />
        {userStatus.status === "dnd" && (
          <div className="absolute -top-1 -right-1 w-1 h-1 bg-white rounded-full" />
        )}
      </div>
      {showText && (
        <span className="text-sm text-gray-400">
          {userStatus.customStatus || getStatusText(userStatus.status)}
        </span>
      )}
    </div>
  );
};

export default UserStatus;
