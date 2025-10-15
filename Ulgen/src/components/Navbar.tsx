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
    <nav className="bg-slate-900/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Sol kısım: logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/ulgen-logo.jpg"
                alt="Ulgen Logo"
                className="h-8 w-8 rounded-md object-cover"
              />
              <span className="text-white font-semibold text-lg tracking-wide">
                Ulgen
              </span>
            </Link>
          </div>

          {/* Sağ kısım: bağlantılar */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>

                <div className="flex items-center space-x-3">
                  <span className="text-slate-300 text-sm truncate max-w-[120px]">
                    {currentUser.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition"
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
