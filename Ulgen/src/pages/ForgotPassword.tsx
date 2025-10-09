import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';

const ForgotPassword: React.FC = () => {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);
        try {
            await forgotPassword(email);
            setMessage('Şifre sıfırlama bağlantısı e‑posta adresinize gönderildi.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'İşlem başarısız');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <div className="w-full max-w-md bg-gray-800/60 backdrop-blur rounded-2xl border border-gray-700 p-8 shadow-xl">
                <h1 className="text-2xl font-bold mb-2">Şifremi Unuttum</h1>
                <p className="text-gray-400 mb-6">E‑posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.</p>
                {message && <div className="mb-4 p-3 rounded bg-green-600/20 text-green-300 border border-green-700">{message}</div>}
                {error && <div className="mb-4 p-3 rounded bg-red-600/20 text-red-300 border border-red-700">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E‑posta"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? 'Gönderiliyor...' : 'Bağlantıyı Gönder'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;


