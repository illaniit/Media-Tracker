# 🎬 Media Tracker - Tu Watchlist Personal

Una aplicación web moderna y minimalista para hacer seguimiento de tus películas y series favoritas. Construida con React, TypeScript, Tailwind CSS y Supabase.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)

## ✨ Características

- 🔐 **Autenticación completa** con Supabase Auth
- 🎥 **Gestión de películas** con estados personalizados
- 📺 **Seguimiento de series** con temporadas y episodios
- ⭐ **Sistema de calificación** (1-10)
- 🎨 **UI oscura y minimalista** con Tailwind CSS
- 📱 **Totalmente responsive** (funciona en móvil y desktop)
- 🚀 **Serverless** - cero costo de mantenimiento
- 💾 **Row Level Security (RLS)** - datos protegidos por usuario

## 🏗️ Estructura del Proyecto

```
media-tracker/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.tsx              # Formulario de inicio de sesión
│   │   │   ├── Register.tsx           # Formulario de registro
│   │   │   └── ProtectedRoute.tsx     # HOC para proteger rutas
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx          # Vista principal con grid
│   │   │   ├── MediaCard.tsx          # Tarjeta de película/serie
│   │   │   └── AddMediaModal.tsx      # Modal para añadir contenido
│   │   └── media/
│   │       ├── MediaDetail.tsx        # Vista de detalle
│   │       └── SeasonList.tsx         # Gestión de temporadas
│   ├── contexts/
│   │   └── AuthContext.tsx            # Context API para auth
│   ├── lib/
│   │   └── supabase/
│   │       ├── supabaseClient.ts      # Cliente configurado
│   │       ├── types.ts               # Tipos TypeScript
│   │       └── api.ts                 # Funciones API
│   ├── App.tsx                        # Routing principal
│   ├── main.tsx                       # Entry point
│   ├── index.css                      # Estilos globales
│   └── vite-env.d.ts                  # Types de Vite
├── supabase-schema.sql                # Script SQL completo
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── .env.example                       # Variables de entorno
```

## 🚀 Instalación y Configuración

### 1. Clonar y Preparar el Proyecto

```bash
# Navegar a la carpeta del proyecto
cd media-tracker

# Instalar dependencias
npm install
```

### 2. Configurar Supabase

#### a) Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota tu **URL del proyecto** y **Anon Key**

#### b) Ejecutar el Schema SQL

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Crea una nueva query
3. Copia todo el contenido del archivo `supabase-schema.sql`
4. Pégalo en el editor y ejecuta (Run)
5. Verifica que las tablas se crearon correctamente en **Table Editor**

#### c) Configurar Variables de Entorno

```bash
# Crear archivo .env en la raíz del proyecto
cp .env.example .env

# Editar .env con tus credenciales de Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 3. Ejecutar el Proyecto

```bash
# Modo desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### 4. Build para Producción

```bash
# Generar build optimizado
npm run build

# Preview del build
npm run preview
```

## 📊 Base de Datos

### Tablas Principales

#### `profiles`
- Información del usuario vinculada a auth.users
- Campos: `id`, `username`, `avatar_url`

#### `media_items`
- Películas y series del usuario
- Campos: `id`, `user_id`, `title`, `type`, `status`, `rating`, `poster_url`, `notes`
- Types: `movie` | `series`
- Status: `watching`, `completed`, `plan_to_watch`, `dropped`

#### `seasons`
- Temporadas de las series
- Campos: `id`, `media_id`, `season_number`, `episodes_watched`, `total_episodes`, `is_completed`
- Calcula automáticamente si está completada

### Seguridad (RLS)

Todas las tablas tienen **Row Level Security** habilitado:
- Los usuarios solo pueden ver/editar/eliminar su propio contenido
- Las políticas están configuradas automáticamente en el SQL

## 🎨 Uso de la Aplicación

### 1. Registro e Inicio de Sesión
- Crea una cuenta con email y contraseña
- Inicia sesión para acceder al dashboard

### 2. Dashboard
- **Filtros**: Ver todo, solo películas, o solo series
- **Añadir**: Click en el botón "+" para añadir contenido
- **Tarjetas**: Click en cualquier tarjeta para ver detalles

