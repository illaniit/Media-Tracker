// src/components/dashboard/Dashboard.tsx
// Vista principal del dashboard con grid de media items

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Film, Tv, Loader2, LogOut, MessageCircle, Book, Gamepad2, BookOpen, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGuest } from '../../contexts/GuestContext';
import { mediaApi } from '../../lib/supabase/api';
import { MediaItem } from '../../lib/supabase/types';
import MediaCard from './MediaCard';
import AddMediaModal from './AddMediaModal';
import GuestWarningBanner from './GuestWarningBanner';

type FilterType = 'all' | 'movie' | 'series' | 'book' | 'videogame' | 'comic' | 'reviews' | 'pending-movies' | 'pending-series' | 'pending-books' | 'pending-videogames' | 'pending-comics';

export default function Dashboard() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const { user, signOut } = useAuth();
  const { isGuest, guestData } = useGuest();
  const navigate = useNavigate();

  useEffect(() => {
    loadMediaItems();
  }, [isGuest, guestData]);

  useEffect(() => {
    applyFilter();
  }, [filter, mediaItems]);

  const loadMediaItems = async () => {
    setLoading(true);
    
    if (isGuest) {
      // Modo invitado: usar datos de localStorage
      setMediaItems(guestData);
      setLoading(false);
    } else {
      // Usuario autenticado: cargar de Supabase
      const { data, error } = await mediaApi.getMediaItems();
      if (error) {
        console.error('Error al cargar items:', error);
      } else if (data) {
        setMediaItems(data);
      }
      setLoading(false);
    }
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
    if (isGuest) {
      navigate('/');
    } else {
      await signOut();
      navigate('/');
    }
  };

  const handleMediaClick = (id: string) => {
    navigate(`/media/${id}`);
  };

  const handleAddSuccess = () => {
    loadMediaItems();
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Guest Warning Banner */}
      {isGuest && <GuestWarningBanner />}
      
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-950"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-neutral-400/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-600/3 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-black/80 border-b border-neutral-800/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 sm:p-2.5 rounded-xl shadow-2xl shadow-amber-500/20">
                  <Film className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-200 via-amber-300 to-neutral-200 bg-clip-text text-transparent">
                  Media Tracker
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 hidden sm:block">
                  {isGuest ? (
                    <span>Modo <span className="text-amber-400 font-semibold">Invitado</span> 👋</span>
                  ) : (
                    <span>Hey <span className="text-amber-400 font-semibold">{user?.email?.split('@')[0]}</span> 👋</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isGuest && (
                <button
                  onClick={() => navigate('/')}
                  className="p-2 sm:px-4 sm:py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl transition-all duration-200 flex items-center gap-2"
                  title="Volver al inicio"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium text-sm">Inicio</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl transition-all duration-200 text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">{isGuest ? 'Salir' : 'Cerrar Sesión'}</span>
              </button>
            </div>
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
                className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/30'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <span>Todo</span>
              </button>
              <button
                onClick={() => setFilter('movie')}
                className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                  filter === 'movie'
                    ? 'bg-neutral-100 text-black shadow-lg shadow-neutral-100/20'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Películas</span>
              </button>
              <button
                onClick={() => setFilter('series')}
                className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                  filter === 'series'
                    ? 'bg-neutral-200 text-black shadow-lg shadow-neutral-200/20'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>Series</span>
              </button>
              <button
                onClick={() => setFilter('book')}
                className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                  filter === 'book'
                    ? 'bg-neutral-300 text-black shadow-lg shadow-neutral-300/20'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <Book className="w-4 h-4" />
                <span>Libros</span>
              </button>
              <button
                onClick={() => setFilter('videogame')}
                className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                  filter === 'videogame'
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span className="hidden sm:inline">Videojuegos</span>
                <span className="sm:hidden">Games</span>
              </button>
              <button
                onClick={() => setFilter('comic')}
                className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                  filter === 'comic'
                    ? 'bg-neutral-400 text-black shadow-lg shadow-neutral-400/20'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Comics</span>
              </button>
              <button
                onClick={() => setFilter('reviews')}
                className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                  filter === 'reviews'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Mis Opiniones</span>
                <span className="sm:hidden">Opiniones</span>
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center space-x-2 px-5 sm:px-7 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl transition-all duration-200 text-sm sm:text-base shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
            >
              <Plus className="w-5 h-5" />
              <span>Añadir</span>
            </button>
          </div>

          {/* Segunda fila: Pendientes */}
          <div className="bg-neutral-950 rounded-2xl p-3 sm:p-4 border border-neutral-800">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="text-xs sm:text-sm text-amber-400 font-bold px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
                ⏳ Pendientes
              </span>
              <button
                onClick={() => setFilter('pending-movies')}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                  filter === 'pending-movies'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <Film className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Películas</span>
              </button>
              <button
                onClick={() => setFilter('pending-series')}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                  filter === 'pending-series'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <Tv className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Series</span>
              </button>
              <button
                onClick={() => setFilter('pending-books')}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                  filter === 'pending-books'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <Book className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Libros</span>
              </button>
              <button
                onClick={() => setFilter('pending-videogames')}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                  filter === 'pending-videogames'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Videojuegos</span>
                <span className="sm:hidden">Games</span>
              </button>
              <button
                onClick={() => setFilter('pending-comics')}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                  filter === 'pending-comics'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Comics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-gradient-to-r from-amber-500 to-amber-600 opacity-20"></div>
              <Loader2 className="relative w-12 h-12 text-amber-400 animate-spin" />
            </div>
            <p className="mt-6 text-neutral-400 font-medium">Cargando tu contenido...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-neutral-950 rounded-3xl border border-neutral-800 text-center py-24 px-6">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-full blur-xl"></div>
              <div className="relative bg-neutral-900 rounded-full p-4">
                {filter === 'movie' || filter === 'pending-movies' ? (
                  <Film className="w-8 h-8 text-neutral-400" />
                ) : filter === 'series' || filter === 'pending-series' ? (
                  <Tv className="w-8 h-8 text-neutral-400" />
                ) : filter === 'book' || filter === 'pending-books' ? (
                  <Book className="w-8 h-8 text-neutral-400" />
                ) : filter === 'videogame' || filter === 'pending-videogames' ? (
                  <Gamepad2 className="w-8 h-8 text-neutral-400" />
                ) : filter === 'comic' || filter === 'pending-comics' ? (
                  <BookOpen className="w-8 h-8 text-neutral-400" />
                ) : filter === 'reviews' ? (
                  <MessageCircle className="w-8 h-8 text-neutral-400" />
                ) : (
                  <Film className="w-8 h-8 text-neutral-400" />
                )}
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent mb-3">
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
            <p className="text-neutral-400 text-sm sm:text-base mb-8">
              {filter === 'reviews' 
                ? 'Marca contenido como completado y añade tu opinión para verlo aquí 📝'
                : filter.includes('pending')
                ? 'Añade contenido con estado "Por ver" para verlo aquí 👀'
                : `Comienza añadiendo tu primer ${filter === 'series' ? 'serie' : filter === 'book' ? 'libro' : filter === 'videogame' ? 'videojuego' : filter === 'comic' ? 'comic' : 'contenido'} ✨`
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
            >
              <Plus className="w-5 h-5" />
              <span>Añadir ahora</span>
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
