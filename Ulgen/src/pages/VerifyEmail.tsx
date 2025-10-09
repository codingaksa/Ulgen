import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const token = searchParams.get('token');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Doğrulama token\'ı bulunamadı.');
                return;
            }

            try {
                const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:5000/api';
                const response = await fetch(`${API_BASE}/auth/verify-email?token=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setStatus('success');
                    setMessage(data.message || 'E-posta adresiniz başarıyla doğrulandı! Artık giriş yapabilirsiniz.');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'E-posta doğrulama başarısız.');
                }
            } catch (error) {
                console.error('Email verification error:', error);
                setStatus('error');
                setMessage('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-6">
                        <img
                            className="h-16 w-16 rounded-full border-4 border-gray-600 shadow-lg object-cover"
                            src="/ulgen-logo.jpg"
                            alt="Ulgen Logo"
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/64x64/4a5568/ffffff?text=U';
                            }}
                        />
                        <h1 className="text-4xl font-bold text-white ml-4">Ulgen</h1>
                    </div>
                    <p className="text-gray-400 text-lg">E-posta Doğrulama</p>
                </div>

                {/* Main Card */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 p-8 md:p-12">
                    <div className="max-w-md mx-auto">
                        {/* Status Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-3">
                                {status === 'loading' && (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-8 w-8 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Doğrulanıyor...
                                    </span>
                                )}
                                {status === 'success' && '🎉 Doğrulama Başarılı!'}
                                {status === 'error' && '❌ Doğrulama Başarısız'}
                            </h2>
                            <p className="text-gray-400 text-lg">
                                {status === 'loading' && 'E-posta adresiniz doğrulanıyor, lütfen bekleyin.'}
                                {status === 'success' && 'Artık hesabınıza giriş yapabilirsiniz.'}
                                {status === 'error' && 'Bir sorun oluştu.'}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            {status === 'loading' && (
                                <div className="text-center py-8">
                                    <div className="relative">
                                        <div className="w-24 h-24 mx-auto mb-6">
                                            <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
                                            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                                        </div>
                                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-lg">E-posta adresiniz doğrulanıyor...</p>
                                    <div className="mt-4 flex justify-center space-x-1">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            )}

                            {status === 'success' && (
                                <div className="text-center py-8">
                                    <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Tebrikler!</h3>
                                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">{message}</p>
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Giriş Yap
                                    </Link>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="text-center py-8">
                                    <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Hata Oluştu</h3>
                                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">{message}</p>
                                    <div className="space-y-4">
                                        <Link
                                            to="/register"
                                            className="block w-full text-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                                        >
                                            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                            Tekrar Kayıt Ol
                                        </Link>
                                        <Link
                                            to="/login"
                                            className="block w-full text-center px-8 py-4 border-2 border-gray-600 text-gray-300 font-semibold rounded-xl hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-200"
                                        >
                                            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Giriş Sayfasına Dön
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
                            <p className="text-gray-500 text-sm">
                                Sorun yaşıyorsanız{' '}
                                <a href="mailto:support@ulgen.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    destek ekibimizle
                                </a>{' '}
                                iletişime geçin.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