### 3. Añadir Película/Serie

#### Para Películas:
1. Ingresa el título
2. Selecciona "Película"
3. Elige el estado (por ver, viendo, completado, abandonado)
4. Opcionalmente añade calificación (1-10) y URL del poster
5. Guarda

#### Para Series:
1. Ingresa el título
2. Selecciona "Serie"
3. Elige el estado
4. **Añade temporadas**: Click en "Añadir temporada"
   - Especifica el número de temporada
   - Cuántos episodios tiene en total
5. Guarda

### 4. Vista de Detalle

#### Para Películas:
- Editar información (título, estado, rating, poster)
- Eliminar película

#### Para Series:
- Editar información general
- **Gestión de temporadas**:
  - Botón `+` para incrementar episodios vistos
  - Botón `-` para decrementar episodios vistos
  - Barra de progreso visual
  - Badge de "Completada" cuando terminas una temporada
- Eliminar serie (elimina automáticamente todas sus temporadas)

## 🎯 Funcionalidades Avanzadas

### Seguimiento de Progreso
- Las series muestran cuántas temporadas tienen
- Cada temporada muestra progreso: "5/13 episodios"
- Barra de progreso visual por temporada
- Auto-marca como completada cuando llegas al último episodio

### Estados de Visualización
- **Por ver** (amarillo): En tu lista de pendientes
- **Viendo** (verde): Actualmente en progreso
- **Completado** (azul): Terminado
- **Abandonado** (rojo): Decidiste no continuar

### Sistema de Rating
- Califica del 1 al 10
- Opcional (puedes añadir películas/series sin rating)
- Editable en cualquier momento

## 🔧 Tecnologías Utilizadas

- **React 18.2** - UI Library
- **TypeScript 5.2** - Type Safety
- **Vite** - Build Tool ultra-rápido
- **Tailwind CSS 3.4** - Utility-first CSS
- **Lucide React** - Iconos modernos
- **React Router Dom 6** - Routing
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Row Level Security
  - Real-time subscriptions (preparado para futuras features)

## 📝 Scripts Disponibles

```bash
npm run dev      # Desarrollo con hot reload
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linter de código
```

## 🔒 Seguridad

- ✅ Autenticación segura con Supabase Auth
- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Tokens JWT para sesiones
- ✅ Variables de entorno para credenciales
- ✅ Validación de datos en frontend y backend

## 🚢 Deploy

### Opción 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Configurar variables de entorno en el dashboard de Vercel
```

### Opción 2: Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Configurar variables de entorno en el dashboard de Netlify
```

### Opción 3: Cualquier hosting estático
El build genera archivos estáticos en `dist/` que pueden ser servidos desde cualquier CDN o hosting.

## 🐛 Troubleshooting

### Error: "Cannot find module '@supabase/supabase-js'"
```bash
npm install
```

### Error: Variables de entorno no definidas
- Asegúrate de tener el archivo `.env` en la raíz
- Las variables deben empezar con `VITE_`
- Reinicia el servidor de desarrollo después de cambiar `.env`

### Error: RLS Policies
- Verifica que ejecutaste todo el script SQL
- Revisa en Supabase > Authentication > Policies que las políticas estén activas

### La aplicación se queda en "Loading..."
- Verifica tus credenciales de Supabase en `.env`
- Abre la consola del navegador (F12) para ver errores
- Verifica que las tablas existen en Supabase

## 🎓 Próximas Mejoras Sugeridas

- [ ] Búsqueda y filtros avanzados
- [ ] Integración con APIs de películas (TMDB, OMDB)
- [ ] Importar datos automáticamente con poster y metadata
- [ ] Compartir listas con otros usuarios
- [ ] Estadísticas (películas vistas este mes, horas totales, etc.)
- [ ] Modo claro/oscuro toggle
- [ ] Exportar datos a CSV/JSON
- [ ] PWA (Progressive Web App) para uso offline

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado como proyecto ejemplo de arquitectura moderna con React y Supabase.

---

**¿Tienes preguntas o sugerencias?** Abre un issue en el repositorio.

¡Disfruta organizando tu watchlist! 🍿
