import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const ResetPassword: React.FC = () => {
    const { resetPassword } = useAuth();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('Şifre en az 6 karakter olmalı');
            return;
        }
        if (password !== confirm) {
            setError('Şifreler eşleşmiyor');
            return;
        }
        setLoading(true);
        setMessage(null);
        setError(null);
        try {
            await resetPassword(token, password);
            setMessage('Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'İşlem başarısız');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <div className="w-full max-w-md bg-gray-800/60 backdrop-blur rounded-2xl border border-gray-700 p-8 shadow-xl">
                <h1 className="text-2xl font-bold mb-2">Şifre Sıfırla</h1>
                {!token && <p className="text-red-300 mb-4">Token bulunamadı.</p>}
                {message && <div className="mb-4 p-3 rounded bg-green-600/20 text-green-300 border border-green-700">{message}</div>}
                {error && <div className="mb-4 p-3 rounded bg-red-600/20 text-red-300 border border-red-700">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Yeni şifre"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Yeni şifre (tekrar)"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
                    </button>
                    <div className="text-center text-gray-400 text-sm">
                        <Link to="/login" className="text-blue-400 hover:text-blue-300">Giriş sayfasına dön</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;


