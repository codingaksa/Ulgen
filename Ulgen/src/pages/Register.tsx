// client/src/pages/Register.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [lastEmail, setLastEmail] = useState('');
    const { register, resendVerification } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return setError('Şifreler eşleşmiyor');
        }

        try {
            setError('');
            setLoading(true);
            setLastEmail(formData.email);
            await register(formData.username, formData.email, formData.password);
            setSuccess(true);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Hesap oluşturulamadı. Lütfen tekrar deneyin.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Sol Kolon - Logo ve Açıklama */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 flex-col justify-center items-center p-12">
                <div className="max-w-md text-center">
                    <div className="mb-8">
                        <img
                            className="h-20 w-20 mx-auto mb-6 rounded-full border-4 border-gray-600"
                            src="/ulgen-logo.jpg"
                            alt="Ulgen Logo"
                        />
                        <h1 className="text-4xl font-bold text-white mb-4">Ulgen</h1>
                        <p className="text-xl text-gray-300 mb-6">
                            Türk mitolojisinden gelen "Ulgen", gökyüzünün yüce tanrısıdır.
                            Tıpkı Ulgen'in gökyüzünde hüküm sürmesi gibi, biz de ses iletişiminde
                            en yüksek kaliteyi sunuyoruz.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            Arkadaşlarınızla, ailenizle veya iş arkadaşlarınızla kaliteli ses iletişimi kurun.
                            Özel kanallarınızı oluşturun, güvenli bağlantılar kurun ve kesintisiz sohbet deneyimi yaşayın.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sağ Kolon - Register Formu */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12">
                <div className="max-w-md mx-auto w-full">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {success ? 'Kayıt Başarılı!' : 'Hesap Oluşturun'}
                        </h2>
                        <p className="text-gray-400">
                            {success ? 'E-posta adresinizi kontrol edin' : 'Ulgen ailesine katılın'}
                        </p>
                    </div>
                    {success ? (
                        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Tebrikler!</h3>
                                <p className="text-gray-300 mb-6">
                                    Hesabınız başarıyla oluşturuldu. E-posta adresinize gönderilen doğrulama linkine tıklayarak
                                    hesabınızı aktifleştirin.
                                </p>
                                <div className="space-y-3">
                                    <Link
                                        to="/login"
                                        className="block w-full text-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                                    >
                                        Giriş Yap
                                    </Link>
                                    {lastEmail && (
                                        <button
                                            onClick={async () => { try { setLoading(true); await resendVerification(lastEmail); } finally { setLoading(false); } }}
                                            className="block w-full text-center px-6 py-3 border border-blue-700 text-base font-medium rounded-lg text-blue-200 bg-blue-900/30 hover:bg-blue-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition-all duration-200"
                                        >
                                            Doğrulama e‑postasını tekrar gönder
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="block w-full text-center px-6 py-3 border border-gray-600 text-base font-medium rounded-lg text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                                    >
                                        Tekrar Kayıt Ol
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-gray-700 border border-gray-600 text-gray-200 p-4 rounded-lg text-center">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div className="group">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                        Kullanıcı adı
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            required
                                            className="appearance-none relative block w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-700 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 hover:bg-gray-600"
                                            placeholder="Kullanıcı adınız"
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-300 mb-2">
                                        E-posta adresi
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email-address"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="appearance-none relative block w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-700 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 hover:bg-gray-600"
                                            placeholder="E-posta adresinizi giriniz"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                        Şifre
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            className="appearance-none relative block w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-700 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 hover:bg-gray-600"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
                                        Şifre Tekrar
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="confirm-password"
                                            name="confirmPassword"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            className="appearance-none relative block w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-700 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 hover:bg-gray-600"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Hesap Oluşturuluyor...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <span>Hesap Oluştur</span>
                                            <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-gray-400">
                                    Zaten hesabınız var mı?{' '}
                                    <Link
                                        to="/login"
                                        className="font-medium text-gray-300 hover:text-white transition-colors duration-200"
                                    >
                                        Giriş Yapın
                                    </Link>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
