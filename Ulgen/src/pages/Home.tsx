// client/src/pages/Home.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const Home: React.FC = () => {
    const { currentUser } = useAuth();

    return (
        <div className="bg-gray-900">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <svg
                            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-gray-900 transform translate-x-1/2"
                            fill="currentColor"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <polygon points="50,0 100,0 50,100 0,100" />
                        </svg>

                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <div className="flex items-center mb-8">
                                    <img
                                        className="h-12 w-12 mr-4 rounded-lg object-cover"
                                        src="/ulgen-logo.jpg"
                                        alt="Ulgen Logo"
                                    />
                                    <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                                        Ulgen
                                    </h1>
                                </div>
                                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Kendi özel ses kanallarınızı oluşturun, arkadaşlarınızla anında bağlantı kurun ve kaliteli ses iletişimi yaşayın.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        {currentUser ? (
                                            <Link
                                                to="/dashboard"
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                                            >
                                                Dashboard'a Git
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/register"
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                                            >
                                                Hemen Başla
                                            </Link>
                                        )}
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link
                                            to="/login"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-300 bg-indigo-900 hover:bg-indigo-800 md:py-4 md:text-lg md:px-10"
                                        >
                                            Giriş Yap
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <div className="h-56 w-full bg-gray-800 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
                        <div className="text-center p-8">
                            <div className="bg-gray-700 rounded-lg p-6 inline-block">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="bg-gray-800 rounded p-4 mb-4">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-indigo-500 rounded-full mr-2 flex items-center justify-center">
                                            <span className="text-white text-xs">U</span>
                                        </div>
                                        <div className="text-white text-sm">Ses Kanalı #1</div>
                                    </div>
                                    <div className="text-gray-400 text-xs">
                                        3 kişi çevrimiçi
                                    </div>
                                </div>
                                <div className="text-gray-300 text-sm">
                                    Özel ses kanalınızı görselleştirin
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-indigo-400 font-semibold tracking-wide uppercase">Özellikler</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                            Neden Ulgen'i Seçmelisiniz?
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-white">Yüksek Kaliteli Ses</h3>
                                    <p className="mt-2 text-base text-gray-300">
                                        Gelişmiş ses codec'leri ile net ve kesintisiz iletişim deneyimi.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-white">Güvenli Bağlantı</h3>
                                    <p className="mt-2 text-base text-gray-300">
                                        End-to-end şifreleme ile güvenli ses iletişimi.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-white">Kolay Yönetim</h3>
                                    <p className="mt-2 text-base text-gray-300">
                                        Kullanıcı dostu arayüz ile kanallarınızı kolayca yönetin.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-white">Hızlı Kurulum</h3>
                                    <p className="mt-2 text-base text-gray-300">
                                        Sadece birkaç dakika içinde kendi ses kanalınızı oluşturun.
                                    </p>
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
