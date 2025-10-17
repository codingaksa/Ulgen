// client/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { UserStatusProvider } from "./contexts/UserStatusContext.tsx";
import { ToastProvider } from "./components/Toast.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Navbar from "./components/Navbar.tsx";

// Code-splitting (daha hızlı ilk yükleme)
const Home = lazy(() => import("./pages/Home.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Register = lazy(() => import("./pages/Register.tsx"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));
const VoiceChannel = lazy(() => import("./pages/VoiceChannel.tsx"));

// Basit bir fallback (Skeleton/Spinner yerine minimal)
function Fallback() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="text-gray-300">Yükleniyor…</div>
    </div>
  );
}

// 404
function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center px-4 text-center">
      <div>
        <div className="text-4xl font-bold text-white mb-2">404</div>
        <p className="text-gray-400">Aradığınız sayfa bulunamadı.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserStatusProvider>
          <ToastProvider>
            <Router>
              <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
                <Navbar />
                <Suspense fallback={<Fallback />}>
                  <Routes>
                    {/* Public */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Protected */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/channel/:id"
                      element={
                        <ProtectedRoute>
                          <VoiceChannel />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
            </Router>
          </ToastProvider>
        </UserStatusProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
