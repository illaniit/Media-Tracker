# 🎬 Media Tracker

<div align="center">

![Media Tracker Banner](https://img.shields.io/badge/Media-Tracker-amber?style=for-the-badge&logo=film&logoColor=white)

**Tu biblioteca personal de entretenimiento - Películas, Series, Libros, Videojuegos y Comics**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3fcf8e?style=flat-square&logo=supabase)](https://supabase.com/)

</div>

---

## 📖 Sobre el Proyecto

**Media Tracker** es una aplicación web moderna para organizar y hacer seguimiento de tu contenido de entretenimiento favorito. Nació como un experimento personal de "vibe coding" para resolver una necesidad real: mantener un registro organizado de películas, series, libros, videojuegos y comics.

### ¿Por qué existe este proyecto?

Como estudiante de ingeniería informática, creé esta aplicación para:
- 📚 Practicar tecnologías modernas de desarrollo web
- 🎯 Resolver mi propio problema de gestión de contenido
- 🎨 Experimentar con diseño UI/UX elegante y minimalista
- 🚀 Aprender sobre arquitectura serverless y bases de datos en la nube

> **Nota**: Este es un proyecto personal de experimentación y aprendizaje. El código está disponible públicamente con fines educativos.

---

## ✨ Características Principales

### 🎭 Funcionalidades Core
- **5 tipos de media**: Películas, Series, Libros, Videojuegos y Comics
- **Sistema de estados**: Planificado, En progreso, Completado, En espera, Abandonado
- **Calificaciones duales**: Tu rating personal + rating de TMDB
- **Gestión de temporadas**: Seguimiento detallado de series por temporadas y episodios
- **Reviews personales**: Escribe tus opiniones sobre cada contenido
- **Modo invitado**: Prueba la app sin registrarte (datos en localStorage)

### 🔐 Autenticación y Seguridad
- Sistema de autenticación completo con Supabase Auth
- Row Level Security (RLS) - tus datos son privados por defecto
- Sesiones persistentes con refresh automático
- Modo invitado con advertencias sobre persistencia de datos

### 🎨 Diseño y Experiencia
- **Tema elegante**: Negro profundo con acentos dorados
- **Totalmente responsive**: Funciona perfectamente en móvil y desktop
- **Performance optimizada**: Animaciones sutiles y transiciones rápidas
- **Accesibilidad**: Contraste adecuado y navegación intuitiva

### 🔗 Integraciones
- **TMDB API**: Datos automáticos de películas y series
- **Landing page profesional**: Explicación clara de la aplicación
- **Footer con atribución**: Créditos visibles del creador

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

```
Frontend:
├── React 18.2          → UI Library
├── TypeScript 5.2      → Type Safety
├── Vite 5.4           → Build Tool
├── Tailwind CSS 3.4   → Styling
└── React Router 6     → Navigation

Backend & Servicios:
├── Supabase           → Database + Auth + Storage
├── PostgreSQL         → Relational Database
└── TMDB API           → Movie & TV Data

Herramientas:
├── ESLint             → Code Linting
├── PostCSS            → CSS Processing
└── Git                → Version Control
```

### Estructura del Proyecto

```
media-tracker/
├── src/
│   ├── components/
│   │   ├── auth/                    # Autenticación
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── dashboard/               # Vista principal
│   │   │   ├── Dashboard.tsx
│   │   │   ├── MediaCard.tsx
│   │   │   ├── AddMediaModal.tsx
│   │   │   └── GuestWarningBanner.tsx
│   │   ├── media/                   # Detalles de media
│   │   │   ├── MediaDetail.tsx
│   │   │   └── SeasonList.tsx
│   │   └── LandingPage.tsx          # Página de inicio
│   ├── contexts/                    # Context API
│   │   ├── AuthContext.tsx
│   │   └── GuestContext.tsx
│   ├── lib/
│   │   ├── supabase/                # Cliente Supabase
│   │   │   ├── supabaseClient.ts
│   │   │   ├── types.ts
│   │   │   └── api.ts
│   │   └── tmdb/                    # Cliente TMDB
│   │       └── tmdbApi.ts
│   ├── App.tsx                      # Router principal
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Estilos globales
├── supabase-schema.sql              # Schema de base de datos
├── .env.example                     # Template de variables de entorno
├── .gitignore                       # Archivos excluidos de Git
├── LICENSE                          # Licencia de uso
└── package.json                     # Dependencias del proyecto
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ y npm
- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Cuenta en [TMDB](https://www.themoviedb.org/) para API key (opcional pero recomendado)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/illaniit/media-tracker.git
cd media-tracker
npm install
```

### Paso 2: Configurar Supabase

1. **Crear proyecto en Supabase**
   - Ve a [https://supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Anota tu **Project URL** y **Anon Public Key**

2. **Ejecutar el Schema SQL**
   - En tu proyecto de Supabase, ve a **SQL Editor**
   - Crea una nueva query
   - Copia todo el contenido de `supabase-schema.sql`
   - Pégalo y ejecuta (Run)

3. **Verificar tablas**
   - Ve a **Table Editor** en Supabase
   - Deberías ver las tablas: `media_items`, `seasons`, `episodes`

### Paso 3: Obtener API Key de TMDB (Opcional)

1. Crea una cuenta en [themoviedb.org](https://www.themoviedb.org/)
2. Ve a Settings → API
3. Solicita una API key (gratuita)
4. Copia tu **API Key (v3 auth)**

### Paso 4: Configurar Variables de Entorno

```bash
# Crear archivo .env desde el template
cp .env.example .env
```

Edita `.env` y añade tus credenciales:

```env
# Supabase (OBLIGATORIO)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui

# TMDB (OPCIONAL - mejora la experiencia)
VITE_TMDB_API_KEY=tu-tmdb-api-key-aqui
```

> ⚠️ **IMPORTANTE**: Nunca commitees el archivo `.env` a Git. Ya está incluido en `.gitignore`.

### Paso 5: Ejecutar el Proyecto

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

La aplicación estará disponible en: `http://localhost:5173`

---

## 📱 Uso de la Aplicación

### Para Usuarios Nuevos

1. **Modo Invitado** (sin registro)
   - Click en "Probar como Invitado" en la landing page
   - Explora todas las funcionalidades
   - Los datos se guardan en tu navegador (localStorage)
   - ⚠️ Los datos se pierden al limpiar el caché

2. **Crear Cuenta** (recomendado)
   - Click en "Crear Cuenta"
   - Registra tu email y contraseña
   - Tus datos estarán seguros en la nube
   - Accede desde cualquier dispositivo

### Gestión de Contenido

1. **Añadir contenido**
   - Click en el botón "+" en el Dashboard
   - Selecciona el tipo (Película, Serie, Libro, Videojuego, Comic)
   - Rellena los detalles o busca en TMDB
   - Guarda y organiza

2. **Organizar por estados**
   - **Planificado**: Contenido que quieres ver/leer/jugar
   - **En Progreso**: Actualmente consumiendo
   - **Completado**: Ya terminado
   - **En Espera**: Pausado temporalmente
   - **Abandonado**: No planeas continuar

3. **Calificar y reseñar**
   - Añade tu rating personal (1-10)
   - Escribe tu opinión en la sección de review
   - Compara con el rating de TMDB

---

## 🤝 Contribuciones y Uso

### ⚖️ Licencia y Derechos

Este proyecto está bajo una **Licencia de Uso Personal y No Comercial**. Ver el archivo [LICENSE](LICENSE) para más detalles.

#### ✅ Permitido:
- Usar para aprendizaje y educación
- Estudiar el código fuente
- Crear fork para experimentación personal
- Compartir con otros estudiantes

#### ❌ NO Permitido:
- Uso comercial o venta del software
- Redistribución como producto comercial
- Eliminar atribuciones o créditos
- Reclamar autoría del proyecto

### 👨‍💻 Sobre el Autor

**Illán Iglesias Torres**  
🎓 Estudiante de Ingeniería Informática  
💻 Apasionado por el desarrollo web y la experimentación  
🎨 Amante del diseño UI/UX elegante

Este proyecto es un experimento de "vibe coding" - creado siguiendo la inspiración del momento para resolver una necesidad personal real.

---

## 📚 Documentación Adicional

- [QUICKSTART.md](QUICKSTART.md) - Guía rápida de inicio
- [COMO-EJECUTAR.md](COMO-EJECUTAR.md) - Instrucciones detalladas de ejecución
- [MODO-INVITADO.md](MODO-INVITADO.md) - Documentación del modo invitado
- [INTEGRACION-TMDB.md](INTEGRACION-TMDB.md) - Guía de integración con TMDB
- [STRUCTURE.md](STRUCTURE.md) - Arquitectura detallada del proyecto

---

## 🐛 Problemas Conocidos y Soluciones

### Error: "Variables de entorno no configuradas"
**Solución**: Asegúrate de tener un archivo `.env` con las credenciales correctas.

### Error de autenticación con Supabase
**Solución**: Verifica que tu Project URL y Anon Key sean correctos.

### TMDB API no funciona
**Solución**: La API de TMDB es opcional. La app funciona sin ella, solo pierdes la búsqueda automática.

---

## 📄 Licencia

Copyright © 2025 Illán Iglesias Torres

Este proyecto está licenciado bajo una Licencia de Uso Personal y No Comercial.  
Ver el archivo [LICENSE](LICENSE) para más información.

---

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) - Por su increíble plataforma Backend-as-a-Service
- [TMDB](https://www.themoviedb.org/) - Por su API gratuita de datos de películas
- [React](https://react.dev/) - Por hacer el desarrollo UI un placer
- [Tailwind CSS](https://tailwindcss.com/) - Por el sistema de diseño perfecto

---

## 📞 Contacto

Para preguntas, sugerencias o consultas sobre el proyecto:

- 🐙 GitHub: [@illaniit](https://github.com/illaniit)
- 💼 LinkedIn: [Illán Iglesias Torres]

---

<div align="center">

**Hecho con ❤️ y ☕ por Illán Iglesias Torres**

_Un experimento de vibe coding convertido en realidad_

⭐ Si te gusta el proyecto, dale una estrella en GitHub

</div>
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
