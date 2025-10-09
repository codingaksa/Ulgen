import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
    id: string;
    username: string;
    email: string;
    isEmailVerified?: boolean;
}

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: { username?: string; email?: string }) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    deleteAccount: () => Promise<void>;
    resendVerification: (email: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
    updateStatus: (status: 'online' | 'away' | 'dnd' | 'offline') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Sayfa yüklendiğinde token kontrolü
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                // E-posta onayı kontrolü
                if (user.isEmailVerified) {
                    setCurrentUser(user);
                } else {
                    // E-posta onaylanmamışsa çıkış yap
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error('User data parse error:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }

        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.requiresVerification) {
                    throw new Error('E-posta adresinizi doğrulamanız gerekiyor. Lütfen e-posta kutunuzu kontrol edin.');
                }
                throw new Error(data.message || 'Giriş başarısız');
            }

            // Token ve kullanıcı bilgilerini kaydet
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setCurrentUser(data.user);
        } catch (error) {
            console.error('Login error:', error);
            throw error; // Hata mesajını yukarı fırlat
        }
    };

    const register = async (username: string, email: string, password: string): Promise<void> => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Kayıt başarısız');
            }

            // Kayıt başarılı. E-posta doğrulaması yapılana kadar kullanıcayı oturum açmış olarak işaretleme.
            // Güvenlik için localStorage'a kullanıcı veya token yazmıyoruz.
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setCurrentUser(null);
        } catch (error) {
            console.error('Registration error:', error);
            throw error; // Hata mesajını yukarı fırlat
        }
    };

    const logout = async (): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await fetch('http://localhost:5000/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setCurrentUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Hata olsa bile local storage'ı temizle
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setCurrentUser(null);
        }
    };

    const updateProfile = async (data: { username?: string; email?: string }): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
            }

            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Profil güncellenemedi');
            }

            // Güncellenmiş kullanıcı bilgilerini kaydet
            localStorage.setItem('user', JSON.stringify(responseData.user));
            setCurrentUser(responseData.user);
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
            }

            const response = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Şifre değiştirilemedi');
            }
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    };

    const deleteAccount = async (): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
            }

            const response = await fetch('http://localhost:5000/api/auth/delete-account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Hesap silinemedi');
            }

            // Hesap silindikten sonra çıkış yap
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setCurrentUser(null);
        } catch (error) {
            console.error('Delete account error:', error);
            throw error;
        }
    };

    const resendVerification = async (email: string): Promise<void> => {
        const response = await fetch('http://localhost:5000/api/auth/resend-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Doğrulama e-postası gönderilemedi');
    };

    const forgotPassword = async (email: string): Promise<void> => {
        const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Şifre sıfırlama e-postası gönderilemedi');
    };

    const resetPassword = async (token: string, newPassword: string): Promise<void> => {
        const response = await fetch('http://localhost:5000/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password: newPassword })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Şifre sıfırlanamadı');
    };

    const updateStatus = async (status: 'online' | 'away' | 'dnd' | 'offline'): Promise<void> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
        const response = await fetch('http://localhost:5000/api/auth/status', {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Durum güncellenemedi');
        // local user state güncelle
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            const updated = { ...user, status: data.status };
            localStorage.setItem('user', JSON.stringify(updated));
            setCurrentUser(updated);
        }
    };

    const value: AuthContextType = {
        currentUser,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
        resendVerification,
        forgotPassword,
        resetPassword,
        updateStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
