// services/fileService.ts
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export interface FileUploadResponse {
  success: boolean;
  file?: {
    filename: string;
    originalName: string;
    url: string;
    mimeType: string;
    size: number;
  };
  message?: string;
}

export const fileService = {
  // Dosya yükle
  async uploadFile(file: File, channelId: string): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("channelId", channelId);

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(`${API_BASE}/api/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Dosya yüklenirken hata oluştu");
      }

      return data;
    } catch (error) {
      console.error("File upload error:", error);
      throw error;
    }
  },

  // Dosya sil
  async deleteFile(
    filename: string
  ): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(`${API_BASE}/api/files/${filename}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Dosya silinirken hata oluştu");
      }

      return data;
    } catch (error) {
      console.error("Delete file error:", error);
      throw error;
    }
  },

  // Dosya URL'ini al
  getFileUrl(fileUrl: string): string {
    if (!fileUrl) {
      return "";
    }

    if (fileUrl.startsWith("http")) {
      return fileUrl; // External URL
    }

    // Backend'den gelen relative path
    return `${API_BASE}${fileUrl}`;
  },

  // Dosya boyutunu formatla
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // Dosya türünü kontrol et
  isImageFile(mimeType: string): boolean {
    return mimeType.startsWith("image/");
  },

  // Dosya türü ikonunu al
  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("word")) return "📝";
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
      return "📊";
    if (mimeType.includes("text/")) return "📄";
    return "📎";
  },
};
