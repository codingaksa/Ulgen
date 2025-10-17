import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { io, Socket } from "socket.io-client";

export type UserStatus = "online" | "away" | "dnd" | "offline";

export interface UserStatusData {
  userId: string;
  status: UserStatus;
  customStatus?: string;
  lastSeen?: Date;
}

interface UserStatusContextType {
  currentStatus: UserStatus;
  customStatus: string;
  setStatus: (status: UserStatus) => void;
  setCustomStatus: (status: string) => void;
  onlineUsers: UserStatusData[];
  getUserStatus: (userId: string) => UserStatusData | undefined;
  socket: Socket | null;
}

const UserStatusContext = createContext<UserStatusContextType | undefined>(
  undefined
);

interface UserStatusProviderProps {
  children: ReactNode;
}

export const UserStatusProvider: React.FC<UserStatusProviderProps> = ({
  children,
}) => {
  const { currentUser } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<UserStatus>("offline");
  const [customStatus, setCustomStatusState] = useState<string>("");
  const [onlineUsers, setOnlineUsers] = useState<UserStatusData[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Socket.IO bağlantısı
  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io("http://localhost:5000", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    setSocket(newSocket);

    // Kullanıcı durumu güncellemeleri
    newSocket.on("user-status-updated", (data: UserStatusData) => {
      setOnlineUsers((prev) => {
        const existingIndex = prev.findIndex(
          (user) => user.userId === data.userId
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = data;
          return updated;
        } else {
          return [...prev, data];
        }
      });
    });

    // Kullanıcı çevrimdışı olduğunda
    newSocket.on("user-offline", (userId: string) => {
      setOnlineUsers((prev) => prev.filter((user) => user.userId !== userId));
    });

    // Mevcut çevrimiçi kullanıcıları al
    newSocket.on("online-users", (users: UserStatusData[]) => {
      setOnlineUsers(users);
    });

    // Kullanıcı durumu değiştiğinde
    newSocket.on(
      "status-changed",
      (data: { status: UserStatus; customStatus?: string }) => {
        setCurrentStatus(data.status);
        setCustomStatusState(data.customStatus || "");
      }
    );

    // Sayfa kapatılırken durumu offline yap
    const handleBeforeUnload = () => {
      newSocket.emit("set-status", { status: "offline" });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Sayfa görünürlük değişikliklerini dinle
    const handleVisibilityChange = () => {
      if (document.hidden) {
        newSocket.emit("set-status", { status: "away" });
      } else {
        newSocket.emit("set-status", { status: "online" });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // İlk durumu ayarla
    newSocket.emit("set-status", { status: "online" });

    return () => {
      newSocket.emit("set-status", { status: "offline" });
      newSocket.disconnect();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentUser]);

  const setStatus = (status: UserStatus) => {
    if (socket) {
      socket.emit("set-status", { status, customStatus });
      setCurrentStatus(status);
    }
  };

  const setCustomStatus = (status: string) => {
    if (socket) {
      socket.emit("set-status", {
        status: currentStatus,
        customStatus: status,
      });
      setCustomStatusState(status);
    }
  };

  const getUserStatus = (userId: string): UserStatusData | undefined => {
    return onlineUsers.find((user) => user.userId === userId);
  };

  const value: UserStatusContextType = {
    currentStatus,
    customStatus,
    setStatus,
    setCustomStatus,
    onlineUsers,
    getUserStatus,
    socket,
  };

  return (
    <UserStatusContext.Provider value={value}>
      {children}
    </UserStatusContext.Provider>
  );
};

export const useUserStatus = (): UserStatusContextType => {
  const context = useContext(UserStatusContext);
  if (context === undefined) {
    throw new Error("useUserStatus must be used within a UserStatusProvider");
  }
  return context;
};
