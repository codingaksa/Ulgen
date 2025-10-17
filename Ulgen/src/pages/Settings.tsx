import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext.tsx";
import { io, Socket } from "socket.io-client";
import { avatarService } from "../services/avatarService";
import { emailService } from "../services/emailService";

const Settings: React.FC = () => {
  const { currentUser, logout, updateProfile, changePassword, deleteAccount } =
    useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [pttConfig, setPttConfig] = useState<{
    code: string;
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    mode: "ptt" | "ptm";
  }>(() => {
    try {
      const rawV2 = localStorage.getItem("voiceKeybindV2");
      if (rawV2) return JSON.parse(rawV2);
      const raw = localStorage.getItem("voiceKeybind");
      if (raw)
        return {
          code: JSON.parse(raw),
          ctrl: false,
          alt: false,
          shift: false,
          mode: "ptt",
        };
    } catch {}
    return {
      code: "Space",
      ctrl: false,
      alt: false,
      shift: false,
      mode: "ptt",
    };
  });
  const [isRecordingKey, setIsRecordingKey] = useState(false);
  const keybindDisplay = `${pttConfig.ctrl ? "Ctrl+" : ""}${
    pttConfig.alt ? "Alt+" : ""
  }${pttConfig.shift ? "Shift+" : ""}${pttConfig.code}`;
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Socket.IO bağlantısı
  const socketRef = useRef<Socket | null>(null);

  // Gerçek zamanlı ayarlar state'leri
  const [audioSettings, setAudioSettings] = useState({
    microphoneDevice: "Varsayılan Mikrofon",
    microphoneLevel: 75,
    autoGain: true,
    noiseReduction: true,
    speakerDevice: "Varsayılan Hoparlör",
    speakerLevel: 60,
    autoSpeakerLevel: false,
    audioLatency: 50,
    audioQuality: "Orta (128 kbps)",
    echoReduction: true,
    audioCompression: true,
  });

  const [videoSettings] = useState({
    cameraDevice: "Varsayılan Kamera",
    videoQuality: "720p (HD)",
    autoFocus: true,
    lowLightMode: false,
  });

  // const [userStatus, setUserStatus] = useState<
  //   "online" | "away" | "dnd" | "offline"
  // >("online");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const showMessage = (type: "success" | "error" | "info", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Avatar upload fonksiyonu
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage("error", "Dosya boyutu 5MB'dan küçük olmalıdır");
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith("image/")) {
      showMessage("error", "Sadece resim dosyaları yüklenebilir");
      return;
    }

    setAvatarLoading(true);
    try {
      const response = await avatarService.uploadAvatar(file);
      if (response.success) {
        showMessage("success", "Avatar başarıyla yüklendi");
        // Kullanıcı bilgilerini güncelle
        if (currentUser) {
          updateProfile({ ...currentUser, avatar: response.avatar });
        }
      }
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error
          ? error.message
          : "Avatar yüklenirken hata oluştu"
      );
    } finally {
      setAvatarLoading(false);
    }
  };

  // Avatar silme fonksiyonu
  const handleAvatarDelete = async () => {
    if (!confirm("Avatar'ınızı silmek istediğinizden emin misiniz?")) {
      return;
    }

    setAvatarLoading(true);
    try {
      const response = await avatarService.deleteAvatar();
      if (response.success) {
        showMessage("success", "Avatar başarıyla silindi");
        // Kullanıcı bilgilerini güncelle
        if (currentUser) {
          updateProfile({ ...currentUser, avatar: undefined });
        }
      }
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Avatar silinirken hata oluştu"
      );
    } finally {
      setAvatarLoading(false);
    }
  };

  // Email doğrulama fonksiyonu
  const handleSendEmailVerification = async () => {
    setEmailLoading(true);
    try {
      const response = await emailService.sendEmailVerification();
      if (response.success) {
        showMessage("success", "Doğrulama e-postası gönderildi");
        // Development modunda token'ı göster
        if (response.verificationToken) {
          console.log("Verification token:", response.verificationToken);
          showMessage(
            "info",
            `Geliştirme modu: Token: ${response.verificationToken}`
          );
        }
      }
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error
          ? error.message
          : "E-posta gönderilirken hata oluştu"
      );
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateProfile({
        username: formData.username,
        email: formData.email,
      });
      showMessage("success", "Profil başarıyla güncellendi!");
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("error", "Yeni şifreler eşleşmiyor");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage("error", "Yeni şifre en az 6 karakter olmalıdır");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      showMessage("success", "Şifre başarıyla değiştirildi!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Şifre değiştirilemedi"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      )
    ) {
      if (
        window.confirm(
          "Bu işlem geri alınamaz! Tüm verileriniz kalıcı olarak silinecek. Devam etmek istediğinizden emin misiniz?"
        )
      ) {
        setLoading(true);
        setMessage(null);

        try {
          await deleteAccount();
          showMessage("success", "Hesabınız başarıyla silindi");
        } catch (error) {
          showMessage(
            "error",
            error instanceof Error ? error.message : "Hesap silinemedi"
          );
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Socket.IO bağlantısını kur
  useEffect(() => {
    if (!socketRef.current) {
      const SOCKET_BASE =
        (import.meta as any).env?.VITE_SOCKET_BASE || "http://localhost:5000";
      socketRef.current = io(SOCKET_BASE, {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });

      // Gerçek zamanlı ayar güncellemelerini dinle
      socketRef.current.on("user-settings-updated", (data) => {
        console.log("Kullanıcı ayarları güncellendi:", data);
        showMessage("success", `${data.username} ayarlarını güncelledi`);
      });

      socketRef.current.on("user-status-updated", (data) => {
        console.log("Kullanıcı durumu güncellendi:", data);
        showMessage(
          "success",
          `${data.username} durumunu ${data.status} olarak değiştirdi`
        );
      });

      socketRef.current.on("audio-video-settings-updated", (data) => {
        console.log("Ses/video ayarları güncellendi:", data);
        showMessage(
          "success",
          `${data.username} ses/video ayarlarını güncelledi`
        );
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Gerçek zamanlı ayar güncelleme fonksiyonları
  const updateAudioSettings = (newSettings: Partial<typeof audioSettings>) => {
    const updatedSettings = { ...audioSettings, ...newSettings };
    setAudioSettings(updatedSettings);

    if (socketRef.current && currentUser) {
      socketRef.current.emit("update-audio-video-settings", {
        userId: currentUser.id,
        username: currentUser.username,
        audioSettings: updatedSettings,
        videoSettings,
        channelId: "global", // Global ayarlar için
      });
    }
  };

  // const updateVideoSettings = (newSettings: Partial<typeof videoSettings>) => {
  //   const updatedSettings = { ...videoSettings, ...newSettings };
  //   setVideoSettings(updatedSettings);
  //
  //   if (socketRef.current && currentUser) {
  //     socketRef.current.emit("update-audio-video-settings", {
  //       userId: currentUser.id,
  //       username: currentUser.username,
  //       audioSettings,
  //       videoSettings: updatedSettings,
  //       channelId: "global", // Global ayarlar için
  //     });
  //   }
  // };

  // const updateUserStatus = (
  //   newStatus: "online" | "away" | "dnd" | "offline"
  // ) => {
  //   setUserStatus(newStatus);
  //
  //   if (socketRef.current && currentUser) {
  //     socketRef.current.emit("update-user-status", {
  //       userId: currentUser.id,
  //       username: currentUser.username,
  //       status: newStatus,
  //       channelId: "global", // Global durum için
  //     });
  //   }
  // };

  const settingsTabs = [
    { id: "account", name: "Hesabım", icon: "👤" },
    { id: "profile", name: "Kullanıcı Profili", icon: "👤" },
    { id: "privacy", name: "Gizlilik & Güvenlik", icon: "🛡️" },
    { id: "notifications", name: "Bildirimler", icon: "🔔" },
    { id: "appearance", name: "Görünüm", icon: "👁️" },
    { id: "audio", name: "Ses & Video", icon: "🔊" },
    { id: "keybinds", name: "Tuş Atamaları", icon: "⌨️" },
    { id: "accessibility", name: "Erişilebilirlik", icon: "♿" },
    { id: "app", name: "Uygulama Ayarları", icon: "⚙️" },
  ];

  return (
    <div className="h-screen bg-black flex">
      {/* Mesaj Bildirimi */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {message.text}
        </div>
      )}

      {/* Sol Sidebar - Ayarlar Menüsü */}
      <div className="w-80 bg-black flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">Kullanıcı Ayarları</h1>
        </div>

        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-scroll-accent text-white"
                    : "text-gray-400 hover:text-white hover:bg-[#1F1B24]/8"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Çıkış Butonu */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-scroll-accent hover:bg-scroll-accent-strong text-white rounded-lg transition-colors"
          >
            <span>🚪</span>
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Ana İçerik Alanı */}
      <div className="flex-1 bg-black p-8">
        {isRecordingKey && (
          <KeyCaptureOverlay
            onKey={(k) => {
              setIsRecordingKey(false);
              if (k) {
                const cfg = {
                  ...pttConfig,
                  code: k,
                  ctrl: false,
                  alt: false,
                  shift: false,
                } as any;
                setPttConfig(cfg);
                try {
                  localStorage.setItem("voiceKeybindV2", JSON.stringify(cfg));
                } catch {}
              }
            }}
            onCancel={() => setIsRecordingKey(false)}
          />
        )}
        {activeTab === "account" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Hesabım</h2>
              <p className="text-gray-400">Hesap bilgilerinizi yönetin</p>
              <div className="w-full h-px bg-gray-800 mt-4"></div>
            </div>

            <div className="max-w-2xl">
              {/* Avatar Upload Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Profil Resmi
                </h3>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-[#1F1B24] border-2 border-gray-800 flex items-center justify-center">
                      {currentUser?.avatar ? (
                        <img
                          src={avatarService.getAvatarUrl(currentUser.avatar)}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1F1B24] flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {currentUser?.username?.charAt(0).toUpperCase() ||
                              "U"}
                          </span>
                        </div>
                      )}
                    </div>
                    {avatarLoading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={avatarLoading}
                      />
                      <span className="inline-flex items-center px-4 py-2 bg-scroll-accent hover:bg-scroll-accent-strong text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                        {avatarLoading ? "Yükleniyor..." : "Resim Seç"}
                      </span>
                    </label>

                    {currentUser?.avatar && (
                      <button
                        type="button"
                        onClick={handleAvatarDelete}
                        disabled={avatarLoading}
                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        Resmi Sil
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Maksimum 5MB, JPG, PNG, GIF formatları desteklenir
                </p>
              </div>

              <form onSubmit={handleSaveChanges} className="space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Kullanıcı Adı
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#121212] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="KullaniciAdi#1234"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    E-posta
                    {currentUser?.isEmailVerified ? (
                      <span className="ml-2 text-green-400 text-xs">
                        ✓ Doğrulanmış
                      </span>
                    ) : (
                      <span className="ml-2 text-yellow-400 text-xs">
                        ⚠ Doğrulanmamış
                      </span>
                    )}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 bg-[#121212] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="ornek@email.com"
                    />
                    {!currentUser?.isEmailVerified && (
                      <button
                        type="button"
                        onClick={handleSendEmailVerification}
                        disabled={emailLoading}
                        className="px-4 py-3 bg-scroll-accent hover:bg-scroll-accent-strong text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        {emailLoading ? "Gönderiliyor..." : "Doğrula"}
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-scroll-accent hover:bg-scroll-accent-strong disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </form>

              <div className="w-full h-px bg-gray-800 my-8"></div>

              {/* Tehlikeli Bölge */}
              <div>
                <h3 className="text-xl font-bold text-red-500 mb-4">
                  Tehlikeli Bölge
                </h3>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
                  <p className="text-red-300">
                    Hesabınızı silmek geri alınamaz bir işlemdir. Tüm
                    verileriniz kalıcı olarak silinecektir.
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {loading ? "Siliniyor..." : "Hesabı Sil"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Kullanıcı Profili
              </h2>
              <p className="text-gray-400">Profil bilgilerinizi düzenleyin</p>
              <div className="w-full h-px bg-gray-800 mt-4"></div>
            </div>

            <div className="max-w-2xl">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 bg-[#1F1B24] rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">
                    {getInitials(currentUser?.username || "Kullanıcı")}
                  </span>
                </div>
                <div>
                  <button className="px-4 py-2 bg-scroll-accent hover:bg-scroll-accent-strong text-white rounded-lg transition-colors">
                    Avatar Değiştir
                  </button>
                  <p className="text-gray-400 text-sm mt-2">
                    JPG, PNG veya GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hakkımda
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-[#121212] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Kendiniz hakkında bir şeyler yazın..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Konum
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-[#121212] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Şehir, Ülke"
                  />
                </div>

                <button className="px-6 py-3 bg-scroll-accent hover:bg-scroll-accent-strong text-white rounded-lg transition-colors">
                  Profili Güncelle
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Gizlilik & Güvenlik
              </h2>
              <p className="text-gray-400">Hesap güvenliğinizi yönetin</p>
              <div className="w-full h-px bg-gray-800 mt-4"></div>
            </div>

            <div className="max-w-2xl space-y-6">
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Şifre</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mevcut Şifre
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-4 py-3 bg-[#1F1B24] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Mevcut şifrenizi girin"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Yeni Şifre
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-4 py-3 bg-[#1F1B24] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Yeni şifrenizi girin"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Yeni Şifre (Tekrar)
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-4 py-3 bg-[#1F1B24] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Yeni şifrenizi tekrar girin"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-scroll-accent hover:bg-scroll-accent-strong disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    {loading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
                  </button>
                </form>
              </div>

              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  İki Faktörlü Doğrulama
                </h3>
                <p className="text-gray-400 mb-4">
                  Hesabınızı ekstra güvenlik katmanı ile koruyun.
                </p>
                <button className="px-4 py-2 bg-scroll-accent hover:bg-scroll-accent-strong text-white rounded-lg transition-colors">
                  İki Faktörlü Doğrulamayı Etkinleştir
                </button>
              </div>

              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Giriş Geçmişi
                </h3>
                <p className="text-gray-400 mb-4">
                  Hesabınıza yapılan son girişleri görüntüleyin.
                </p>
                <button className="px-4 py-2 bg-scroll-accent hover:bg-scroll-accent-strong text-white rounded-lg transition-colors">
                  Giriş Geçmişini Görüntüle
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Bildirimler
              </h2>
              <p className="text-gray-400">Bildirim tercihlerinizi ayarlayın</p>
              <div className="w-full h-px bg-gray-800 mt-4"></div>
            </div>

            <div className="max-w-2xl space-y-6">
              <div className="bg-[#121212] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      E-posta Bildirimleri
                    </h3>
                    <p className="text-gray-400">
                      Önemli güncellemeler için e-posta alın
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                  </label>
                </div>
              </div>

              <div className="bg-[#121212] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Ses Bildirimleri
                    </h3>
                    <p className="text-gray-400">
                      Yeni mesajlar için ses bildirimi alın
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "audio" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Ses & Video
              </h2>
              <p className="text-gray-400">
                Mikrofon, hoparlör ve kamera ayarlarınızı yönetin
              </p>
              <div className="w-full h-px bg-gray-800 mt-4"></div>
            </div>

            <div className="max-w-2xl space-y-6">
              {/* Mikrofon Ayarları */}
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Mikrofon Ayarları
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mikrofon Cihazı
                    </label>
                    <select
                      value={audioSettings.microphoneDevice}
                      onChange={(e) =>
                        updateAudioSettings({
                          microphoneDevice: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-[#1F1B24] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option>Varsayılan Mikrofon</option>
                      <option>USB Mikrofon</option>
                      <option>Bluetooth Kulaklık</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mikrofon Seviyesi
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="75"
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <span className="text-white text-sm w-12">75%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">
                        Otomatik Ses Seviyesi
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Mikrofon seviyesini otomatik ayarla
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">
                        Gürültü Azaltma
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Arka plan gürültüsünü filtrele
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Hoparlör Ayarları */}
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Hoparlör Ayarları
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hoparlör Cihazı
                    </label>
                    <select className="w-full px-4 py-3 bg-[#1F1B24] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent">
                      <option>Varsayılan Hoparlör</option>
                      <option>USB Kulaklık</option>
                      <option>Bluetooth Hoparlör</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hoparlör Seviyesi
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="60"
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <span className="text-white text-sm w-12">60%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">
                        Otomatik Hoparlör Seviyesi
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Hoparlör seviyesini otomatik ayarla
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Video Ayarları */}
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Video Ayarları
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Kamera Cihazı
                    </label>
                    <select className="w-full px-4 py-3 bg-[#1F1B24] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent">
                      <option>Varsayılan Kamera</option>
                      <option>USB Webcam</option>
                      <option>HD Webcam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Video Kalitesi
                    </label>
                    <select className="w-full px-4 py-3 bg-[#1F1B24] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent">
                      <option>720p (HD)</option>
                      <option>1080p (Full HD)</option>
                      <option>4K (Ultra HD)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Otomatik Odak</h4>
                      <p className="text-gray-400 text-sm">
                        Kamerayı otomatik odakla
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">
                        Düşük Işık Modu
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Karanlık ortamlarda video kalitesini artır
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Gelişmiş Ayarlar */}
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Gelişmiş Ayarlar
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ses Gecikmesi (ms)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      defaultValue="50"
                      className="w-full px-4 py-3 bg-[#1F1B24] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ses Kalitesi
                    </label>
                    <select className="w-full px-4 py-3 bg-[#1F1B24] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent">
                      <option>Düşük (64 kbps)</option>
                      <option>Orta (128 kbps)</option>
                      <option>Yüksek (256 kbps)</option>
                      <option>Ultra (512 kbps)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Eko Azaltma</h4>
                      <p className="text-gray-400 text-sm">
                        Ses yankısını azalt
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Ses Sıkıştırma</h4>
                      <p className="text-gray-400 text-sm">
                        Bant genişliğini optimize et
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Test Butonları */}
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Cihaz Testi
                </h3>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-scroll-accent hover:bg-scroll-accent-strong text-white rounded-lg transition-colors">
                    🎤 Mikrofon Testi
                  </button>
                  <button className="px-4 py-2 bg-scroll-accent hover:bg-scroll-accent-strong text-white rounded-lg transition-colors">
                    🔊 Hoparlör Testi
                  </button>
                  <button className="px-4 py-2 bg-scroll-accent hover:bg-scroll-accent-strong text-white rounded-lg transition-colors">
                    📹 Kamera Testi
                  </button>
                </div>
              </div>

              {/* Kaydet Butonu */}
              <div className="flex justify-end">
                <button className="px-6 py-3 bg-scroll-accent hover:bg-scroll-accent-strong text-white rounded-lg transition-colors">
                  Ayarları Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "keybinds" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Tuş Atamaları
              </h2>
              <p className="text-gray-400">
                Push-to-Talk ve kısayolları özelleştirin
              </p>
              <div className="w-full h-px bg-gray-800 mt-4"></div>
            </div>

            <div className="max-w-2xl space-y-6">
              <div className="bg-[#121212] rounded-lg p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Push-to-Talk
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Bu tuşa basılı tutarken mikrofon açılır.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-2 rounded border border-gray-800 bg-[#121212] text-white min-w-[140px] text-center">
                      {keybindDisplay}
                    </div>
                    <button
                      onClick={() => setIsRecordingKey(true)}
                      className="px-3 py-2 bg-scroll-accent hover:bg-scroll-accent-strong text-white rounded"
                    >
                      Değiştir
                    </button>
                    <span className="text-xs text-gray-400">
                      İpucu:{" "}
                      {pttConfig.mode === "ptt"
                        ? "Basılı tutarken konuşur"
                        : "Basılı tutarken susturur"}
                    </span>
                    <button
                      onClick={() => {
                        try {
                          const blob = new Blob(
                            [JSON.stringify(pttConfig, null, 2)],
                            { type: "application/json" }
                          );
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "ulgen-ptt-settings.json";
                          a.click();
                          URL.revokeObjectURL(url);
                        } catch {}
                      }}
                      className="px-3 py-2 bg-scroll-accent hover:bg-scroll-accent-strong text-white rounded"
                      title="Ayarları dışa aktar"
                    >
                      Dışa Aktar
                    </button>
                    <label
                      className="px-3 py-2 bg-scroll-accent hover:bg-scroll-accent-strong text-white rounded cursor-pointer"
                      title="Ayarları içe aktar"
                    >
                      İçeri Aktar
                      <input
                        type="file"
                        accept="application/json"
                        className="hidden"
                        onChange={async (e) => {
                          try {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const text = await file.text();
                            const parsed = JSON.parse(text);
                            if (!parsed || !parsed.code) return;
                            const cfg = {
                              code: parsed.code,
                              ctrl: !!parsed.ctrl,
                              alt: !!parsed.alt,
                              shift: !!parsed.shift,
                              mode: parsed.mode === "ptm" ? "ptm" : "ptt",
                            } as typeof pttConfig;
                            setPttConfig(cfg);
                            try {
                              localStorage.setItem(
                                "voiceKeybindV2",
                                JSON.stringify(cfg)
                              );
                            } catch {}
                          } catch {}
                        }}
                      />
                    </label>
                  </div>
                </div>
                {isRecordingKey && (
                  <div className="mt-4 p-3 rounded bg-[#121212] border border-gray-800 text-gray-200">
                    Bir tuşa basın... (Esc iptal)
                  </div>
                )}
              </div>

              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Davranış
                </h3>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-gray-200">
                    <input
                      type="radio"
                      name="ptt-mode"
                      checked={pttConfig.mode === "ptt"}
                      onChange={() => {
                        const cfg = { ...pttConfig, mode: "ptt" as const };
                        setPttConfig(cfg);
                        try {
                          localStorage.setItem(
                            "voiceKeybindV2",
                            JSON.stringify(cfg)
                          );
                        } catch {}
                      }}
                    />
                    Konuşmak için bas (PTT)
                  </label>
                  <label className="flex items-center gap-2 text-gray-200">
                    <input
                      type="radio"
                      name="ptt-mode"
                      checked={pttConfig.mode === "ptm"}
                      onChange={() => {
                        const cfg = { ...pttConfig, mode: "ptm" as const };
                        setPttConfig(cfg);
                        try {
                          localStorage.setItem(
                            "voiceKeybindV2",
                            JSON.stringify(cfg)
                          );
                        } catch {}
                      }}
                    />
                    Basılıyken sustur (PTM)
                  </label>
                </div>
                <p className="text-gray-400 text-sm mt-3">
                  Bu ayar tarayıcıda saklanır.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === "privacy" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Gizlilik & Güvenlik</h2>
              <p className="text-gray-400">Hesap güvenliğinizi ve gizlilik ayarlarınızı yönetin</p>
              <div className="w-full h-px bg-gray-800 mt-4"></div>
            </div>

            <div className="space-y-8">
              {/* Gizlilik Ayarları */}
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Gizlilik Ayarları</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Çevrimiçi Durumu Gizle</h4>
                      <p className="text-gray-400 text-sm">Diğer kullanıcılar çevrimiçi durumunuzu göremez</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Aktif Oyunu Gizle</h4>
                      <p className="text-gray-400 text-sm">Hangi oyunu oynadığınızı gizleyin</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Arkadaş İsteklerini Gizle</h4>
                      <p className="text-gray-400 text-sm">Yeni arkadaş isteklerini gizleyin</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Güvenlik Ayarları */}
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Güvenlik Ayarları</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">İki Faktörlü Doğrulama</h4>
                      <p className="text-gray-400 text-sm">Hesabınızı ekstra güvenlik katmanı ile koruyun</p>
                    </div>
                    <button className="px-4 py-2 bg-scroll-accent hover:bg-scroll-accent-strong text-white text-sm font-medium rounded-lg transition-colors">
                      Etkinleştir
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Oturum Geçmişi</h4>
                      <p className="text-gray-400 text-sm">Aktif oturumlarınızı görüntüleyin ve yönetin</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors">
                      Görüntüle
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Güvenlik Uyarıları</h4>
                      <p className="text-gray-400 text-sm">Şüpheli aktiviteler için e-posta alın</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Veri Yönetimi */}
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Veri Yönetimi</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Verilerimi İndir</h4>
                      <p className="text-gray-400 text-sm">Hesabınızla ilgili tüm verileri indirin</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors">
                      İndir
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Verilerimi Sil</h4>
                      <p className="text-gray-400 text-sm">Hesabınızla ilgili tüm verileri kalıcı olarak silin</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === "notifications" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Bildirimler</h2>
              <p className="text-gray-400">Bildirim tercihlerinizi yönetin</p>
              <div className="w-full h-px bg-gray-800 mt-4"></div>
            </div>

            <div className="space-y-8">
              {/* Genel Bildirimler */}
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Genel Bildirimler</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Tüm Bildirimler</h4>
                      <p className="text-gray-400 text-sm">Tüm bildirimleri aç/kapat</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Ses Bildirimleri</h4>
                      <p className="text-gray-400 text-sm">Bildirim seslerini aç/kapat</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Masaüstü Bildirimleri</h4>
                      <p className="text-gray-400 text-sm">Masaüstü bildirimlerini aç/kapat</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Mesaj Bildirimleri */}
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Mesaj Bildirimleri</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Yeni Mesajlar</h4>
                      <p className="text-gray-400 text-sm">Yeni mesajlar için bildirim al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Mention Bildirimleri</h4>
                      <p className="text-gray-400 text-sm">Size mention yapıldığında bildirim al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Sadece @everyone Bildirimleri</h4>
                      <p className="text-gray-400 text-sm">Sadece @everyone bildirimlerini al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Ses Kanalı Bildirimleri */}
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Ses Kanalı Bildirimleri</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Ses Kanalına Katılma</h4>
                      <p className="text-gray-400 text-sm">Birisi ses kanalına katıldığında bildirim al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Ses Kanalından Ayrılma</h4>
                      <p className="text-gray-400 text-sm">Birisi ses kanalından ayrıldığında bildirim al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Keybinds Settings */}
        {activeTab === "keybinds" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Tuş Atamaları</h2>
              <p className="text-gray-400">Klavye kısayollarınızı özelleştirin</p>
              <div className="w-full h-px bg-gray-800 mt-4"></div>
            </div>

            <div className="space-y-8">
              {/* Ses Kısayolları */}
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Ses Kısayolları</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Push-to-Talk</h4>
                      <p className="text-gray-400 text-sm">Konuşmak için basılı tutun</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsRecordingKey(true)}
                        className="px-4 py-2 bg-scroll-accent hover:bg-scroll-accent-strong text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        {keybindDisplay}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Mikrofonu Aç/Kapat</h4>
                      <p className="text-gray-400 text-sm">Mikrofonu hızlıca aç/kapat</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors">
                        Ctrl+M
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Kulaklığı Aç/Kapat</h4>
                      <p className="text-gray-400 text-sm">Kulaklığı hızlıca aç/kapat</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors">
                        Ctrl+D
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Uygulama Kısayolları */}
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Uygulama Kısayolları</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Ayarları Aç</h4>
                      <p className="text-gray-400 text-sm">Ayarlar sayfasını aç</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors">
                        Ctrl+,
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Sunucu Arama</h4>
                      <p className="text-gray-400 text-sm">Sunucu arama kutusunu aç</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors">
                        Ctrl+K
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Hızlı Mesaj</h4>
                      <p className="text-gray-400 text-sm">Hızlı mesaj gönderme kutusunu aç</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors">
                        Ctrl+Shift+M
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kısayol Sıfırlama */}
              <div className="bg-[#121212] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Kısayol Yönetimi</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Varsayılan Ayarlara Sıfırla</h4>
                      <p className="text-gray-400 text-sm">Tüm kısayolları varsayılan değerlere sıfırla</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                      Sıfırla
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diğer sekmeler için placeholder */}
        {![
          "account",
          "profile",
          "privacy",
          "notifications",
          "keybinds",
        ].includes(activeTab) && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {settingsTabs.find((tab) => tab.id === activeTab)?.name}
              </h2>
              <p className="text-gray-400">Bu ayarlar yakında eklenecek</p>
              <div className="w-full h-px bg-gray-800 mt-4"></div>
            </div>

            <div className="max-w-2xl">
              <div className="bg-[#121212] rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-[#1F1B24] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚧</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Yakında Gelecek
                </h3>
                <p className="text-gray-400">
                  Bu özellik şu anda geliştiriliyor.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

// Basit tuş yakalama overlay'i (Escape iptal)
const KeyCaptureOverlay: React.FC<{
  onKey: (
    k: { code: string; ctrl: boolean; alt: boolean; shift: boolean } | null
  ) => void;
  onCancel: () => void;
}> = ({ onKey, onCancel }) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      onKeyDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.key === "Escape") {
          onKey(null);
          return;
        }
        // Sadece tek tuş kaydet; modifier'ları toggle ile değiştir
        const code = e.code || e.key;
        onKey({ code, ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
      }}
      tabIndex={0}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div className="px-6 py-4 rounded-xl bg-[#121212] border border-gray-800 text-gray-100">
        Bir tuşa basın (Esc: iptal). Ctrl/Alt/Shift basılı ise birlikte
        kaydedilir.
      </div>
    </div>
  );
};
