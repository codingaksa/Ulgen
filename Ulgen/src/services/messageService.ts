// services/messageService.ts
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export interface Message {
  _id: string;
  channelId: string;
  serverId: string;
  userId: string;
  username: string;
  content: string;
  messageType: "text" | "image" | "file" | "system";
  attachments?: Array<{
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  }>;
  mentions?: string[];
  replyTo?: string;
  edited: boolean;
  editedAt?: string;
  deleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  formattedTime: string;
  formattedDate: string;
  avatar?: string;
}

export interface MessageResponse {
  success: boolean;
  messages: Message[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

export interface CreateMessageResponse {
  success: boolean;
  message: Message;
}

export const messageService = {
  // Kanal mesajlarını getir
  async getMessages(
    channelId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<MessageResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/messages/${channelId}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Mesajlar yüklenirken hata oluştu");
      }

      return data;
    } catch (error) {
      console.error("Get messages error:", error);
      throw error;
    }
  },

  // Yeni mesaj gönder
  async sendMessage(
    channelId: string,
    content: string,
    replyTo?: string
  ): Promise<CreateMessageResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelId,
          content,
          replyTo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Mesaj gönderilirken hata oluştu");
      }

      return data;
    } catch (error) {
      console.error("Send message error:", error);
      throw error;
    }
  },

  // Mesajı düzenle
  async editMessage(
    messageId: string,
    content: string
  ): Promise<CreateMessageResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(`${API_BASE}/api/messages/${messageId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Mesaj düzenlenirken hata oluştu");
      }

      return data;
    } catch (error) {
      console.error("Edit message error:", error);
      throw error;
    }
  },

  // Mesajı sil
  async deleteMessage(
    messageId: string
  ): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(`${API_BASE}/api/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Mesaj silinirken hata oluştu");
      }

      return data;
    } catch (error) {
      console.error("Delete message error:", error);
      throw error;
    }
  },
};
