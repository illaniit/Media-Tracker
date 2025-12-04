# 🚀 GUÍA RÁPIDA DE INICIO - Media Tracker

## ⚡ Setup en 5 Minutos

### 1️⃣ Instalar Dependencias (1 min)

```powershell
cd media-tracker
npm install
```

### 2️⃣ Configurar Supabase (2 min)

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. Copia tu **Project URL** y **Anon Key**
3. En Supabase, ve a **SQL Editor** y ejecuta todo el contenido de `supabase-schema.sql`

### 3️⃣ Variables de Entorno (30 seg)

Edita el archivo `.env` en la raíz:

```env
# Obligatorio para funcionar
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui

# OPCIONAL: Para búsqueda automática (ver TMDB-API-SETUP.md)
VITE_TMDB_API_KEY=tu_tmdb_key_aqui
```

**Nota:** Sin TMDB la app funciona perfectamente, solo añadirás contenido manualmente.

### 4️⃣ Ejecutar Aplicación (30 seg)

```powershell
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

### 5️⃣ ¡Listo! Crea tu cuenta y empieza a usar la app 🎉

---

## 📝 Comandos Útiles

```powershell
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linter
npm run lint
```

---

## 🎯 Flujo de Uso Básico

1. **Registrarse** → Crear cuenta con email/password
2. **Dashboard** → Ver tu colección de películas/series
3. **Añadir** → Click en botón "+" para añadir contenido
   - **Película**: Título, estado, rating (opcional)
   - **Serie**: Título + temporadas (número y episodios totales)
4. **Ver Detalle** → Click en tarjeta para ver/editar
5. **Series** → Usa botones +/- para trackear episodios vistos

---

## 🎨 Características Principales

✅ Autenticación con Supabase  
✅ Gestión de películas y series  
✅ Seguimiento de temporadas y episodios  
✅ Sistema de rating (1-10)  
✅ Filtros (Todo, Películas, Series)  
✅ Estados: Viendo, Completado, Por ver, Abandonado  
✅ UI oscura y responsive  
✅ Totalmente serverless  

---

## 🔧 Solución de Problemas Comunes

### Error: "Module not found"
```powershell
npm install
```

### La app no conecta con Supabase
- Verifica que `.env` existe y tiene las credenciales correctas
- Las variables deben empezar con `VITE_`
- Reinicia el servidor: Ctrl+C y luego `npm run dev`

### No puedo registrarme
- Verifica que ejecutaste el SQL en Supabase
- Ve a Supabase > Table Editor y confirma que existen las tablas

---

## 📂 Archivos Importantes

- `supabase-schema.sql` → Script SQL para crear la base de datos
- `.env.example` → Plantilla para variables de entorno
- `src/lib/supabase/api.ts` → Todas las funciones de API
- `src/contexts/AuthContext.tsx` → Lógica de autenticación
- `README.md` → Documentación completa

---

## 🚀 Deploy Rápido

### Vercel (Recomendado)
```powershell
npm install -g vercel
vercel
```
Configura las variables de entorno en el dashboard.

### Netlify
```powershell
npm install -g netlify-cli
netlify deploy --prod
```

---

¡Disfruta tu watchlist personal! 🎬🍿
