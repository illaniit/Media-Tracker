// src/components/dashboard/MediaCard.tsx
// Tarjeta individual para mostrar un item de media

import { Star, Film, Tv, MessageCircle, Book, Gamepad2, BookOpen } from 'lucide-react';
import { MediaItem } from '../../lib/supabase/types';

interface MediaCardProps {
  item: MediaItem;
  onClick: () => void;
}

const statusColors = {
  watching: 'bg-green-500/10 text-green-400 border-green-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  plan_to_watch: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  dropped: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const statusLabels = {
  watching: 'Viendo',
  completed: 'Completado',
  plan_to_watch: 'Por ver',
  dropped: 'Abandonado',
};

export default function MediaCard({ item, onClick }: MediaCardProps) {
  // Usar poster de TMDB si está disponible, sino el poster_url manual
  const posterImage = item.poster_url;
  
  return (
    <div
      onClick={onClick}
      className="bg-slate-800 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 group flex flex-col h-full"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-gradient-to-br from-slate-700 to-slate-800">
        {posterImage ? (
          <img
            src={posterImage}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {item.type === 'movie' ? (
              <Film className="w-16 h-16 text-slate-600" />
            ) : item.type === 'series' ? (
              <Tv className="w-16 h-16 text-slate-600" />
            ) : item.type === 'book' ? (
              <Book className="w-16 h-16 text-slate-600" />
            ) : item.type === 'videogame' ? (
              <Gamepad2 className="w-16 h-16 text-slate-600" />
            ) : (
              <BookOpen className="w-16 h-16 text-slate-600" />
            )}
          </div>
        )}

        {/* Overlay con tipo */}
        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-md">
          {item.type === 'movie' ? (
            <Film className="w-4 h-4 text-slate-300" />
          ) : item.type === 'series' ? (
            <Tv className="w-4 h-4 text-slate-300" />
          ) : item.type === 'book' ? (
            <Book className="w-4 h-4 text-slate-300" />
          ) : item.type === 'videogame' ? (
            <Gamepad2 className="w-4 h-4 text-slate-300" />
          ) : (
            <BookOpen className="w-4 h-4 text-slate-300" />
          )}
        </div>

        {/* TMDB Rating Badge */}
        {item.vote_average && item.vote_average > 0 && (
          <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold text-slate-100">
              {item.vote_average.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm sm:text-base text-slate-100 line-clamp-2 group-hover:text-blue-400 transition">
          {item.title}
        </h3>

        {/* Release date */}
        {item.release_date && (
          <div className="text-xs text-slate-500">
            {new Date(item.release_date).getFullYear()}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Status Badge */}
          <span
            className={`text-xs px-2 py-1 rounded-md border font-medium whitespace-nowrap ${
              statusColors[item.status]
            }`}
          >
            {statusLabels[item.status]}
          </span>

          {/* User Rating */}
          {item.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 fill-blue-500" />
              <span className="text-xs sm:text-sm font-medium text-slate-300">
                {item.rating}/10
              </span>
            </div>
          )}
        </div>

        {/* Progress for series */}
        {item.type === 'series' && item.seasons && item.seasons.length > 0 && (
          <div className="text-xs text-slate-400">
            {item.seasons.length} temporada{item.seasons.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Genres */}
        {item.genres && item.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-xs px-2 py-0.5 bg-slate-700 text-slate-400 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Opinión Personal (solo si está completado) */}
        {item.status === 'completed' && item.review && (
          <div className="mt-2 pt-2 border-t border-slate-700">
            <div className="flex items-start gap-2 text-xs">
              <MessageCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-400 line-clamp-2 italic">
                "{item.review}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
