// src/components/dashboard/Dashboard.tsx
// Vista principal del dashboard con grid de media items

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Film, Tv, Loader2, LogOut, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mediaApi } from '../../lib/supabase/api';
import { MediaItem } from '../../lib/supabase/types';
import MediaCard from './MediaCard';
import AddMediaModal from './AddMediaModal';

type FilterType = 'all' | 'movie' | 'series' | 'reviews';

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
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
                <Film className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-100">Media Tracker</h1>
                <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">Bienvenido, {user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Filters and Add Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition text-sm sm:text-base ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todo
            </button>
            <button
              onClick={() => setFilter('movie')}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition text-sm sm:text-base ${
                filter === 'movie'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Películas</span>
            </button>
            <button
              onClick={() => setFilter('series')}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition text-sm sm:text-base ${
                filter === 'series'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Series</span>
            </button>
            <button
              onClick={() => setFilter('reviews')}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition text-sm sm:text-base ${
                filter === 'reviews'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Mis Opiniones</span>
              <span className="sm:hidden">Opiniones</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition text-sm sm:text-base"
          >
            <Plus className="w-5 h-5" />
            <span>Añadir</span>
          </button>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
              {filter === 'movie' ? (
                <Film className="w-8 h-8 text-slate-400" />
              ) : filter === 'series' ? (
                <Tv className="w-8 h-8 text-slate-400" />
              ) : (
                <Film className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <h3 className="text-xl font-medium text-slate-300 mb-2">
              No hay {filter === 'all' ? 'contenido' : filter === 'movie' ? 'películas' : filter === 'series' ? 'series' : 'opiniones'}
            </h3>
            <p className="text-slate-400 mb-6">
              {filter === 'reviews' 
                ? 'Marca contenido como completado y añade tu opinión para verlo aquí'
                : `Comienza añadiendo tu primera ${filter === 'series' ? 'serie' : 'película'}`
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              <span>Añadir ahora</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
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
