-- ===================================================================
-- MEDIA TRACKER - SUPABASE DATABASE SCHEMA
-- ===================================================================
-- Este script crea todas las tablas necesarias para la aplicación
-- Media Tracker con las políticas de seguridad (RLS) apropiadas
-- ===================================================================

-- Habilitar la extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================================
-- 1. TABLA: profiles
-- ===================================================================
-- Almacena la información del perfil del usuario vinculada a auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsqueda por username
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Row Level Security (RLS) para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Política: Los usuarios pueden insertar su propio perfil
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ===================================================================
-- 2. TABLA: media_items
-- ===================================================================
-- Almacena las películas, series, libros, videojuegos y comics del usuario
CREATE TYPE media_type AS ENUM ('movie', 'series', 'book', 'videogame', 'comic');
CREATE TYPE media_status AS ENUM ('watching', 'completed', 'plan_to_watch', 'dropped');

CREATE TABLE IF NOT EXISTS public.media_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type media_type NOT NULL,
    status media_status NOT NULL DEFAULT 'plan_to_watch',
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    poster_url TEXT,
    notes TEXT,
    -- Campos de TMDB (The Movie Database)
    tmdb_id INTEGER,
    backdrop_url TEXT,
    overview TEXT,
    release_date TEXT,
    original_language TEXT,
    vote_average NUMERIC(3,1),
    genres TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_media_items_user_id ON public.media_items(user_id);
CREATE INDEX IF NOT EXISTS idx_media_items_type ON public.media_items(type);
CREATE INDEX IF NOT EXISTS idx_media_items_status ON public.media_items(status);
CREATE INDEX IF NOT EXISTS idx_media_items_created_at ON public.media_items(created_at DESC);

-- Row Level Security (RLS) para media_items
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver sus propios items
CREATE POLICY "Users can view own media items"
    ON public.media_items
    FOR SELECT
    USING (auth.uid() = user_id);

-- Política: Los usuarios pueden insertar sus propios items
CREATE POLICY "Users can insert own media items"
    ON public.media_items
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden actualizar sus propios items
CREATE POLICY "Users can update own media items"
    ON public.media_items
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Política: Los usuarios pueden eliminar sus propios items
CREATE POLICY "Users can delete own media items"
    ON public.media_items
    FOR DELETE
    USING (auth.uid() = user_id);

-- ===================================================================
-- 3. TABLA: seasons
-- ===================================================================
-- Almacena las temporadas de las series con rating individual
CREATE TABLE IF NOT EXISTS public.seasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_id UUID NOT NULL REFERENCES public.media_items(id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL CHECK (season_number > 0),
    episodes_watched INTEGER NOT NULL DEFAULT 0 CHECK (episodes_watched >= 0),
    total_episodes INTEGER NOT NULL CHECK (total_episodes > 0),
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    is_completed BOOLEAN GENERATED ALWAYS AS (episodes_watched >= total_episodes) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Restricción única: una serie no puede tener dos temporadas con el mismo número
    CONSTRAINT unique_season_per_media UNIQUE(media_id, season_number),
    
    -- Restricción: episodes_watched no puede ser mayor que total_episodes
    CONSTRAINT episodes_check CHECK (episodes_watched <= total_episodes)
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_seasons_media_id ON public.seasons(media_id);
CREATE INDEX IF NOT EXISTS idx_seasons_season_number ON public.seasons(season_number);

-- Row Level Security (RLS) para seasons
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver las temporadas de sus propios items
CREATE POLICY "Users can view seasons of own media"
    ON public.seasons
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.media_items
            WHERE media_items.id = seasons.media_id
            AND media_items.user_id = auth.uid()
        )
    );

-- Política: Los usuarios pueden insertar temporadas en sus propios items
CREATE POLICY "Users can insert seasons in own media"
    ON public.seasons
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.media_items
            WHERE media_items.id = seasons.media_id
            AND media_items.user_id = auth.uid()
        )
    );

-- Política: Los usuarios pueden actualizar temporadas de sus propios items
CREATE POLICY "Users can update seasons of own media"
    ON public.seasons
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.media_items
            WHERE media_items.id = seasons.media_id
            AND media_items.user_id = auth.uid()
        )
    );

-- Política: Los usuarios pueden eliminar temporadas de sus propios items
CREATE POLICY "Users can delete seasons of own media"
    ON public.seasons
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.media_items
            WHERE media_items.id = seasons.media_id
            AND media_items.user_id = auth.uid()
        )
    );

-- ===================================================================
-- 4. TRIGGERS
-- ===================================================================
-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para media_items
CREATE TRIGGER update_media_items_updated_at
    BEFORE UPDATE ON public.media_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para seasons
CREATE TRIGGER update_seasons_updated_at
    BEFORE UPDATE ON public.seasons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- 5. FUNCIÓN: Crear perfil automáticamente al registrarse
-- ===================================================================
-- Esta función se ejecuta automáticamente cuando un usuario se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función anterior
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ===================================================================
-- 6. DATOS DE EJEMPLO (OPCIONAL)
-- ===================================================================
-- Puedes comentar esta sección si no quieres datos de prueba

-- Nota: Para insertar datos de ejemplo, primero necesitas un usuario registrado
-- Reemplaza 'USER_UUID_HERE' con el UUID de un usuario real después del registro

/*
-- Ejemplo de película
INSERT INTO public.media_items (user_id, title, type, status, rating, poster_url)
VALUES (
    'USER_UUID_HERE',
    'Inception',
    'movie',
    'completed',
    9,
    'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
);

-- Ejemplo de serie con temporadas
INSERT INTO public.media_items (user_id, title, type, status, rating)
VALUES (
    'USER_UUID_HERE',
    'Breaking Bad',
    'series',
    'watching',
    10
) RETURNING id;

-- Insertar temporadas (reemplaza SERIES_UUID con el id de la serie anterior)
INSERT INTO public.seasons (media_id, season_number, episodes_watched, total_episodes)
VALUES
    ('SERIES_UUID', 1, 7, 7),
    ('SERIES_UUID', 2, 13, 13),
    ('SERIES_UUID', 3, 5, 13);
*/

-- ===================================================================
-- 7. VISTAS ÚTILES (OPCIONAL)
-- ===================================================================

-- Vista que muestra el progreso total de las series
CREATE OR REPLACE VIEW public.series_progress AS
SELECT 
    mi.id,
    mi.user_id,
    mi.title,
    mi.status,
    mi.rating,
    COUNT(s.id) as total_seasons,
    SUM(s.episodes_watched) as total_episodes_watched,
    SUM(s.total_episodes) as total_episodes,
    ROUND(
        (SUM(s.episodes_watched)::DECIMAL / NULLIF(SUM(s.total_episodes), 0) * 100), 2
    ) as progress_percentage,
    COUNT(s.id) FILTER (WHERE s.is_completed) as completed_seasons
FROM 
    public.media_items mi
LEFT JOIN 
    public.seasons s ON mi.id = s.media_id
WHERE 
    mi.type = 'series'
GROUP BY 
    mi.id, mi.user_id, mi.title, mi.status, mi.rating;

-- Dar permisos de lectura a la vista
GRANT SELECT ON public.series_progress TO authenticated;

-- ===================================================================
-- FIN DEL SCRIPT
-- ===================================================================
-- Para ejecutar este script:
-- 1. Ve a tu proyecto de Supabase
-- 2. Navega a "SQL Editor" en el panel lateral
-- 3. Crea una nueva query
-- 4. Pega este script completo
-- 5. Haz clic en "Run" o presiona Ctrl+Enter
-- ===================================================================
