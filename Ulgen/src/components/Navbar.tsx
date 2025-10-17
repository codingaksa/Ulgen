// components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import UserStatusSelector from "./UserStatusSelector";

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Çıkış yapılırken hata:", err);
    }
  };

  return (
    <nav className="bg-black backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Sol kısım: logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-scroll-accent rounded-full flex items-center justify-center">
                <img
                  src="/ulgen-logo.jpg"
                  alt="Ulgen Logo"
                  className="h-6 w-6 rounded-full object-cover"
                />
              </div>
              <span className="text-white font-bold text-xl tracking-wide">
                Ulgen
              </span>
            </Link>
          </div>

          {/* Sağ kısım: bağlantılar */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>

                <div className="flex items-center space-x-3">
                  {/* User Status Selector */}
                  <UserStatusSelector />

                  {/* Tema değiştirme butonu */}
                  <button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="p-2 text-gray-300 hover:text-white transition-colors"
                    title={`${theme === "dark" ? "Açık" : "Koyu"} temaya geç`}
                  >
                    {theme === "dark" ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    )}
                  </button>

                  <span className="text-gray-300 text-sm truncate max-w-[120px]">
                    {currentUser.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-scroll-accent hover:bg-scroll-accent-strong text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-scroll-accent hover:bg-scroll-accent-strong text-white px-4 py-2 rounded-lg text-sm font-medium transition border border-transparent"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="bg-scroll-accent hover:bg-scroll-accent-strong text-white px-4 py-2 rounded-lg text-sm font-medium transition border border-transparent"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
