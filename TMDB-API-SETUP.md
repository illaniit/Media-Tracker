# 🎬 Cómo Obtener tu API Key de TMDB

## ¿Qué es TMDB?

**TMDB (The Movie Database)** es una base de datos gratuita y comunitaria de películas y series de TV. Ofrece una API gratuita que te permite buscar información detallada sobre películas y series, incluyendo:

- Títulos, sinopsis y descripciones
- Posters y imágenes de fondo (backdrops)
- Fechas de lanzamiento
- Calificaciones y popularidad
- Géneros
- Información de temporadas y episodios (para series)

---

## 🔑 Pasos para Obtener tu API Key (100% Gratis)

### Paso 1: Crear una Cuenta en TMDB

1. Ve a **https://www.themoviedb.org/**
2. Click en **Unirse a TMDB** (Join TMDB) en la esquina superior derecha
3. Llena el formulario de registro:
   - Nombre de usuario
   - Contraseña
   - Email
   - Acepta los términos de servicio
4. Verifica tu email (recibirás un correo de confirmación)

### Paso 2: Solicitar una API Key

1. Una vez logueado, haz click en tu avatar/nombre de usuario (esquina superior derecha)
2. Selecciona **Settings** (Configuración)
3. En el menú lateral izquierdo, click en **API**
4. Verás una sección que dice "Request an API Key"
5. Click en **click here** para solicitar la API key

### Paso 3: Seleccionar el Tipo de Uso

1. Te preguntará para qué usarás la API
2. Selecciona **Developer** (Desarrollador)
3. Acepta los términos de uso de la API

### Paso 4: Llenar el Formulario

Llena los siguientes campos:

- **Application Name:** `Media Tracker Personal` (o el nombre que prefieras)
- **Application URL:** Puedes poner `http://localhost:5173` (no es verificado)
- **Application Summary:** Describe brevemente tu uso, por ejemplo:
  ```
  Aplicación personal para llevar un registro de las películas y series que veo.
  Uso la API para buscar información y obtener posters automáticamente.
  ```

### Paso 5: Obtener tu API Key

1. Una vez enviado el formulario, serás redirigido a la página de API
2. Verás dos claves:
   - **API Key (v3 auth)** ← **Esta es la que necesitas**
   - **API Read Access Token (v4 auth)** ← Esta NO la necesitas

3. Copia la **API Key (v3 auth)** (es una cadena larga como: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

---

## ⚙️ Configurar la API Key en tu Proyecto

### Paso 1: Abrir el archivo .env

Abre el archivo `.env` en la raíz del proyecto `media-tracker`

### Paso 2: Pegar tu API Key

Reemplaza `your_tmdb_api_key_here` con tu API key real:

```env
VITE_TMDB_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Ejemplo completo del archivo `.env`:**

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui

# TMDB API Configuration
VITE_TMDB_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### Paso 3: Reiniciar el Servidor

Si el servidor de desarrollo está corriendo, reinícialo:

1. Presiona `Ctrl + C` en la terminal
2. Ejecuta `npm run dev` nuevamente

---

## ✅ Verificar que Funciona

1. Abre la aplicación en `http://localhost:5173`
2. Inicia sesión
3. Click en "Añadir Media" (+)
4. Verás dos opciones: **"Buscar en TMDB"** y **"Añadir manualmente"**
5. Click en "Buscar en TMDB"
6. Escribe el nombre de una película (ej: "Inception") o serie (ej: "Breaking Bad")
7. Deberías ver resultados automáticos con posters e información

---

## 🚫 Si NO Configuras TMDB

**No hay problema**, la aplicación seguirá funcionando perfectamente:

- Solo podrás **añadir contenido manualmente**
- Tendrás que escribir los títulos tú mismo
- Podrás pegar URLs de posters manualmente
- No tendrás acceso a sinopsis, backdrops ni datos automáticos

**La app está diseñada para funcionar con o sin TMDB** 💪

---

## 📊 Límites de la API (Gratuita)

TMDB API tiene límites generosos para uso personal:

- **40 requests por 10 segundos**
- **Ilimitado por día** (con rate limiting)

Para uso personal de Media Tracker, **nunca alcanzarás estos límites** 🎉

---

## 🔒 Seguridad de la API Key

⚠️ **IMPORTANTE:**

- **NO** compartas tu API key públicamente
- **NO** subas el archivo `.env` a GitHub o repositorios públicos
- El archivo `.gitignore` ya está configurado para ignorar `.env`
- Si accidentalmente expones tu key, regenerala en TMDB Settings

---

## 🆘 Problemas Comunes

### Error: "TMDB API Key no está configurada"

**Solución:**
- Verifica que el archivo `.env` tenga la línea `VITE_TMDB_API_KEY=tu-key-real`
- Asegúrate de reiniciar el servidor después de editar `.env`
- La key debe empezar con `VITE_` (es requisito de Vite)

### Error: "fetch failed" o errores de red

**Solución:**
- Verifica tu conexión a internet
- Asegúrate de que la API key sea correcta (32 caracteres hexadecimales)
- Intenta regenerar la API key en TMDB

### No aparecen resultados al buscar

**Solución:**
- Verifica que tu API key sea válida
- Intenta con títulos en inglés (ej: "The Matrix" en vez de "Matrix")
- Revisa la consola del navegador (F12) para ver errores

---

## 📚 Recursos Adicionales

- **Documentación oficial de TMDB API:** https://developers.themoviedb.org/3
- **Dashboard de TMDB:** https://www.themoviedb.org/settings/api
- **FAQ de la API:** https://www.themoviedb.org/talk/category/5047958519c29526b50017d6

---

## 🎉 ¡Listo!

Ahora puedes disfrutar de tu Media Tracker con búsqueda automática de películas y series, posters reales, sinopsis, y toda la información de TMDB 🍿
