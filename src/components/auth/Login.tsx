// src/components/auth/Login.tsx
// Componente de inicio de sesión

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Film, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message || 'Error al iniciar sesión');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Error inesperado. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Elegant Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-950"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-neutral-400/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo y título */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-2xl shadow-2xl shadow-amber-500/20">
                <Film className="w-12 h-12 text-black" />
              </div>
            </div>
          </div>
          <h2 className="mt-6 text-4xl font-black bg-gradient-to-r from-amber-200 via-amber-300 to-neutral-200 bg-clip-text text-transparent">
            Media Tracker
          </h2>
          <p className="mt-3 text-base text-neutral-400 font-medium">
            Tu colección personal de contenido 🎬📚🎮
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-neutral-950 rounded-2xl shadow-2xl p-8 border border-neutral-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-950/50 rounded-xl border border-red-800/50 text-red-300 px-4 py-3 text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-neutral-300 mb-2">
                ✉️ Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 rounded-xl text-neutral-100 placeholder-neutral-500 border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-neutral-300 mb-2">
                🔒 Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 rounded-xl text-neutral-100 placeholder-neutral-500 border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Iniciar sesión ✨</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="text-amber-400 hover:text-amber-300 font-bold transition"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
