// src/lib/tmdb/tmdbApi.ts
// Cliente y funciones para la API de TMDB (The Movie Database)

import { 
  TMDBMovie, 
  TMDBTVShow, 
  TMDBSearchResult, 
  TMDBMovieDetails, 
  TMDBTVShowDetails 
} from '../supabase/types';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Tamaños de imagen disponibles
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
};

/**
 * Construye la URL completa de una imagen de TMDB
 */
export const getImageUrl = (
  path: string | null, 
  type: 'poster' | 'backdrop' = 'poster', 
  size: 'small' | 'medium' | 'large' | 'original' = 'medium'
): string | null => {
  if (!path) return null;
  const sizeStr = IMAGE_SIZES[type][size];
  return `${TMDB_IMAGE_BASE_URL}/${sizeStr}${path}`;
};

/**
 * Realiza una petición a la API de TMDB
 */
const tmdbFetch = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API Key no está configurada. Añade VITE_TMDB_API_KEY en tu archivo .env');
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  url.searchParams.append('language', 'es-ES'); // Español
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Busca películas por título
 */
export const searchMovies = async (query: string, page: number = 1): Promise<TMDBSearchResult> => {
  return tmdbFetch<TMDBSearchResult>('/search/movie', { 
    query,
    page: page.toString() 
  });
};

/**
 * Busca series de TV por título
 */
export const searchTVShows = async (query: string, page: number = 1): Promise<TMDBSearchResult> => {
  return tmdbFetch<TMDBSearchResult>('/search/tv', { 
    query,
    page: page.toString() 
  });
};

/**
 * Busca tanto películas como series
 */
export const searchMulti = async (query: string, page: number = 1): Promise<TMDBSearchResult> => {
  return tmdbFetch<TMDBSearchResult>('/search/multi', { 
    query,
    page: page.toString() 
  });
};

/**
 * Obtiene los detalles completos de una película
 */
export const getMovieDetails = async (movieId: number): Promise<TMDBMovieDetails> => {
  return tmdbFetch<TMDBMovieDetails>(`/movie/${movieId}`);
};

/**
 * Obtiene los detalles completos de una serie de TV
 */
export const getTVShowDetails = async (tvId: number): Promise<TMDBTVShowDetails> => {
  return tmdbFetch<TMDBTVShowDetails>(`/tv/${tvId}`);
};

/**
 * Obtiene películas populares
 */
export const getPopularMovies = async (page: number = 1): Promise<TMDBSearchResult> => {
  return tmdbFetch<TMDBSearchResult>('/movie/popular', { 
    page: page.toString() 
  });
};

/**
 * Obtiene series populares
 */
export const getPopularTVShows = async (page: number = 1): Promise<TMDBSearchResult> => {
  return tmdbFetch<TMDBSearchResult>('/tv/popular', { 
    page: page.toString() 
  });
};

/**
 * Determina si un resultado es una película
 */
export const isMovie = (item: any): item is TMDBMovie => {
  return 'title' in item && !('name' in item);
};

/**
 * Determina si un resultado es una serie de TV
 */
export const isTVShow = (item: any): item is TMDBTVShow => {
  return 'name' in item && !('title' in item);
};

/**
 * Obtiene el título del item (funciona para películas y series)
 */
export const getTitle = (item: TMDBMovie | TMDBTVShow): string => {
  return isMovie(item) ? item.title : item.name;
};

/**
 * Obtiene la fecha de lanzamiento (funciona para películas y series)
 */
export const getReleaseDate = (item: TMDBMovie | TMDBTVShow): string => {
  return isMovie(item) ? item.release_date : item.first_air_date;
};

/**
 * Formatea la fecha al formato español
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Fecha desconocida';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Verifica si la API de TMDB está configurada
 */
export const isTMDBConfigured = (): boolean => {
  return !!TMDB_API_KEY && TMDB_API_KEY !== 'your_tmdb_api_key_here';
};
