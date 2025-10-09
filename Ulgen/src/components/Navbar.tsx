import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const Navbar: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Çıkış yapılırken hata:', error);
        }
    };

    return (
        <nav className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <img
                                className="h-8 w-8 mr-2 rounded object-cover"
                                src="/ulgen-logo.jpg"
                                alt="Ulgen Logo"
                            />
                            <span className="text-white font-bold text-xl">Ulgen</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-300 text-sm">
                                        {currentUser.username}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Çıkış Yap
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium"
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
