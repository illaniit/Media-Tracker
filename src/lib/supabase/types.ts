// src/lib/supabase/types.ts
// Tipos TypeScript para la base de datos

export type MediaType = 'movie' | 'series';
export type MediaStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped';

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  id: string;
  user_id: string;
  title: string;
  type: MediaType;
  status: MediaStatus;
  rating?: number;
  poster_url?: string;
  notes?: string;
  review?: string; // Opinión personal del usuario
  created_at: string;
  updated_at: string;
  seasons?: Season[];
  // Datos de TMDB
  tmdb_id?: number;
  backdrop_url?: string;
  overview?: string;
  release_date?: string;
  original_language?: string;
  vote_average?: number;
  genres?: string[];
}

export interface Season {
  id: string;
  media_id: string;
  season_number: number;
  episodes_watched: number;
  total_episodes: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SeriesProgress {
  id: string;
  user_id: string;
  title: string;
  status: MediaStatus;
  rating?: number;
  total_seasons: number;
  total_episodes_watched: number;
  total_episodes: number;
  progress_percentage: number;
  completed_seasons: number;
}

// Tipos para formularios
export interface CreateMediaItem {
  title: string;
  type: MediaType;
  status: MediaStatus;
  rating?: number;
  poster_url?: string;
  notes?: string;
  review?: string; // Opinión personal del usuario
  tmdb_id?: number;
  backdrop_url?: string;
  overview?: string;
  release_date?: string;
  original_language?: string;
  vote_average?: number;
  genres?: string[];
}

export interface CreateSeason {
  media_id: string;
  season_number: number;
  episodes_watched?: number;
  total_episodes: number;
}

export interface UpdateMediaItem {
  title?: string;
  status?: MediaStatus;
  rating?: number;
  poster_url?: string;
  notes?: string;
  review?: string; // Opinión personal del usuario
}

export interface UpdateSeason {
  episodes_watched?: number;
  total_episodes?: number;
}

// Tipos para TMDB API
export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
  genre_ids: number[];
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
  genre_ids: number[];
}

export interface TMDBSearchResult {
  page: number;
  results: (TMDBMovie | TMDBTVShow)[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  genres: TMDBGenre[];
  runtime: number;
  status: string;
}

export interface TMDBTVShowDetails extends TMDBTVShow {
  genres: TMDBGenre[];
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: TMDBSeason[];
  status: string;
}

export interface TMDBSeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}
