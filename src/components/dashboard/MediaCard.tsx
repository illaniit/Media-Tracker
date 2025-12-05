// src/components/dashboard/MediaCard.tsx
// Tarjeta individual para mostrar un item de media

import { Star, Film, Tv, MessageCircle, Book, Gamepad2, BookOpen } from 'lucide-react';
import { MediaItem } from '../../lib/supabase/types';

interface MediaCardProps {
  item: MediaItem;
  onClick: () => void;
}

const statusColors = {
  watching: 'from-green-500/30 to-emerald-500/30 border-green-400/30',
  completed: 'from-blue-500/30 to-cyan-500/30 border-blue-400/30',
  plan_to_watch: 'from-yellow-500/30 to-orange-500/30 border-yellow-400/30',
  dropped: 'from-red-500/30 to-rose-500/30 border-red-400/30',
};

const statusLabels = {
  watching: 'Viendo',
  completed: 'Completado',
  plan_to_watch: 'Por ver',
  dropped: 'Abandonado',
};

const typeGradients = {
  movie: 'from-blue-500 to-cyan-500',
  series: 'from-purple-500 to-pink-500',
  book: 'from-green-500 to-emerald-500',
  videogame: 'from-orange-500 to-red-500',
  comic: 'from-pink-500 to-rose-500',
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
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${typeGradients[item.type]} rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500`}></div>
      
      <div className="relative glass-dark rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] flex flex-col h-full border border-white/10 hover:border-white/20">
        {/* Poster */}
        <div className="relative aspect-[2/3] bg-gradient-to-br from-slate-800 via-slate-900 to-black overflow-hidden">
          {posterImage ? (
            <>
              <img
                src={posterImage}
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-t ${typeGradients[item.type]} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${typeGradients[item.type]} opacity-10`}></div>
              {item.type === 'movie' ? (
                <Film className="w-16 h-16 sm:w-20 sm:h-20 text-blue-400/50 relative z-10" />
              ) : item.type === 'series' ? (
                <Tv className="w-16 h-16 sm:w-20 sm:h-20 text-purple-400/50 relative z-10" />
              ) : item.type === 'book' ? (
                <Book className="w-16 h-16 sm:w-20 sm:h-20 text-green-400/50 relative z-10" />
              ) : item.type === 'videogame' ? (
                <Gamepad2 className="w-16 h-16 sm:w-20 sm:h-20 text-orange-400/50 relative z-10" />
              ) : (
                <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-pink-400/50 relative z-10" />
              )}
            </div>
          )}

          {/* Type Badge with gradient */}
          <div className={`absolute top-2 right-2 glass rounded-lg px-2 py-1.5 border border-white/20 backdrop-blur-xl group-hover:scale-110 transition-transform duration-300`}>
            {item.type === 'movie' ? (
              <Film className="w-4 h-4 text-blue-400" />
            ) : item.type === 'series' ? (
              <Tv className="w-4 h-4 text-purple-400" />
            ) : item.type === 'book' ? (
              <Book className="w-4 h-4 text-green-400" />
            ) : item.type === 'videogame' ? (
              <Gamepad2 className="w-4 h-4 text-orange-400" />
            ) : (
              <BookOpen className="w-4 h-4 text-pink-400" />
            )}
          </div>

          {/* TMDB Rating Badge */}
          {item.vote_average && item.vote_average > 0 && (
            <div className="absolute top-2 left-2 glass rounded-lg px-2 py-1.5 border border-yellow-500/30 backdrop-blur-xl flex items-center gap-1 group-hover:scale-110 transition-transform duration-300">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-yellow-400">
                {item.vote_average.toFixed(1)}
              </span>
            </div>
          )}
          
          {/* User Rating Badge */}
          {item.rating && (
            <div className="absolute bottom-2 left-2 glass rounded-lg px-2 py-1.5 border border-blue-500/30 backdrop-blur-xl flex items-center gap-1 group-hover:scale-110 transition-transform duration-300">
              <Star className="w-3 h-3 text-blue-400 fill-blue-400" />
              <span className="text-xs font-bold text-blue-400">{item.rating}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 space-y-2.5 flex-1 flex flex-col">
          <h3 className={`font-bold text-sm sm:text-base bg-gradient-to-r ${typeGradients[item.type]} bg-clip-text text-transparent group-hover:text-white group-hover:bg-none transition-all duration-300 line-clamp-2`}>
            {item.title}
          </h3>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Status Badge with gradient */}
            <span className={`relative overflow-hidden text-xs px-2.5 py-1 rounded-lg border font-semibold backdrop-blur-sm bg-gradient-to-r ${statusColors[item.status]}`}>
              {statusLabels[item.status]}
            </span>

            {/* Release date */}
            {item.release_date && (
              <div className="text-xs text-slate-500 font-medium">
                {new Date(item.release_date!).getFullYear()}
              </div>
            )}
          </div>

          {/* Progress for series */}
          {item.type === 'series' && item.seasons && item.seasons.length > 0 && (
            <div className="text-xs text-purple-400 font-medium flex items-center gap-1">
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
                  className="text-xs px-2.5 py-1 glass rounded-lg text-slate-300 font-medium border border-white/10"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Opinión Personal (solo si está completado) */}
          {item.status === 'completed' && item.review && (
            <div className="mt-auto pt-3 border-t border-white/10">
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 line-clamp-2 italic leading-relaxed">
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
