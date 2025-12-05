// src/components/dashboard/AddMediaModal.tsx
// Modal mejorado para añadir películas, series, libros, videojuegos y comics

import { useState } from 'react';
import { X, Plus, Trash2, Film, Tv, AlertCircle, Sparkles, Calendar, Loader2, Book, Gamepad2, BookOpen } from 'lucide-react';
import { mediaApi, seasonsApi } from '../../lib/supabase/api';
import { MediaType, MediaStatus } from '../../lib/supabase/types';

interface AddMediaModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface SeasonInput {
  season_number: number;
  total_episodes: number;
}

// Géneros predefinidos para selección rápida
const MOVIE_GENRES = [
  'Acción', 'Aventura', 'Animación', 'Biografía', 'Comedia', 
  'Crimen', 'Documental', 'Drama', 'Familia', 'Fantasía',
  'Historia', 'Horror', 'Musical', 'Misterio', 'Romance',
  'Ciencia Ficción', 'Thriller', 'Guerra', 'Western'
];

const TV_GENRES = [
  'Acción & Aventura', 'Animación', 'Comedia', 'Crimen',
  'Documental', 'Drama', 'Familia', 'Kids', 'Misterio',
  'Noticias', 'Reality', 'Sci-Fi & Fantasy', 'Soap',
  'Talk Show', 'Guerra & Política', 'Western'
];

const BOOK_GENRES = [
  'Ficción', 'No Ficción', 'Ciencia Ficción', 'Fantasía', 'Misterio',
  'Thriller', 'Romance', 'Horror', 'Histórica', 'Biografía',
  'Autoayuda', 'Poesía', 'Drama', 'Aventura', 'Juvenil'
];

const VIDEOGAME_GENRES = [
  'Acción', 'Aventura', 'RPG', 'Estrategia', 'Shooter', 
  'Deportes', 'Carreras', 'Simulación', 'Puzzle', 'Horror',
  'Plataformas', 'Fighting', 'MMORPG', 'Indie', 'Sandbox'
];

const COMIC_GENRES = [
  'Superhéroes', 'Manga', 'Ciencia Ficción', 'Fantasía', 'Horror',
  'Aventura', 'Humor', 'Drama', 'Acción', 'Romance',
  'Misterio', 'Slice of Life', 'Histórico', 'Thriller', 'Seinen'
];

