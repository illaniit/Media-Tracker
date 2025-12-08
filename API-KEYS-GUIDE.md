# 🔐 Guía de Configuración de APIs - Media Tracker

Esta guía te explica cómo obtener y configurar de forma segura las API keys necesarias para las funciones avanzadas de búsqueda automática.

## 📋 Índice

1. [Supabase (Obligatorio)](#supabase-obligatorio)
2. [TMDB - Películas y Series (Opcional)](#tmdb---películas-y-series-opcional)
3. [IGDB - Videojuegos (Opcional)](#igdb---videojuegos-opcional)
4. [ComicVine - Cómics (Opcional)](#comicvine---cómics-opcional)
5. [Configuración del Archivo .env](#configuración-del-archivo-env)
6. [Seguridad y Mejores Prácticas](#seguridad-y-mejores-prácticas)

---

## 🗄️ Supabase (Obligatorio)

Supabase es el backend de la aplicación. Sin esto, la app no funcionará para usuarios autenticados.

### Pasos:

1. **Crear cuenta gratuita**
   - Ve a [supabase.com](https://supabase.com)
   - Regístrate con GitHub, Google o email

2. **Crear un nuevo proyecto**
   - Click en "New Project"
   - Elige un nombre y contraseña segura
   - Selecciona la región más cercana

3. **Obtener credenciales**
   - Ve a `Settings` → `API`
   - Copia el `Project URL` (será tu `VITE_SUPABASE_URL`)
   - Copia el `anon/public` key (será tu `VITE_SUPABASE_ANON_KEY`)

4. **Configurar la base de datos**
   - Ve a `SQL Editor`
   - Copia y ejecuta el contenido de `supabase-schema.sql`

### ⚠️ Seguridad:
- ✅ La `anon key` es segura para usar en el frontend
- ✅ Row Level Security (RLS) protege tus datos
- ❌ **NUNCA** expongas la `service_role` key

---

## 🎬 TMDB - Películas y Series (Opcional)

The Movie Database (TMDB) proporciona información detallada de películas y series.

### Pasos:

1. **Crear cuenta**
   - Ve a [themoviedb.org](https://www.themoviedb.org/signup)
   - Regístrate gratis

2. **Solicitar API Key**
   - Ve a tu perfil → `Settings` → `API`
   - Click en "Request an API Key"
   - Elige "Developer"
   - Completa el formulario:
     - **Type of Use**: Personal/Educational
     - **Application Name**: Media Tracker (o el nombre de tu proyecto)
     - **Application URL**: `http://localhost` (para desarrollo local)
     - **Application Summary**: "Aplicación personal para seguimiento de películas y series"

3. **Obtener la API Key**
   - Una vez aprobada (instantáneo), copia tu **API Key (v3 auth)**
   - Esta será tu `VITE_TMDB_API_KEY`

### 📊 Límites:
- **40 peticiones cada 10 segundos** (más que suficiente)
- Uso gratuito para proyectos personales y educativos

### ⚠️ Seguridad:
- ✅ Segura para usar en frontend
- ✅ Sin límites estrictos de cuota
- ℹ️ TMDB permite uso educacional sin problemas

---

## 🎮 IGDB - Videojuegos (Opcional)

Internet Game Database (IGDB) proporciona información de videojuegos. Requiere cuenta de Twitch.

### Pasos:

1. **Crear cuenta de Twitch Developer**
   - Ve a [dev.twitch.tv](https://dev.twitch.tv)
   - Inicia sesión con tu cuenta de Twitch (o crea una)
   - Acepta los términos de desarrollador

2. **Registrar aplicación**
   - Ve a [Twitch Developer Console](https://dev.twitch.tv/console/apps)
   - Click en "Register Your Application"
   - Completa el formulario:
     - **Name**: Media Tracker
     - **OAuth Redirect URLs**: `http://localhost:5173` (para desarrollo)
     - **Category**: Application Integration

3. **Obtener credenciales**
   - Click en "Manage" en tu aplicación
   - Copia el **Client ID** (será tu `VITE_IGDB_CLIENT_ID`)
   - Click en "New Secret" y copia el **Client Secret** (será tu `VITE_IGDB_CLIENT_SECRET`)

### 📊 Límites:
- **4 peticiones por segundo**
- Uso gratuito sin límite de cuota

### ⚠️ Seguridad:
- ⚠️ El `Client Secret` es sensible
- ⚠️ En producción, las credenciales deben estar en el backend
- ℹ️ Para desarrollo local está bien usarlo en frontend
- 🔒 **Consideración para producción**: Implementar un proxy backend que maneje el OAuth

---

## 📚 ComicVine - Cómics (Opcional)

ComicVine proporciona información sobre cómics, manga y novelas gráficas.

### Pasos:

1. **Crear cuenta**
   - Ve a [comicvine.gamespot.com](https://comicvine.gamespot.com)
   - Crea una cuenta gratuita de Giant Bomb

2. **Solicitar API Key**
   - Ve a [comicvine.gamespot.com/api](https://comicvine.gamespot.com/api/)
   - Inicia sesión y solicita acceso a la API
   - Completa el formulario explicando tu uso personal/educativo

3. **Obtener la API Key**
   - Una vez aprobada, copia tu API key
   - Esta será tu `VITE_COMICVINE_API_KEY`

### 📊 Límites:
- **200 peticiones por hora**
- **1 petición por segundo**
- Uso gratuito para proyectos no comerciales

### ⚠️ Seguridad:
- ✅ Segura para usar en frontend con limitaciones
- ℹ️ Respeta los rate limits para evitar bloqueos

---

## ⚙️ Configuración del Archivo .env

1. **Copiar el template**
   ```bash
   cp .env.example .env
   ```

2. **Editar `.env` con tus credenciales**
   ```env
   # SUPABASE (Obligatorio)
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui

   # TMDB (Opcional - para películas y series)
   VITE_TMDB_API_KEY=tu-tmdb-api-key-aqui

   # IGDB (Opcional - para videojuegos)
   VITE_IGDB_CLIENT_ID=tu-client-id-aqui
   VITE_IGDB_CLIENT_SECRET=tu-client-secret-aqui

   # COMICVINE (Opcional - para cómics)
   VITE_COMICVINE_API_KEY=tu-comicvine-key-aqui
   ```

3. **Verificar que `.env` está en `.gitignore`**
   ```bash
   cat .gitignore | grep .env
   ```
   Debe aparecer `.env` en la lista.

---

## 🛡️ Seguridad y Mejores Prácticas

### ✅ Hacer:

1. **Mantener `.env` privado**
   - Nunca subas `.env` a Git
   - No lo compartas en capturas de pantalla
   - No lo pegues en foros o Discord

2. **Usar variables con prefijo `VITE_`**
   - Vite solo expone variables con este prefijo al frontend
   - Variables sin `VITE_` no serán accesibles (protección adicional)

3. **Regenerar keys comprometidas**
   - Si expones accidentalmente una key, regénérala inmediatamente
   - Cambia la contraseña de la cuenta asociada

4. **Límites de tasa**
   - Implementa debouncing en búsquedas (ya implementado)
   - Cachea resultados cuando sea posible
   - No hagas peticiones innecesarias

### ❌ Evitar:

1. **Nunca commitees `.env` a Git**
   ```bash
   # Verificar que no está en el historial
   git log --all --full-history -- .env
   ```

2. **No expongas el Service Role de Supabase**
   - Solo usa la `anon key` en frontend
   - La `service_role` key bypasea RLS (muy peligroso)

3. **No abuses de las APIs**
   - Respeta los rate limits
   - No hagas scraping masivo
   - Usa las APIs según sus términos de servicio

### 🔒 Producción:

Para un entorno de producción seguro:

1. **IGDB Client Secret debe estar en backend**
   - Crear un endpoint `/api/igdb/search`
   - El backend hace el OAuth y peticiones a IGDB
   - El frontend solo llama a tu API

2. **Usar variables de entorno del hosting**
   - Netlify: Settings → Environment Variables
   - Vercel: Settings → Environment Variables
   - Nunca hardcodees las keys en el código

3. **Implementar rate limiting**
   - Limitar peticiones por usuario
   - Cachear resultados populares
   - Usar CDN cuando sea posible

---

## 🚀 Verificar Configuración

Después de configurar, verifica que todo funciona:

1. **Supabase**
   - Intenta registrarte en la app
   - Verifica que puedes añadir contenido

2. **TMDB**
   - Busca una película o serie
   - Deberían aparecer resultados con posters

3. **IGDB**
   - Busca un videojuego
   - Verifica que aparecen resultados

4. **ComicVine**
   - Busca un cómic
   - Confirma que la búsqueda funciona

### Console de Navegador

Abre las DevTools (F12) y revisa:
- ✅ Sin errores de CORS
- ✅ Sin errores 401 (no autorizado)
- ✅ Sin errores 429 (rate limit excedido)

---

## 📞 Soporte

Si tienes problemas con alguna API:

- **TMDB**: [themoviedb.org/talk](https://www.themoviedb.org/talk)
- **IGDB**: [api-docs.igdb.com](https://api-docs.igdb.com/)
- **ComicVine**: [comicvine.gamespot.com/forums](https://comicvine.gamespot.com/forums/)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)

---

## ✨ Funcionalidad sin APIs

La aplicación funciona perfectamente sin configurar las APIs opcionales:

- ✅ Puedes añadir contenido manualmente
- ✅ Todas las funciones CRUD funcionan
- ✅ El seguimiento de progreso funciona
- ❌ No tendrás búsqueda automática
- ❌ No se autocompletarán datos como posters o descripciones

Las APIs son **mejoras opcionales** para una experiencia más cómoda.

---

**Creado por Illán Iglesias Torres** 🚀
