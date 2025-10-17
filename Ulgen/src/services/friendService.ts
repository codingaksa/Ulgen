// services/friendService.ts
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export interface Friend {
  _id: string;
  friend: {
    _id: string;
    username: string;
    avatar?: string;
    email: string;
    isOnline: boolean;
    lastSeen: string;
  };
  acceptedAt: string;
}

export interface FriendRequest {
  _id: string;
  requester: {
    _id: string;
    username: string;
    avatar?: string;
    email: string;
  };
  recipient: {
    _id: string;
    username: string;
    avatar?: string;
    email: string;
  };
  status: "pending" | "accepted" | "blocked";
  createdAt: string;
}

export interface FriendResponse {
  success: boolean;
  friends?: Friend[];
  requests?: FriendRequest[];
  message?: string;
  friendRequest?: FriendRequest;
}

export const friendService = {
  // Arkadaş listesini getir
  async getFriends(): Promise<FriendResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(`${API_BASE}/api/friends`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Arkadaş listesi yüklenirken hata oluştu"
        );
      }

      return data;
    } catch (error) {
      console.error("Get friends error:", error);
      throw error;
    }
  },

  // Arkadaşlık isteklerini getir
  async getFriendRequests(): Promise<FriendResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(`${API_BASE}/api/friends/requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Arkadaşlık istekleri yüklenirken hata oluştu"
        );
      }

      return data;
    } catch (error) {
      console.error("Get friend requests error:", error);
      throw error;
    }
  },

  // Arkadaşlık isteği gönder
  async sendFriendRequest(recipientId: string): Promise<FriendResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(`${API_BASE}/api/friends/request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Arkadaşlık isteği gönderilirken hata oluştu"
        );
      }

      return data;
    } catch (error) {
      console.error("Send friend request error:", error);
      throw error;
    }
  },

  // Arkadaşlık isteğini kabul et
  async acceptFriendRequest(requestId: string): Promise<FriendResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/friends/accept/${requestId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Arkadaşlık isteği kabul edilirken hata oluştu"
        );
      }

      return data;
    } catch (error) {
      console.error("Accept friend request error:", error);
      throw error;
    }
  },

  // Arkadaşlık isteğini reddet
  async rejectFriendRequest(requestId: string): Promise<FriendResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/friends/reject/${requestId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Arkadaşlık isteği reddedilirken hata oluştu"
        );
      }

      return data;
    } catch (error) {
      console.error("Reject friend request error:", error);
      throw error;
    }
  },

  // Arkadaşlığı kaldır
  async removeFriend(friendId: string): Promise<FriendResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/friends/remove/${friendId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Arkadaşlık kaldırılırken hata oluştu");
      }

      return data;
    } catch (error) {
      console.error("Remove friend error:", error);
      throw error;
    }
  },
};
