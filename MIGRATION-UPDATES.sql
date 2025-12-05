-- =============================================================================
-- MIGRATION UPDATES - Media Tracker
-- =============================================================================
-- Este archivo contiene los comandos SQL necesarios para actualizar
-- la base de datos existente con los nuevos tipos de contenido y
-- funcionalidades de rating por temporada.
-- 
-- IMPORTANTE: Ejecutar estos comandos en el SQL Editor de Supabase
-- =============================================================================

-- 1. Agregar nuevos tipos de contenido al enum media_type
-- ============================================================================
-- NOTA: PostgreSQL no permite agregar múltiples valores a un ENUM en una sola sentencia
-- Ejecutar estos comandos UNO POR UNO en el SQL Editor de Supabase:

ALTER TYPE media_type ADD VALUE IF NOT EXISTS 'book';
ALTER TYPE media_type ADD VALUE IF NOT EXISTS 'videogame';
ALTER TYPE media_type ADD VALUE IF NOT EXISTS 'comic';

-- 2. Agregar columna de rating a la tabla seasons
-- ============================================================================
ALTER TABLE public.seasons 
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 10);

-- 3. Verificar los cambios
-- ============================================================================
-- Verificar que los nuevos tipos fueron agregados correctamente:
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = 'media_type'::regtype 
ORDER BY enumlabel;

-- Verificar que la columna rating fue agregada correctamente:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'seasons' 
  AND column_name = 'rating';

-- =============================================================================
-- FIN DE MIGRATION UPDATES
-- =============================================================================
