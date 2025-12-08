// src/components/landing/LandingPage.tsx
// Landing page principal de la aplicación

import { useNavigate } from 'react-router-dom';
import { Film, Tv, Book, Gamepad2, BookOpen, Star, Sparkles, Users, Lock, Shield, Github, Linkedin, Mail } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Elegant Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-950"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-neutral-400/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-600/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-3xl shadow-2xl shadow-amber-500/20">
                <Film className="w-16 h-16 text-black" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-amber-200 via-amber-300 to-neutral-200 bg-clip-text text-transparent">
              Media Tracker
            </h1>

            <p className="text-xl sm:text-2xl text-neutral-400 mb-4 max-w-3xl mx-auto leading-relaxed">
              Tu colección personal de entretenimiento
            </p>

            <p className="text-base sm:text-lg text-neutral-500 mb-12 max-w-2xl mx-auto">
              Organiza y gestiona todas tus películas, series, libros, videojuegos y comics en un solo lugar. 
              Lleva el control de lo que has visto, lo que estás viendo y lo que planeas ver.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12 max-w-4xl mx-auto">
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-200">
                <Film className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-300 font-medium text-sm">Películas</p>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-200">
                <Tv className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-300 font-medium text-sm">Series</p>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-200">
                <Book className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-300 font-medium text-sm">Libros</p>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-200">
                <Gamepad2 className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <p className="text-neutral-300 font-medium text-sm">Videojuegos</p>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-200">
                <BookOpen className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-300 font-medium text-sm">Comics</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => navigate('/guest')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Probar como Invitado
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-100 font-bold rounded-xl transition-all duration-200 border border-neutral-800 flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-100 font-bold rounded-xl transition-all duration-200 border border-neutral-800"
              >
                Crear Cuenta
              </button>
            </div>

            {/* Features List */}
            <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-left">
                <Star className="w-10 h-10 text-amber-400 mb-4" />
                <h3 className="text-xl font-bold text-neutral-100 mb-2">Califica tu Contenido</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Guarda tus calificaciones personales y compara con las valoraciones de TMDB.
                </p>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-left">
                <Sparkles className="w-10 h-10 text-amber-400 mb-4" />
                <h3 className="text-xl font-bold text-neutral-100 mb-2">Organiza Todo</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Marca lo que estás viendo, lo completado, lo pendiente y lo abandonado.
                </p>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-left">
                <Shield className="w-10 h-10 text-amber-400 mb-4" />
                <h3 className="text-xl font-bold text-neutral-100 mb-2">Datos Seguros</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Tu información está protegida con autenticación segura de Supabase.
                </p>
              </div>
            </div>

            {/* Guest Mode Warning */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6 max-w-3xl mx-auto mb-16">
              <div className="flex items-start gap-4">
                <Users className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h4 className="text-lg font-bold text-amber-300 mb-2">Modo Invitado</h4>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    Puedes usar la aplicación sin registro, pero <strong>tus datos no se guardarán</strong> y se perderán al cerrar o recargar la página. 
                    Para guardar tu colección permanentemente, crea una cuenta gratuita.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-neutral-800 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-neutral-400 text-sm mb-2">
                  Creado por <span className="text-amber-400 font-bold">Illán Iglesias Torres</span>
                </p>
                <p className="text-neutral-500 text-xs">
                  Estudiante de Ingeniería Informática · Experimento de Vibe Coding
                </p>
              </div>
              
              <div className="flex gap-4">
                <a
                  href="https://github.com/illaniit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all duration-200 border border-neutral-800 hover:border-amber-500/30"
                  title="GitHub"
                >
                  <Github className="w-5 h-5 text-neutral-400" />
                </a>
                <a
                  href="https://linkedin.com/in/illan-iglesias"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all duration-200 border border-neutral-800 hover:border-amber-500/30"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-neutral-400" />
                </a>
                <a
                  href="mailto:illan.iglesias@example.com"
                  className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all duration-200 border border-neutral-800 hover:border-amber-500/30"
                  title="Email"
                >
                  <Mail className="w-5 h-5 text-neutral-400" />
                </a>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-neutral-800 text-center">
              <p className="text-neutral-500 text-xs">
                © 2025 Media Tracker. Proyecto experimental de desarrollo web.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
