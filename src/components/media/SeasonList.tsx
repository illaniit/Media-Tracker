// src/components/media/SeasonList.tsx
// Componente para mostrar y gestionar las temporadas de una serie

import { Plus, Minus, Check } from 'lucide-react';
import { useState } from 'react';
import { Season } from '../../lib/supabase/types';
import { seasonsApi } from '../../lib/supabase/api';

interface SeasonListProps {
  mediaId: string;
  seasons: Season[];
  onUpdate: () => void;
}

export default function SeasonList({ mediaId, seasons, onUpdate }: SeasonListProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleIncrement = async (seasonId: string) => {
    setUpdating(seasonId);
    await seasonsApi.incrementEpisodesWatched(seasonId);
    onUpdate();
    setUpdating(null);
  };

  const handleDecrement = async (seasonId: string) => {
    setUpdating(seasonId);
    await seasonsApi.decrementEpisodesWatched(seasonId);
    onUpdate();
    setUpdating(null);
  };

  if (seasons.length === 0) {
    return (
      <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 text-center">
        <p className="text-slate-400">No hay temporadas registradas</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {seasons
        .sort((a, b) => a.season_number - b.season_number)
        .map((season) => (
          <div
            key={season.id}
            className="bg-slate-700 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-slate-100">
                  Temporada {season.season_number}
                </h3>
                {season.is_completed && (
                  <span className="flex items-center space-x-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-md">
                    <Check className="w-3 h-3" />
                    <span>Completada</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {season.episodes_watched} / {season.total_episodes} episodios
              </p>
              
              {/* Progress bar */}
              <div className="mt-2 w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{
                    width: `${(season.episodes_watched / season.total_episodes) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => handleDecrement(season.id)}
                disabled={season.episodes_watched === 0 || updating === season.id}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-slate-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleIncrement(season.id)}
                disabled={season.is_completed || updating === season.id}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
