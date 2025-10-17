// services/avatarService.ts
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export interface AvatarUploadResponse {
  success: boolean;
  message: string;
  avatar?: string;
}

export const avatarService = {
  // Avatar yükle
  async uploadAvatar(file: File): Promise<AvatarUploadResponse> {
    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(`${API_BASE}/api/avatar/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Avatar yüklenirken hata oluştu");
      }

      return data;
    } catch (error) {
      console.error("Avatar upload error:", error);
      throw error;
    }
  },

  // Avatar sil
  async deleteAvatar(): Promise<AvatarUploadResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(`${API_BASE}/api/avatar/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Avatar silinirken hata oluştu");
      }

      return data;
    } catch (error) {
      console.error("Avatar delete error:", error);
      throw error;
    }
  },

  // Avatar URL'ini al
  getAvatarUrl(avatar: string | null | undefined): string {
    if (!avatar) {
      return "/default-avatar.png"; // Varsayılan avatar
    }

    if (avatar.startsWith("http")) {
      return avatar; // External URL
    }

    // Backend'den gelen relative path
    const API_BASE =
      import.meta.env.VITE_API_BASE || "https://ulgen-backend.onrender.com";
    return `${API_BASE}${avatar}`;
  },
};
