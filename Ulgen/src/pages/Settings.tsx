import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.tsx";

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
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
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
    <div className="h-screen bg-gray-900 flex">
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
      <div className="w-80 bg-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-700">
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
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Çıkış Butonu */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <span>🚪</span>
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Ana İçerik Alanı */}
      <div className="flex-1 bg-gray-900 p-8">
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
              <div className="w-full h-px bg-gray-700 mt-4"></div>
            </div>

            <div className="max-w-2xl">
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
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="KullaniciAdi#1234"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </form>

              <div className="w-full h-px bg-gray-700 my-8"></div>

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
              <div className="w-full h-px bg-gray-700 mt-4"></div>
            </div>

            <div className="max-w-2xl">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">
                    {getInitials(currentUser?.username || "Kullanıcı")}
                  </span>
                </div>
                <div>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
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
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Kendiniz hakkında bir şeyler yazın..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Konum
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Şehir, Ülke"
                  />
                </div>

                <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
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
              <div className="w-full h-px bg-gray-700 mt-4"></div>
            </div>

            <div className="max-w-2xl space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
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
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="Yeni şifrenizi tekrar girin"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    {loading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
                  </button>
                </form>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  İki Faktörlü Doğrulama
                </h3>
                <p className="text-gray-400 mb-4">
                  Hesabınızı ekstra güvenlik katmanı ile koruyun.
                </p>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                  İki Faktörlü Doğrulamayı Etkinleştir
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Giriş Geçmişi
                </h3>
                <p className="text-gray-400 mb-4">
                  Hesabınıza yapılan son girişleri görüntüleyin.
                </p>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
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
              <div className="w-full h-px bg-gray-700 mt-4"></div>
            </div>

            <div className="max-w-2xl space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
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
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-500"></div>
                  </label>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
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
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-500"></div>
                  </label>
                </div>
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
              <div className="w-full h-px bg-gray-700 mt-4"></div>
            </div>

            <div className="max-w-2xl space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
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
                    <div className="px-3 py-2 rounded border border-gray-600 bg-gray-900 text-white min-w-[140px] text-center">
                      {keybindDisplay}
                    </div>
                    <button
                      onClick={() => setIsRecordingKey(true)}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
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
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                      title="Ayarları dışa aktar"
                    >
                      Dışa Aktar
                    </button>
                    <label
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded cursor-pointer"
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
                  <div className="mt-4 p-3 rounded bg-gray-900 border border-gray-700 text-gray-200">
                    Bir tuşa basın... (Esc iptal)
                  </div>
                )}
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
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
              <div className="w-full h-px bg-gray-700 mt-4"></div>
            </div>

            <div className="max-w-2xl">
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
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
      <div className="px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 text-gray-100">
        Bir tuşa basın (Esc: iptal). Ctrl/Alt/Shift basılı ise birlikte
        kaydedilir.
      </div>
    </div>
  );
};
