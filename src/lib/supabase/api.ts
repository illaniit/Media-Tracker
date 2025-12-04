// src/lib/supabase/api.ts
// Funciones API para interactuar con Supabase

import { supabase } from './supabaseClient';
import type {
  MediaItem,
  Season,
  CreateMediaItem,
  CreateSeason,
  UpdateMediaItem,
  UpdateSeason,
  MediaType,
  MediaStatus,
} from './types';

// ===================================================================
// AUTH API
// ===================================================================

export const authApi = {
  // Registrar nuevo usuario
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    return { data, error };
  },

  // Iniciar sesión
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Cerrar sesión
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Obtener sesión actual
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },
};

// ===================================================================
// MEDIA ITEMS API
// ===================================================================

export const mediaApi = {
  // Obtener todos los items del usuario
  async getMediaItems(type?: MediaType, status?: MediaStatus) {
    let query = supabase
      .from('media_items')
      .select('*, seasons(*)')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    return { data: data as MediaItem[] | null, error };
  },

  // Obtener un item específico por ID
  async getMediaItemById(id: string) {
    const { data, error } = await supabase
      .from('media_items')
      .select('*, seasons(*)')
      .eq('id', id)
      .single();

    return { data: data as MediaItem | null, error };
  },

  // Crear nuevo item
  async createMediaItem(item: CreateMediaItem) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'Usuario no autenticado' } };
    }

    const { data, error } = await supabase
      .from('media_items')
      .insert({
        ...item,
        user_id: user.id,
      })
      .select()
      .single();

    return { data: data as MediaItem | null, error };
  },

  // Actualizar item existente
  async updateMediaItem(id: string, updates: UpdateMediaItem) {
    const { data, error } = await supabase
      .from('media_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data: data as MediaItem | null, error };
  },

  // Eliminar item
  async deleteMediaItem(id: string) {
    const { error } = await supabase
      .from('media_items')
      .delete()
      .eq('id', id);

    return { error };
  },
};

// ===================================================================
// SEASONS API
// ===================================================================

export const seasonsApi = {
  // Obtener temporadas de una serie
  async getSeasonsByMediaId(mediaId: string) {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('media_id', mediaId)
      .order('season_number', { ascending: true });

    return { data: data as Season[] | null, error };
  },

  // Crear nueva temporada
  async createSeason(season: CreateSeason) {
    const { data, error } = await supabase
      .from('seasons')
      .insert({
        ...season,
        episodes_watched: season.episodes_watched || 0,
      })
      .select()
      .single();

    return { data: data as Season | null, error };
  },

  // Crear múltiples temporadas
  async createMultipleSeasons(seasons: CreateSeason[]) {
    const seasonsWithDefaults = seasons.map(s => ({
      ...s,
      episodes_watched: s.episodes_watched || 0,
    }));

    const { data, error } = await supabase
      .from('seasons')
      .insert(seasonsWithDefaults)
      .select();

    return { data: data as Season[] | null, error };
  },

  // Actualizar temporada
  async updateSeason(id: string, updates: UpdateSeason) {
    const { data, error } = await supabase
      .from('seasons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data: data as Season | null, error };
  },

  // Incrementar episodios vistos
  async incrementEpisodesWatched(id: string) {
    // Primero obtenemos la temporada actual
    const { data: season, error: fetchError } = await supabase
      .from('seasons')
      .select('episodes_watched, total_episodes')
      .eq('id', id)
      .single();

    if (fetchError || !season) {
      return { data: null, error: fetchError };
    }

    // Solo incrementar si no hemos alcanzado el total
    if (season.episodes_watched < season.total_episodes) {
      const { data, error } = await supabase
        .from('seasons')
        .update({ episodes_watched: season.episodes_watched + 1 })
        .eq('id', id)
        .select()
        .single();

      return { data: data as Season | null, error };
    }

    return { data: season as Season, error: null };
  },

  // Decrementar episodios vistos
  async decrementEpisodesWatched(id: string) {
    // Primero obtenemos la temporada actual
    const { data: season, error: fetchError } = await supabase
      .from('seasons')
      .select('episodes_watched')
      .eq('id', id)
      .single();

    if (fetchError || !season) {
      return { data: null, error: fetchError };
    }

    // Solo decrementar si es mayor que 0
    if (season.episodes_watched > 0) {
      const { data, error } = await supabase
        .from('seasons')
        .update({ episodes_watched: season.episodes_watched - 1 })
        .eq('id', id)
        .select()
        .single();

      return { data: data as Season | null, error };
    }

    return { data: season as Season, error: null };
  },

  // Eliminar temporada
  async deleteSeason(id: string) {
    const { error } = await supabase
      .from('seasons')
      .delete()
      .eq('id', id);

    return { error };
  },
};

// ===================================================================
// PROFILE API
// ===================================================================

export const profileApi = {
  // Obtener perfil del usuario actual
  async getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'Usuario no autenticado' } };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return { data, error };
  },

  // Actualizar perfil
  async updateProfile(updates: { username?: string; avatar_url?: string }) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'Usuario no autenticado' } };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    return { data, error };
  },
};
