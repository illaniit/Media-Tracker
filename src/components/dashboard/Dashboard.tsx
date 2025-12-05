// src/components/dashboard/Dashboard.tsx
// Vista principal del dashboard con grid de media items

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Film, Tv, Loader2, LogOut, MessageCircle, Book, Gamepad2, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mediaApi } from '../../lib/supabase/api';
import { MediaItem } from '../../lib/supabase/types';
import MediaCard from './MediaCard';
import AddMediaModal from './AddMediaModal';

type FilterType = 'all' | 'movie' | 'series' | 'book' | 'videogame' | 'comic' | 'reviews' | 'pending-movies' | 'pending-series' | 'pending-books' | 'pending-videogames' | 'pending-comics';

export default function Dashboard() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadMediaItems();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, mediaItems]);

  const loadMediaItems = async () => {
    setLoading(true);
    const { data, error } = await mediaApi.getMediaItems();
    if (error) {
      console.error('Error al cargar items:', error);
    } else if (data) {
      setMediaItems(data);
    }
    setLoading(false);
  };

  const applyFilter = () => {
    if (filter === 'all') {
      setFilteredItems(mediaItems);
    } else if (filter === 'reviews') {
      // Mostrar solo contenido completado con opiniones
      setFilteredItems(mediaItems.filter((item) => item.status === 'completed' && item.review));
    } else if (filter === 'pending-movies') {
      // Películas pendientes de ver
      setFilteredItems(mediaItems.filter((item) => item.type === 'movie' && item.status === 'plan_to_watch'));
    } else if (filter === 'pending-series') {
      // Series pendientes de ver
      setFilteredItems(mediaItems.filter((item) => item.type === 'series' && item.status === 'plan_to_watch'));
    } else if (filter === 'pending-books') {
      // Libros pendientes de leer
      setFilteredItems(mediaItems.filter((item) => item.type === 'book' && item.status === 'plan_to_watch'));
    } else if (filter === 'pending-videogames') {
      // Videojuegos pendientes de jugar
      setFilteredItems(mediaItems.filter((item) => item.type === 'videogame' && item.status === 'plan_to_watch'));
    } else if (filter === 'pending-comics') {
      // Comics pendientes de leer
      setFilteredItems(mediaItems.filter((item) => item.type === 'comic' && item.status === 'plan_to_watch'));
    } else {
      setFilteredItems(mediaItems.filter((item) => item.type === filter));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleMediaClick = (id: string) => {
    navigate(`/media/${id}`);
  };

  const handleAddSuccess = () => {
    loadMediaItems();
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="glass-dark border-b border-white/10 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-2.5 rounded-xl">
                  <Film className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Media Tracker
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">
                  Hey <span className="text-blue-400 font-semibold">{user?.email?.split('@')[0]}</span> 👋
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="group relative flex items-center space-x-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 border border-red-500/20 text-slate-100 rounded-xl transition-all duration-300 text-sm sm:text-base overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <LogOut className="w-4 h-4 relative z-10" />
              <span className="hidden sm:inline relative z-10 font-medium">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-10">
        {/* Filters and Add Button */}
        <div className="flex flex-col gap-4 sm:gap-5 mb-8 sm:mb-10">
          {/* Primera fila de filtros */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              <button
                onClick={() => setFilter('all')}
                className={`group relative px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base overflow-hidden ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                    : 'glass text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {filter !== 'all' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                <span className="relative z-10">Todo</span>
              </button>
              <button
                onClick={() => setFilter('movie')}
                className={`group relative flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base overflow-hidden ${
                  filter === 'movie'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                    : 'glass text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {filter !== 'movie' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                <Film className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Películas</span>
              </button>
              <button
                onClick={() => setFilter('series')}
                className={`group relative flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base overflow-hidden ${
                  filter === 'series'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                    : 'glass text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {filter !== 'series' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                <Tv className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Series</span>
              </button>
              <button
                onClick={() => setFilter('book')}
                className={`group relative flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base overflow-hidden ${
                  filter === 'book'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                    : 'glass text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {filter !== 'book' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                <Book className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Libros</span>
              </button>
              <button
                onClick={() => setFilter('videogame')}
                className={`group relative flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base overflow-hidden ${
                  filter === 'videogame'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50'
                    : 'glass text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {filter !== 'videogame' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                <Gamepad2 className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline relative z-10">Videojuegos</span>
                <span className="sm:hidden relative z-10">Games</span>
              </button>
              <button
                onClick={() => setFilter('comic')}
                className={`group relative flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base overflow-hidden ${
                  filter === 'comic'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/50'
                    : 'glass text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {filter !== 'comic' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                <BookOpen className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Comics</span>
              </button>
              <button
                onClick={() => setFilter('reviews')}
                className={`group relative flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base overflow-hidden ${
                  filter === 'reviews'
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/50'
                    : 'glass text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {filter !== 'reviews' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                <MessageCircle className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline relative z-10">Mis Opiniones</span>
                <span className="sm:hidden relative z-10">Opiniones</span>
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="group relative flex items-center justify-center space-x-2 px-5 sm:px-7 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 text-sm sm:text-base shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Añadir</span>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>

          {/* Segunda fila: Pendientes */}
          <div className="glass rounded-2xl p-3 sm:p-4 border border-white/10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="text-xs sm:text-sm text-yellow-400 font-bold px-3 py-1 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                ⏳ Pendientes
              </span>
              <button
                onClick={() => setFilter('pending-movies')}
                className={`group relative flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm overflow-hidden ${
                  filter === 'pending-movies'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50'
                    : 'bg-slate-800/50 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                {filter !== 'pending-movies' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                <Film className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                <span className="relative z-10">Películas</span>
              </button>
              <button
                onClick={() => setFilter('pending-series')}
                className={`group relative flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm overflow-hidden ${
                  filter === 'pending-series'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50'
                    : 'bg-slate-800/50 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                {filter !== 'pending-series' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                <Tv className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                <span className="relative z-10">Series</span>
              </button>
              <button
                onClick={() => setFilter('pending-books')}
                className={`group relative flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm overflow-hidden ${
                  filter === 'pending-books'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50'
                    : 'bg-slate-800/50 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                {filter !== 'pending-books' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                <Book className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                <span className="relative z-10">Libros</span>
              </button>
              <button
                onClick={() => setFilter('pending-videogames')}
                className={`group relative flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm overflow-hidden ${
                  filter === 'pending-videogames'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50'
                    : 'bg-slate-800/50 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                {filter !== 'pending-videogames' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                <span className="hidden sm:inline relative z-10">Videojuegos</span>
                <span className="sm:hidden relative z-10">Games</span>
              </button>
              <button
                onClick={() => setFilter('pending-comics')}
                className={`group relative flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm overflow-hidden ${
                  filter === 'pending-comics'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50'
                    : 'bg-slate-800/50 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                {filter !== 'pending-comics' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                <span className="relative z-10">Comics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
              <Loader2 className="relative w-12 h-12 text-blue-400 animate-spin" />
            </div>
            <p className="mt-6 text-slate-400 font-medium">Cargando tu contenido...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="glass rounded-3xl border border-white/10 text-center py-24 px-6">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-slate-800/50 rounded-full p-4">
                {filter === 'movie' || filter === 'pending-movies' ? (
                  <Film className="w-8 h-8 text-blue-400" />
                ) : filter === 'series' || filter === 'pending-series' ? (
                  <Tv className="w-8 h-8 text-purple-400" />
                ) : filter === 'book' || filter === 'pending-books' ? (
                  <Book className="w-8 h-8 text-green-400" />
                ) : filter === 'videogame' || filter === 'pending-videogames' ? (
                  <Gamepad2 className="w-8 h-8 text-orange-400" />
                ) : filter === 'comic' || filter === 'pending-comics' ? (
                  <BookOpen className="w-8 h-8 text-pink-400" />
                ) : filter === 'reviews' ? (
                  <MessageCircle className="w-8 h-8 text-violet-400" />
                ) : (
                  <Film className="w-8 h-8 text-slate-400" />
                )}
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent mb-3">
              No hay {
                filter === 'all' ? 'contenido' : 
                filter === 'movie' ? 'películas' : 
                filter === 'series' ? 'series' :
                filter === 'book' ? 'libros' :
                filter === 'videogame' ? 'videojuegos' :
                filter === 'comic' ? 'comics' :
                filter === 'reviews' ? 'opiniones' :
                filter === 'pending-movies' ? 'películas pendientes' :
                filter === 'pending-series' ? 'series pendientes' :
                filter === 'pending-books' ? 'libros pendientes' :
                filter === 'pending-videogames' ? 'videojuegos pendientes' :
                filter === 'pending-comics' ? 'comics pendientes' : 'contenido'
              }
            </h3>
            <p className="text-slate-400 text-sm sm:text-base mb-8">
              {filter === 'reviews' 
                ? 'Marca contenido como completado y añade tu opinión para verlo aquí 📝'
                : filter.includes('pending')
                ? 'Añade contenido con estado "Por ver" para verlo aquí 👀'
                : `Comienza añadiendo tu primer ${filter === 'series' ? 'serie' : filter === 'book' ? 'libro' : filter === 'videogame' ? 'videojuego' : filter === 'comic' ? 'comic' : 'contenido'} ✨`
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="group relative inline-flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Añadir ahora</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
            {filteredItems.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onClick={() => handleMediaClick(item.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Media Modal */}
      {showAddModal && (
        <AddMediaModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
}
