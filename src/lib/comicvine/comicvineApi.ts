// src/lib/comicvine/comicvineApi.ts
// Cliente para la API de ComicVine
// Documentación: https://comicvine.gamespot.com/api/documentation

interface ComicVineVolume {
  id: number;
  name: string;
  description?: string;
  image?: {
    icon_url: string;
    medium_url: string;
    screen_url: string;
    small_url: string;
    super_url: string;
    thumb_url: string;
    tiny_url: string;
  };
  start_year?: string;
  publisher?: {
    id: number;
    name: string;
  };
  count_of_issues?: number;
  api_detail_url?: string;
}

interface ComicVineResponse {
  error: string;
  limit: number;
  offset: number;
  number_of_page_results: number;
  number_of_total_results: number;
  status_code: number;
  results: ComicVineVolume[];
}

export interface ComicSearchResult {
  id: number;
  name: string;
  description?: string;
  coverUrl?: string;
  startYear?: string;
  publisher?: string;
  issueCount?: number;
}

const COMICVINE_API_KEY = import.meta.env.VITE_COMICVINE_API_KEY;
const COMICVINE_API_URL = 'https://comicvine.gamespot.com/api';

/**
 * Realiza una petición a la API de ComicVine
 */
const comicvineFetch = async (endpoint: string, params: Record<string, string> = {}): Promise<any> => {
  if (!COMICVINE_API_KEY) {
    throw new Error('ComicVine API Key no configurada. Añade VITE_COMICVINE_API_KEY en .env');
  }

  const url = new URL(`${COMICVINE_API_URL}${endpoint}`);
  url.searchParams.append('api_key', COMICVINE_API_KEY);
  url.searchParams.append('format', 'json');
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`ComicVine API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error !== 'OK') {
    throw new Error(`ComicVine API error: ${data.error}`);
  }

  return data;
};

/**
 * Limpia el HTML de las descripciones
 */
const cleanHtml = (html?: string): string | undefined => {
  if (!html) return undefined;
  
  // Remueve etiquetas HTML básicas
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
};

/**
 * Busca cómics/volúmenes por nombre
 */
export const searchComics = async (query: string, limit: number = 10): Promise<ComicSearchResult[]> => {
  const response: ComicVineResponse = await comicvineFetch('/volumes/', {
    filter: `name:${query}`,
    limit: limit.toString(),
    field_list: 'id,name,description,image,start_year,publisher,count_of_issues',
  });

  return response.results.map((volume) => ({
    id: volume.id,
    name: volume.name,
    description: cleanHtml(volume.description),
    coverUrl: volume.image?.medium_url,
    startYear: volume.start_year,
    publisher: volume.publisher?.name,
    issueCount: volume.count_of_issues,
  }));
};

/**
 * Obtiene detalles de un cómic por ID
 */
export const getComicDetails = async (volumeId: number): Promise<ComicSearchResult | null> => {
  try {
    const response: ComicVineResponse = await comicvineFetch(`/volume/4050-${volumeId}/`, {
      field_list: 'id,name,description,image,start_year,publisher,count_of_issues',
    });

    if (!response.results) return null;

    const volume = response.results as any; // ComicVine retorna un objeto, no array para detalles

    return {
      id: volume.id,
      name: volume.name,
      description: cleanHtml(volume.description),
      coverUrl: volume.image?.medium_url,
      startYear: volume.start_year,
      publisher: volume.publisher?.name,
      issueCount: volume.count_of_issues,
    };
  } catch (error) {
    console.error('Error obteniendo detalles del cómic:', error);
    return null;
  }
};

/**
 * Busca issues (números) de un volumen específico
 */
export const searchIssues = async (query: string, limit: number = 10): Promise<ComicSearchResult[]> => {
  const response: ComicVineResponse = await comicvineFetch('/issues/', {
    filter: `name:${query}`,
    limit: limit.toString(),
    field_list: 'id,name,description,image,cover_date,volume',
  });

  return response.results.map((issue: any) => ({
    id: issue.id,
    name: issue.name || `Issue #${issue.issue_number || '?'}`,
    description: cleanHtml(issue.description),
    coverUrl: issue.image?.medium_url,
    startYear: issue.cover_date ? issue.cover_date.split('-')[0] : undefined,
    publisher: issue.volume?.name,
    issueCount: 1,
  }));
};

/**
 * Obtiene cómics populares (más recientes con portada)
 */
export const getPopularComics = async (limit: number = 20): Promise<ComicSearchResult[]> => {
  const response: ComicVineResponse = await comicvineFetch('/volumes/', {
    sort: 'date_last_updated:desc',
    limit: limit.toString(),
    field_list: 'id,name,description,image,start_year,publisher,count_of_issues',
    filter: 'count_of_issues:1|999999', // Solo volúmenes con al menos 1 issue
  });

  return response.results
    .filter((volume) => volume.image) // Solo con imagen
    .map((volume) => ({
      id: volume.id,
      name: volume.name,
      description: cleanHtml(volume.description),
      coverUrl: volume.image?.medium_url,
      startYear: volume.start_year,
      publisher: volume.publisher?.name,
      issueCount: volume.count_of_issues,
    }));
};

/**
 * Verifica si la API de ComicVine está configurada
 */
export const isComicVineConfigured = (): boolean => {
  return !!(COMICVINE_API_KEY && COMICVINE_API_KEY !== 'your_comicvine_api_key_here');
};
