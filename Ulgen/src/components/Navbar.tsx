// components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
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
