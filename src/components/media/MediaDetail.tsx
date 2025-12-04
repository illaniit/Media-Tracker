// src/components/media/MediaDetail.tsx
// Vista de detalle para un item de media (película o serie)

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Save, X, Film, Tv, Star, Calendar, Globe } from 'lucide-react';
import { mediaApi } from '../../lib/supabase/api';
import { MediaItem, MediaStatus } from '../../lib/supabase/types';
import SeasonList from './SeasonList';

export default function MediaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Estados del formulario de edición
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState<MediaStatus>('plan_to_watch');
  const [editRating, setEditRating] = useState<number | undefined>();
  const [editPosterUrl, setEditPosterUrl] = useState('');

  useEffect(() => {
    if (id) {
      loadMediaItem();
    }
  }, [id]);

  const loadMediaItem = async () => {
    if (!id) return;

    setLoading(true);
    const { data, error } = await mediaApi.getMediaItemById(id);

    if (error || !data) {
      console.error('Error al cargar item:', error);
      navigate('/dashboard');
    } else {
      setItem(data);
      setEditTitle(data.title);
      setEditStatus(data.status);
      setEditRating(data.rating);
      setEditPosterUrl(data.poster_url || '');
    }
    setLoading(false);
  };

  const handleSaveEdit = async () => {
    if (!id) return;

    const { error } = await mediaApi.updateMediaItem(id, {
      title: editTitle,
      status: editStatus,
      rating: editRating && editRating > 0 ? editRating : undefined,
      poster_url: editPosterUrl || undefined,
    });

    if (error) {
      alert('Error al actualizar: ' + error.message);
    } else {
      setEditing(false);
      loadMediaItem();
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('¿Estás seguro de que quieres eliminar este item?')) return;

    setDeleting(true);
    const { error } = await mediaApi.deleteMediaItem(id);

    if (error) {
      alert('Error al eliminar: ' + error.message);
      setDeleting(false);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSeasonUpdate = () => {
    loadMediaItem();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Cargando...</div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Backdrop si está disponible */}
      {item.backdrop_url && !editing && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={item.backdrop_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
        </div>
      )}

      {/* Header */}
      <div className={`${item.backdrop_url && !editing ? 'absolute top-0 left-0 right-0 z-10' : ''} bg-slate-800/90 backdrop-blur-sm border-b border-slate-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-slate-400 hover:text-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al dashboard</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${item.backdrop_url && !editing ? '-mt-48 relative z-10' : 'py-8'}`}>
        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-2xl">
          <div className="md:flex">
            {/* Poster */}
            <div className="md:w-1/3 bg-slate-700 flex-shrink-0">
              {item.poster_url ? (
                <img
                  src={item.poster_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full aspect-[2/3] flex items-center justify-center">
                  {item.type === 'movie' ? (
                    <Film className="w-24 h-24 text-slate-600" />
                  ) : (
                    <Tv className="w-24 h-24 text-slate-600" />
                  )}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="md:w-2/3 p-6 space-y-6">
              {editing ? (
                <>
                  {/* Formulario de edición */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Estado
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as MediaStatus)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="plan_to_watch">Por ver</option>
                      <option value="watching">Viendo</option>
                      <option value="completed">Completado</option>
                      <option value="dropped">Abandonado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tu calificación (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editRating || ''}
                      onChange={(e) => setEditRating(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      URL del poster
                    </label>
                    <input
                      type="url"
                      value={editPosterUrl}
                      onChange={(e) => setEditPosterUrl(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar</span>
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancelar</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Vista normal */}
                  <div>
                    <h1 className="text-3xl font-bold text-slate-100 mb-3">{item.title}</h1>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-md text-sm font-medium flex items-center gap-2">
                        {item.type === 'movie' ? <Film className="w-4 h-4" /> : <Tv className="w-4 h-4" />}
                        {item.type === 'movie' ? 'Película' : 'Serie'}
                      </span>
                      
                      <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                        item.status === 'watching' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        item.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        item.status === 'plan_to_watch' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {item.status === 'watching' ? 'Viendo' :
                         item.status === 'completed' ? 'Completado' :
                         item.status === 'plan_to_watch' ? 'Por ver' : 'Abandonado'}
                      </span>

                      {item.release_date && (
                        <span className="px-3 py-1 bg-slate-700/50 text-slate-400 rounded-md text-sm flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(item.release_date).getFullYear()}
                        </span>
                      )}

                      {item.original_language && (
                        <span className="px-3 py-1 bg-slate-700/50 text-slate-400 rounded-md text-sm flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {item.original_language.toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Genres */}
                    {item.genres && item.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.genres.map((genre) => (
                          <span
                            key={genre}
                            className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-sm"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ratings */}
                  <div className="grid grid-cols-2 gap-4">
                    {item.vote_average && item.vote_average > 0 && (
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>TMDB</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-100">
                          {item.vote_average.toFixed(1)}<span className="text-lg text-slate-400">/10</span>
                        </div>
                      </div>
                    )}
                    
                    {item.rating && (
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                          <Star className="w-4 h-4 text-blue-500" />
                          <span>Tu calificación</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-100">
                          {item.rating}<span className="text-lg text-slate-400">/10</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Overview */}
                  {item.overview && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Sinopsis</h3>
                      <p className="text-slate-300 leading-relaxed">{item.overview}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{deleting ? 'Eliminando...' : 'Eliminar'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Series Seasons */}
          {item.type === 'series' && !editing && (
            <div className="border-t border-slate-700 p-6">
              <h2 className="text-xl font-bold text-slate-100 mb-4">Temporadas</h2>
              <SeasonList
                seasons={item.seasons || []}
                onUpdate={handleSeasonUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
