// src/components/dashboard/MediaCard.tsx
// Tarjeta individual para mostrar un item de media

import { Star, Film, Tv, MessageCircle, Book, Gamepad2, BookOpen } from 'lucide-react';
import { MediaItem } from '../../lib/supabase/types';

interface MediaCardProps {
  item: MediaItem;
  onClick: () => void;
}

const statusColors = {
  watching: 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-300',
  completed: 'from-neutral-400/20 to-neutral-500/20 border-neutral-400/30 text-neutral-300',
  plan_to_watch: 'from-amber-400/20 to-yellow-500/20 border-amber-400/30 text-amber-300',
  dropped: 'from-neutral-600/20 to-neutral-700/20 border-neutral-600/30 text-neutral-400',
};

const statusLabels = {
  watching: 'Viendo',
  completed: 'Completado',
  plan_to_watch: 'Por ver',
  dropped: 'Abandonado',
};

const typeGradients = {
  movie: 'from-neutral-100 to-neutral-300',
  series: 'from-neutral-200 to-neutral-400',
  book: 'from-neutral-300 to-neutral-500',
  videogame: 'from-amber-400 to-amber-500',
  comic: 'from-neutral-400 to-neutral-600',
};

export default function MediaCard({ item, onClick }: MediaCardProps) {
  // Usar poster de TMDB si está disponible, sino el poster_url manual
  const posterImage = item.poster_url;
  
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* Glow effect on hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${typeGradients[item.type]} rounded-2xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-300`}></div>
      
      <div className="relative bg-neutral-950 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] flex flex-col h-full border border-neutral-800 hover:border-neutral-700">
        {/* Poster */}
        <div className="relative aspect-[2/3] bg-gradient-to-br from-neutral-900 via-black to-neutral-950 overflow-hidden">
          {posterImage ? (
            <>
              <img
                src={posterImage}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300`}></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${typeGradients[item.type]} opacity-5`}></div>
              {item.type === 'movie' ? (
                <Film className="w-16 h-16 sm:w-20 sm:h-20 text-neutral-700 relative z-10" />
              ) : item.type === 'series' ? (
                <Tv className="w-16 h-16 sm:w-20 sm:h-20 text-neutral-700 relative z-10" />
              ) : item.type === 'book' ? (
                <Book className="w-16 h-16 sm:w-20 sm:h-20 text-neutral-700 relative z-10" />
              ) : item.type === 'videogame' ? (
                <Gamepad2 className="w-16 h-16 sm:w-20 sm:h-20 text-amber-600 relative z-10" />
              ) : (
                <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-neutral-700 relative z-10" />
              )}
            </div>
          )}

          {/* Type Badge with gradient */}
          <div className={`absolute top-2 right-2 bg-black/60 backdrop-blur-xl rounded-lg px-2 py-1.5 border border-neutral-700 group-hover:scale-105 transition-transform duration-200`}>
            {item.type === 'movie' ? (
              <Film className="w-4 h-4 text-neutral-300" />
            ) : item.type === 'series' ? (
              <Tv className="w-4 h-4 text-neutral-300" />
            ) : item.type === 'book' ? (
              <Book className="w-4 h-4 text-neutral-300" />
            ) : item.type === 'videogame' ? (
              <Gamepad2 className="w-4 h-4 text-amber-400" />
            ) : (
              <BookOpen className="w-4 h-4 text-neutral-300" />
            )}
          </div>

          {/* TMDB Rating Badge */}
          {item.vote_average && item.vote_average > 0 && (
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xl rounded-lg px-2 py-1.5 border border-amber-500/40 flex items-center gap-1 group-hover:scale-105 transition-transform duration-200">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-amber-400">
                {item.vote_average.toFixed(1)}
              </span>
            </div>
          )}
          
          {/* User Rating Badge */}
          {item.rating && (
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xl rounded-lg px-2 py-1.5 border border-neutral-600 flex items-center gap-1 group-hover:scale-105 transition-transform duration-200">
              <Star className="w-3 h-3 text-neutral-300 fill-neutral-300" />
              <span className="text-xs font-bold text-neutral-300">{item.rating}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 space-y-2.5 flex-1 flex flex-col">
          <h3 className={`font-bold text-sm sm:text-base text-neutral-200 group-hover:text-white transition-colors duration-300 line-clamp-2`}>
            {item.title}
          </h3>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Status Badge with gradient */}
            <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold bg-gradient-to-r ${statusColors[item.status]}`}>
              {statusLabels[item.status]}
            </span>

            {/* Release date */}
            {item.release_date && (
              <div className="text-xs text-neutral-500 font-medium">
                {new Date(item.release_date!).getFullYear()}
              </div>
            )}
          </div>

          {/* Progress for series */}
          {item.type === 'series' && item.seasons && item.seasons.length > 0 && (
            <div className="text-xs text-neutral-400 font-medium flex items-center gap-1">
              <Tv className="w-3 h-3" />
              {item.seasons.length} temporada{item.seasons.length !== 1 ? 's' : ''}
            </div>
          )}

          {/* Genres */}
          {item.genres && item.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="text-xs px-2.5 py-1 bg-neutral-900 rounded-lg text-neutral-400 font-medium border border-neutral-800"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Opinión Personal (solo si está completado) */}
          {item.status === 'completed' && item.review && (
            <div className="mt-auto pt-3 border-t border-neutral-800">
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-400 line-clamp-2 italic leading-relaxed">
                  "{item.review}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
