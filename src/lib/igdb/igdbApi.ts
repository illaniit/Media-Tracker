// src/lib/igdb/igdbApi.ts
// Cliente para la API de IGDB (Internet Game Database)
// Documentación: https://api-docs.igdb.com/

interface IGDBGame {
  id: number;
  name: string;
  summary?: string;
  cover?: {
    id: number;
    url: string;
    image_id: string;
  };
  first_release_date?: number; // Unix timestamp
  genres?: { id: number; name: string }[];
  rating?: number; // 0-100
  platforms?: { id: number; name: string }[];
  involved_companies?: { company: { name: string } }[];
}

export interface IGDBSearchResult {
  id: number;
  name: string;
  summary?: string;
  coverUrl?: string;
  releaseDate?: string;
  genres?: string[];
  rating?: number;
  platforms?: string[];
  developer?: string;
}

const IGDB_CLIENT_ID = import.meta.env.VITE_IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = import.meta.env.VITE_IGDB_CLIENT_SECRET;
const IGDB_API_URL = 'https://api.igdb.com/v4';

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * Obtiene un access token de Twitch OAuth
 * IMPORTANTE: En producción, esto debe hacerse en el backend
 */
const getAccessToken = async (): Promise<string> => {
  // Si ya tenemos un token válido, lo retornamos
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  if (!IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET) {
    throw new Error('IGDB credentials no configuradas. Añade VITE_IGDB_CLIENT_ID y VITE_IGDB_CLIENT_SECRET en .env');
  }

  try {
    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${IGDB_CLIENT_ID}&client_secret=${IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
      { method: 'POST' }
    );

    if (!response.ok) {
      throw new Error('Error al obtener access token de IGDB');
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minuto de margen

    return accessToken!;
  } catch (error) {
    console.error('Error obteniendo token de IGDB:', error);
    throw error;
  }
};

/**
 * Realiza una petición a la API de IGDB
 */
const igdbFetch = async (endpoint: string, body: string): Promise<any> => {
  const token = await getAccessToken();

  const response = await fetch(`${IGDB_API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': IGDB_CLIENT_ID!,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`IGDB API error: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Convierte un timestamp Unix a fecha ISO
 */
const timestampToDate = (timestamp?: number): string | undefined => {
  if (!timestamp) return undefined;
  return new Date(timestamp * 1000).toISOString().split('T')[0];
};

/**
 * Construye la URL de una imagen de IGDB
 */
export const getIGDBImageUrl = (imageId: string, size: 'thumb' | 'cover_small' | 'cover_big' | '1080p' = 'cover_big'): string => {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
};

/**
 * Busca videojuegos por nombre
 */
export const searchGames = async (query: string, limit: number = 10): Promise<IGDBSearchResult[]> => {
  const body = `
    search "${query}";
    fields name, summary, cover.url, cover.image_id, first_release_date, genres.name, rating, platforms.name, involved_companies.company.name, involved_companies.developer;
    limit ${limit};
    where version_parent = null;
  `;

  const games: IGDBGame[] = await igdbFetch('/games', body);

  return games.map((game) => ({
    id: game.id,
    name: game.name,
    summary: game.summary,
    coverUrl: game.cover?.image_id ? getIGDBImageUrl(game.cover.image_id) : undefined,
    releaseDate: timestampToDate(game.first_release_date),
    genres: game.genres?.map((g) => g.name),
    rating: game.rating ? Math.round(game.rating) / 10 : undefined, // Convertir de 0-100 a 0-10
    platforms: game.platforms?.map((p) => p.name),
    developer: game.involved_companies?.find((ic: any) => ic.developer)?.company.name,
  }));
};

/**
 * Obtiene detalles de un videojuego por ID
 */
export const getGameDetails = async (gameId: number): Promise<IGDBSearchResult | null> => {
  const body = `
    fields name, summary, cover.url, cover.image_id, first_release_date, genres.name, rating, platforms.name, involved_companies.company.name, involved_companies.developer;
    where id = ${gameId};
  `;

  const games: IGDBGame[] = await igdbFetch('/games', body);

  if (games.length === 0) return null;

  const game = games[0];
  return {
    id: game.id,
    name: game.name,
    summary: game.summary,
    coverUrl: game.cover?.image_id ? getIGDBImageUrl(game.cover.image_id) : undefined,
    releaseDate: timestampToDate(game.first_release_date),
    genres: game.genres?.map((g) => g.name),
    rating: game.rating ? Math.round(game.rating) / 10 : undefined,
    platforms: game.platforms?.map((p) => p.name),
    developer: game.involved_companies?.find((ic: any) => ic.developer)?.company.name,
  };
};

/**
 * Obtiene videojuegos populares
 */
export const getPopularGames = async (limit: number = 20): Promise<IGDBSearchResult[]> => {
  const body = `
    fields name, summary, cover.url, cover.image_id, first_release_date, genres.name, rating, platforms.name;
    where rating > 80 & rating_count > 50;
    sort rating desc;
    limit ${limit};
  `;

  const games: IGDBGame[] = await igdbFetch('/games', body);

  return games.map((game) => ({
    id: game.id,
    name: game.name,
    summary: game.summary,
    coverUrl: game.cover?.image_id ? getIGDBImageUrl(game.cover.image_id) : undefined,
    releaseDate: timestampToDate(game.first_release_date),
    genres: game.genres?.map((g) => g.name),
    rating: game.rating ? Math.round(game.rating) / 10 : undefined,
    platforms: game.platforms?.map((p) => p.name),
  }));
};

/**
 * Verifica si la API de IGDB está configurada
 */
export const isIGDBConfigured = (): boolean => {
  return !!(IGDB_CLIENT_ID && IGDB_CLIENT_SECRET && 
    IGDB_CLIENT_ID !== 'your_igdb_client_id_here' && 
    IGDB_CLIENT_SECRET !== 'your_igdb_client_secret_here');
};
