# 🚀 Cómo Ejecutar el Proyecto Media Tracker

## ✅ Prerrequisitos

1. **Node.js** instalado (versión 18 o superior)
2. **npm** o **yarn** 
3. Una cuenta en **Supabase** (https://supabase.com)

---

## 📋 Paso 1: Configurar Supabase

### 1.1 Crear un proyecto en Supabase
1. Ve a https://supabase.com
2. Inicia sesión o crea una cuenta
3. Click en "New Project"
4. Dale un nombre a tu proyecto
5. Crea una contraseña para la base de datos
6. Selecciona una región cercana

### 1.2 Ejecutar el Script SQL
1. En el panel de Supabase, ve a **SQL Editor**
2. Click en **New query**
3. Copia y pega el contenido completo del archivo `supabase-schema.sql`
4. Click en **Run** (o presiona Ctrl+Enter)
5. Verifica que las tablas se crearon correctamente en **Table Editor**

### 1.3 Obtener las credenciales
1. Ve a **Settings** → **API**
2. Busca:
   - **Project URL** (algo como: `https://xxxxx.supabase.co`)
   - **anon/public key** (una clave larga que empieza con `eyJ...`)

---

## 📋 Paso 2: Configurar el Proyecto

### 2.1 Instalar dependencias
Abre una terminal en la carpeta del proyecto y ejecuta:

```powershell
cd media-tracker
npm install
```

Esto instalará todas las dependencias necesarias (React, Supabase, Tailwind CSS, etc.)

### 2.2 Configurar variables de entorno
1. Abre el archivo `.env` (está en la raíz del proyecto)
2. Reemplaza los valores con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto-real.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-real-aqui
```

**⚠️ IMPORTANTE:** Asegúrate de usar TUS credenciales reales de Supabase.

### 2.3 (OPCIONAL) Configurar TMDB API

Para habilitar la **búsqueda automática** de películas y series con información real:

1. Sigue las instrucciones en el archivo **`TMDB-API-SETUP.md`** para obtener tu API key gratuita
2. Añade la API key al archivo `.env`:

```env
VITE_TMDB_API_KEY=tu-tmdb-api-key-aqui
```

**Si no configuras TMDB:** La app funcionará perfectamente, pero tendrás que añadir películas/series manualmente (sin búsqueda automática ni posters automáticos).

**Si configuras TMDB:** Podrás buscar películas/series, obtener posters, sinopsis, géneros, fechas y mucho más automáticamente 🎉

---

## 📋 Paso 3: Ejecutar la Aplicación

### 3.1 Modo desarrollo
En la terminal, ejecuta:

```powershell
npm run dev
```

Esto iniciará el servidor de desarrollo. Deberías ver algo como:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3.2 Abrir en el navegador
1. Abre tu navegador
2. Ve a `http://localhost:5173/`
3. ¡Listo! Deberías ver la pantalla de login

---

## 🎯 Paso 4: Probar la Aplicación

### 4.1 Crear una cuenta
1. Click en "¿No tienes cuenta? Regístrate"
2. Ingresa un email y contraseña
3. Click en "Registrarse"
4. Ingresa un nombre de usuario

### 4.2 Añadir tu primera película (con TMDB)
1. Click en el botón "Añadir Media" (+)
2. Verás "Buscar en TMDB" si configuraste la API key
3. Escribe "Inception" en el buscador
4. Selecciona la película de los resultados
5. La información se llenará automáticamente (poster, sinopsis, etc.)
6. Elige un estado y rating personal
7. Click en "Guardar"

### 4.3 Añadir manualmente (sin TMDB)
1. Click en el botón "Añadir Media" (+)
2. Click en "Añadir manualmente"
3. Escribe el título manualmente
4. Selecciona tipo, estado y rating
5. (Opcional) Pega una URL de poster
6. Click en "Guardar"

### 4.3 Añadir una serie
1. Click en el botón "Añadir Media" (+)
2. Escribe el título (ejemplo: "Breaking Bad")
3. Selecciona tipo: "Serie"
4. Click en "+ Añadir Temporada"
5. Temporada 1, 13 episodios
6. Puedes añadir más temporadas
7. Click en "Guardar"

### 4.4 Ver detalles y editar
1. Click en cualquier tarjeta de media
2. Verás los detalles completos
3. Si es una serie, puedes:
   - Incrementar episodios vistos con el botón "+"
   - Decrementar con el botón "-"
   - Marcar temporada como completada

---

## 🛠️ Comandos Útiles

```powershell
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de la build de producción
npm run preview

# Ejecutar linter
npm run lint
```

---

## 🐛 Solución de Problemas Comunes

### Error: "fetch failed" o problemas de conexión
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que el proyecto de Supabase esté activo
- Revisa que la URL no tenga espacios ni caracteres extra

### Error: "Invalid login credentials"
- Verifica que ejecutaste el script SQL completo
- Asegúrate de usar un email válido al registrarte
- La contraseña debe tener al menos 6 caracteres

### No aparecen las tablas en Supabase
- Ve a SQL Editor y ejecuta nuevamente el script
- Verifica que no haya errores en la ejecución
- Revisa en Table Editor que existan: `profiles`, `media_items`, `seasons`

### Pantalla en blanco
- Abre la consola del navegador (F12)
- Revisa si hay errores
- Asegúrate de que el archivo `.env` esté configurado
- Reinicia el servidor de desarrollo

### Error al instalar dependencias
- Asegúrate de tener Node.js instalado: `node --version`
- Intenta borrar `node_modules` y `package-lock.json`, luego ejecuta `npm install` de nuevo
- Si usas Windows, ejecuta PowerShell como administrador

---

## 📱 Características de la App

✅ **Autenticación completa** (Login/Register con Supabase)  
✅ **Dashboard con grid de medias**  
✅ **Filtros** por tipo (Todo, Películas, Series)  
✅ **Añadir películas y series** con temporadas  
✅ **Vista de detalle** con edición inline  
✅ **Tracking de episodios** para series  
✅ **Ratings** del 1 al 10  
✅ **Estados** (Viendo, Completado, Por Ver, Abandonado)  
✅ **Diseño responsive** (funciona en móvil)  
✅ **Dark mode** por defecto  
✅ **100% Serverless** (costo cero de mantenimiento)

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica los logs de Supabase
3. Asegúrate de seguir todos los pasos en orden
4. Revisa el archivo `README.md` para más detalles

---

## 🎉 ¡Disfruta tu Media Tracker!

Ahora puedes llevar un registro completo de todas las películas y series que ves.
