// client/src/pages/Home.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";

const Home: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="bg-black min-h-screen">
      {/* Modern Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements (no animation) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-black/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-black/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="relative pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <div className="flex items-center mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 bg-scroll-accent rounded-full flex items-center justify-center mr-6">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src="/ulgen-logo.jpg"
                        alt="Ulgen Logo"
                      />
                    </div>
                  </div>
                  <h1 className="text-5xl tracking-tight font-extrabold text-white sm:text-6xl md:text-7xl">
                    Ulgen
                  </h1>
                </div>
                <p className="mt-6 text-lg text-gray-300 sm:mt-8 sm:text-xl sm:max-w-xl sm:mx-auto md:mt-8 md:text-2xl lg:mx-0 leading-relaxed">
                  Kendi özel ses kanallarınızı oluşturun, arkadaşlarınızla
                  anında bağlantı kurun ve kaliteli ses iletişimi yaşayın.
                </p>
                <div className="mt-8 sm:mt-12 sm:flex sm:justify-center lg:justify-start gap-4">
                  {currentUser ? (
                    <Link
                      to="/dashboard"
                      className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-scroll-accent hover:bg-scroll-accent-strong rounded-2xl border border-transparent transition-all duration-300 hover:scale-105 md:px-10 md:py-5"
                    >
                      <span className="relative z-10">Dashboard'a Git</span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-scroll-accent hover:bg-scroll-accent-strong rounded-2xl border border-transparent transition-all duration-300 hover:scale-105 md:px-10 md:py-5"
                      >
                        <span className="relative z-10">Hemen Başla</span>
                      </Link>
                      <Link
                        to="/login"
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-transparent hover:bg-scroll-accent-strong rounded-2xl border border-transparent transition-all duration-300 hover:scale-105 md:px-10 md:py-5"
                      >
                        <span className="relative z-10">Giriş Yap</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-black sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center relative overflow-hidden">
            {/* Static Background (no animation) */}
            <div className="absolute inset-0 bg-black/10"></div>

            <div className="text-center p-8 relative z-10">
              <div className="bg-black backdrop-blur-sm rounded-3xl p-8 inline-block border border-gray-800 shadow-2xl">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full mr-3 shadow-lg shadow-red-500/30"></div>
                  <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mr-3 shadow-lg shadow-yellow-500/30"></div>
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg shadow-green-500/30"></div>
                </div>
                <div className="bg-black backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-800 shadow-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-scroll-accent rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">U</span>
                    </div>
                    <div className="text-white text-lg font-semibold">
                      Ses Kanalı #1
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm">3 kişi çevrimiçi</div>
                </div>
                <div className="text-gray-300 text-sm font-medium">
                  Özel ses kanalınızı görselleştirin
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Features Section */}
      <div className="py-20 bg-black relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-gray-800/10 to-gray-700/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-gray-700/10 to-gray-600/10 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-base text-gray-400 font-semibold tracking-wide uppercase mb-4">
              Özellikler
            </h2>
            <p className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
              Neden Ulgen'i Seçmelisiniz?
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="group relative bg-black backdrop-blur-sm rounded-3xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-scroll-accent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">
                      Yüksek Kaliteli Ses
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Gelişmiş ses codec'leri ile net ve kesintisiz iletişim
                      deneyimi
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative bg-black backdrop-blur-sm rounded-3xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-scroll-accent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">
                      Güvenli Bağlantı
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      End-to-end şifreleme ile güvenli ses iletişimi
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative bg-black backdrop-blur-sm rounded-3xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-scroll-accent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">
                      Kolay Yönetim
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Kullanıcı dostu arayüz ile kanallarınızı kolayca yönetin
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative bg-black backdrop-blur-sm rounded-3xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-scroll-accent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">
                      Hızlı Kurulum
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Sadece birkaç dakika içinde kendi ses kanalınızı oluşturun
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