export default function AddMediaModal({ onClose, onSuccess }: AddMediaModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>('movie');
  const [status, setStatus] = useState<MediaStatus>('plan_to_watch');
  const [rating, setRating] = useState<number | undefined>();
  const [posterUrl, setPosterUrl] = useState('');
  const [overview, setOverview] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [review, setReview] = useState(''); // Opinión personal
  const [seasons, setSeasons] = useState<SeasonInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentGenres = 
    type === 'movie' ? MOVIE_GENRES :
    type === 'series' ? TV_GENRES :
    type === 'book' ? BOOK_GENRES :
    type === 'videogame' ? VIDEOGAME_GENRES :
    type === 'comic' ? COMIC_GENRES : [];

  const handleAddSeason = () => {
    const nextSeasonNumber = seasons.length > 0 
      ? Math.max(...seasons.map(s => s.season_number)) + 1 
      : 1;
    setSeasons([...seasons, { season_number: nextSeasonNumber, total_episodes: 10 }]);
  };

  const handleRemoveSeason = (index: number) => {
    setSeasons(seasons.filter((_, i) => i !== index));
  };

  const handleSeasonChange = (index: number, field: keyof SeasonInput, value: number) => {
    const updated = [...seasons];
    updated[index] = { ...updated[index], [field]: value };
    setSeasons(updated);
  };

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (type === 'series' && seasons.length === 0) {
      setError('Una serie debe tener al menos una temporada');
      return;
    }

    setLoading(true);

    try {
      // Crear el media item
      const { data: mediaItem, error: mediaError } = await mediaApi.createMediaItem({
        title: title.trim(),
        type,
        status,
        rating: rating && rating > 0 ? rating : undefined,
        poster_url: posterUrl.trim() || undefined,
        overview: overview.trim() || undefined,
        release_date: releaseYear ? `${releaseYear}-01-01` : undefined,
        genres: selectedGenres.length > 0 ? selectedGenres : undefined,
        review: review.trim() || undefined,
      });

      if (mediaError || !mediaItem) {
        throw new Error(mediaError?.message || 'Error al crear el item');
      }

      // Si es una serie, crear las temporadas
      if (type === 'series' && seasons.length > 0) {
        const seasonsToCreate = seasons.map((s) => ({
          media_id: mediaItem.id,
          season_number: s.season_number,
          total_episodes: s.total_episodes,
        }));

        const { error: seasonsError } = await seasonsApi.createMultipleSeasons(seasonsToCreate);

        if (seasonsError) {
          throw new Error(seasonsError.message || 'Error al crear las temporadas');
        }
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error inesperado al guardar');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setPosterUrl('');
    setOverview('');
    setReleaseYear('');
    setSelectedGenres([]);
    setSeasons([]);
    setRating(undefined);
    setReview('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Añadir Contenido</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                ¿Qué quieres añadir? *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setType('movie');
                    resetForm();
                  }}
                  className={`px-3 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                    type === 'movie'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Film className="w-5 h-5" />
                  <span className="hidden sm:inline">Película</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('series');
                    resetForm();
                  }}
                  className={`px-3 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                    type === 'series'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Tv className="w-5 h-5" />
                  <span className="hidden sm:inline">Serie</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('book');
                    resetForm();
                  }}
                  className={`px-3 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                    type === 'book'
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Book className="w-5 h-5" />
                  <span className="hidden sm:inline">Libro</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('videogame');
                    resetForm();
                  }}
                  className={`px-3 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                    type === 'videogame'
                      ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Gamepad2 className="w-5 h-5" />
                  <span className="hidden sm:inline">Videojuego</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('comic');
                    resetForm();
                  }}
                  className={`px-3 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                    type === 'comic'
                      ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg shadow-pink-500/30'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="hidden sm:inline">Comic</span>
                </button>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                Información Básica
              </h3>

              <div className="space-y-4">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder={type === 'movie' ? 'Ej: Inception' : 'Ej: Breaking Bad'}
                    required
                    autoFocus
                  />
                </div>

                {/* Año y Estado en grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Año de Lanzamiento
                    </label>
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 5}
                      value={releaseYear}
                      onChange={(e) => setReleaseYear(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="Ej: 2023"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Estado
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as MediaStatus)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="plan_to_watch">📋 Por ver</option>
                      <option value="watching">▶️ Viendo</option>
                      <option value="completed">✅ Completado</option>
                      <option value="dropped">❌ Abandonado</option>
                    </select>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tu Calificación (1-10)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={rating || 5}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <div className="w-20 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-center">
                      <span className="text-2xl font-bold text-blue-400">
                        {rating || 5}
                      </span>
                      <span className="text-xs text-slate-400">/10</span>
                    </div>
                  </div>
                </div>

                {/* Opinión Personal (solo si está completado) */}
                {status === 'completed' && (
                  <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-4">
                    <label className="block text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Tu Opinión Personal
                    </label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                      placeholder="¿Qué te pareció? Escribe tu opinión sobre esta película o serie..."
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Esta opinión se mostrará en tus contenidos completados
                    </p>
                  </div>
                )}

                {/* Sinopsis */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Sinopsis (opcional)
                  </label>
                  <textarea
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    placeholder="Breve descripción de la trama..."
                  />
                </div>

                {/* Poster URL */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    URL del Poster (opcional)
                  </label>
                  <input
                    type="url"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="https://ejemplo.com/poster.jpg"
                  />
                  {posterUrl && (
                    <div className="mt-3">
                      <img
                        src={posterUrl}
                        alt="Preview"
                        className="w-32 h-48 object-cover rounded-lg border border-slate-600"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Géneros */}
            <div className="border-t border-slate-700 pt-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Géneros (selecciona los que apliquen)
              </label>
              <div className="flex flex-wrap gap-2">
                {currentGenres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      selectedGenres.includes(genre)
                        ? 'bg-blue-600 text-white border-2 border-blue-400'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-transparent'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Temporadas (solo para series) */}
            {type === 'series' && (
              <div className="border-t border-slate-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-slate-300">
                    Temporadas * {seasons.length > 0 && `(${seasons.length})`}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSeason}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Temporada</span>
                  </button>
                </div>

                {seasons.length === 0 ? (
                  <div className="bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                    <Tv className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">
                      No hay temporadas. Haz clic en "Añadir Temporada" para comenzar.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {seasons.map((season, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-slate-700 p-4 rounded-lg hover:bg-slate-600/50 transition"
                      >
                        <div className="flex-1">
                          <label className="block text-xs text-slate-400 mb-1">
                            Número de Temporada
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={season.season_number}
                            onChange={(e) =>
                              handleSeasonChange(index, 'season_number', parseInt(e.target.value))
                            }
                            className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-slate-400 mb-1">
                            Total de Episodios
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={season.total_episodes}
                            onChange={(e) =>
                              handleSeasonChange(index, 'total_episodes', parseInt(e.target.value))
                            }
                            className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSeason(index)}
                          className="mt-5 p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition"
                          title="Eliminar temporada"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 p-4 sm:p-6 border-t border-slate-700 bg-slate-800/50 flex-shrink-0">
            <p className="text-xs text-slate-500 text-center sm:text-left">
              Los campos marcados con * son obligatorios
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition font-medium text-sm sm:text-base"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Guardando...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
