// services/emailService.ts
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export interface EmailResponse {
  success: boolean;
  message: string;
  verificationToken?: string; // Sadece development modunda
}

export const emailService = {
  // Email doğrulama gönder
  async sendEmailVerification(): Promise<EmailResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(`${API_BASE}/api/email/send-verification`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Doğrulama e-postası gönderilirken hata oluştu"
        );
      }

      return data;
    } catch (error) {
      console.error("Send email verification error:", error);
      throw error;
    }
  },

  // Email doğrula
  async verifyEmail(token: string): Promise<EmailResponse> {
    try {
      const response = await fetch(`${API_BASE}/api/email/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "E-posta doğrulanırken hata oluştu");
      }

      return data;
    } catch (error) {
      console.error("Verify email error:", error);
      throw error;
    }
  },

  // Email doğrulama tekrar gönder
  async resendEmailVerification(): Promise<EmailResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Giriş yapmanız gerekiyor");
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/email/resend-verification`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Doğrulama e-postası tekrar gönderilirken hata oluştu"
        );
      }

      return data;
    } catch (error) {
      console.error("Resend email verification error:", error);
      throw error;
    }
  },
};
