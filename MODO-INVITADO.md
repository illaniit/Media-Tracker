# Modo Invitado - Media Tracker

## 📋 Resumen

Se ha implementado un sistema completo de **modo invitado** que permite a los usuarios probar la aplicación sin necesidad de registro. Los datos del modo invitado se almacenan en `localStorage` del navegador.

---

## ✨ Características Implementadas

### 1. **Landing Page (`LandingPage.tsx`)**
- **Ubicación**: Nueva página principal en la ruta `/`
- **Contenido**:
  - Hero section con logo y descripción de la aplicación
  - Grid de iconos representando los tipos de media (Películas, Series, Libros, Videojuegos, Comics)
  - 3 botones de llamada a la acción:
    - **Probar como Invitado** → `/guest`
    - **Iniciar Sesión** → `/login`
    - **Crear Cuenta** → `/register`
  - Sección de características principales
  - Aviso sobre la persistencia de datos en modo invitado
  - Footer con atribución al creador: **Illán Iglesias Torres**
    - Descripción: Estudiante de ingeniería informática
    - Proyecto: Experimento de "vibe coding"
    - Enlaces sociales (GitHub, LinkedIn, Email)

### 2. **Sistema de Contexto para Invitados (`GuestContext.tsx`)**
- **Gestión de estado**: Hook personalizado `useGuest()`
- **Almacenamiento**: `localStorage` con las claves:
  - `media-tracker-guest-data`: Array de MediaItems
  - `media-tracker-guest-mode`: Boolean indicando si está en modo invitado
- **Funciones disponibles**:
  - `isGuest`: Boolean que indica si el usuario está en modo invitado
  - `guestData`: Array de MediaItems del invitado
  - `addGuestItem()`: Añade un nuevo item al array
  - `updateGuestItem()`: Actualiza un item existente
  - `deleteGuestItem()`: Elimina un item
  - `getGuestItemById()`: Obtiene un item por su ID
  - `clearGuestData()`: Limpia todos los datos de invitado
  - `setGuestMode()`: Activa/desactiva el modo invitado
- **Activación automática**: Se activa automáticamente al acceder a `/guest`

### 3. **Banner de Advertencia (`GuestWarningBanner.tsx`)**
- **Ubicación**: Se muestra en la parte superior del Dashboard cuando el usuario está en modo invitado
- **Diseño**: Banner con tema amber (dorado) para llamar la atención
- **Funcionalidad**:
  - Icono de advertencia (AlertCircle)
  - Mensaje explicando que los datos no persisten al cerrar el navegador
  - Botón "Crear Cuenta" para registrarse
  - Botón "X" para cerrar el banner (dismissible)
- **Características**:
  - Recordatorio sobre la temporalidad de los datos
  - CTA (Call To Action) para convertir usuarios invitados en registrados

### 4. **Dashboard Mejorado**
- **Detección automática** del modo invitado
- **Carga de datos**:
  - Si `isGuest === true`: Carga datos de `guestData` (localStorage)
  - Si `isGuest === false`: Carga datos de Supabase (API)
- **Interfaz adaptada**:
  - Muestra "Modo Invitado 👋" en lugar del email del usuario
  - Botón adicional "Inicio" para volver a la landing page
  - Banner de advertencia visible solo para invitados
- **Navegación**:
  - Botón "Salir" redirige a `/` en modo invitado
  - Botón "Cerrar Sesión" funciona normalmente para usuarios autenticados

### 5. **Modal de Añadir Contenido Actualizado**
- **Lógica bifurcada**:
  - **Modo invitado**: Guarda en localStorage usando `addGuestItem()`
  - **Usuario autenticado**: Guarda en Supabase usando `mediaApi.createMediaItem()`
- **Limitaciones en modo invitado**:
  - No se guardan temporadas de series separadamente (se podría añadir como metadata en el futuro)
  - Funcionalidad completa para películas, libros, videojuegos y comics

### 6. **Vista de Detalle Mejorada**
- **Carga de datos**:
  - **Modo invitado**: Usa `getGuestItemById()` para obtener el item
  - **Usuario autenticado**: Usa `mediaApi.getMediaItemById()`
- **Operaciones CRUD**:
  - **Actualizar**: `updateGuestItem()` vs `mediaApi.updateMediaItem()`
  - **Eliminar**: `deleteGuestItem()` vs `mediaApi.deleteMediaItem()`
- **Navegación adaptada**:
  - Redirige a `/guest` al eliminar en modo invitado
  - Redirige a `/dashboard` al eliminar como usuario autenticado

### 7. **Rutas Actualizadas (`App.tsx`)**
```tsx
/ → LandingPage (nuevo)
/guest → Dashboard (modo invitado)
/login → Login
/register → Register
/dashboard → Dashboard (protegido, requiere autenticación)
/media/:id → MediaDetail (protegido, requiere autenticación)
* → Redirige a /
```

---

## 🎨 Diseño Visual

### Tema Consistente
- **Background**: Negro puro (`bg-black`)
- **Contenedores**: `bg-neutral-950`, `bg-neutral-900`
- **Bordes**: `border-neutral-800`, `border-neutral-700`
- **Texto**: Gradientes de `neutral-100` a `neutral-400`
- **Acentos**: Dorado (`amber-400`, `amber-500`, `amber-600`)
- **Efectos**:
  - Sombras sutiles con glow dorado (`shadow-amber-500/30`)
  - Transiciones rápidas (200-300ms)
  - Escalas sutiles en hover (1.01, 1.05)

### Landing Page
- Hero section con logo de película (`Film` icon)
- Título "Media Tracker" con gradiente dorado
- Grid de 5 iconos con efecto hover
- Botones con diferentes estilos:
  - **Invitado**: Dorado con gradiente
  - **Login**: Neutral con borde
  - **Registro**: Neutral sólido
- Cards de características con iconos
- Footer elegante con información del creador

---

## 💾 Persistencia de Datos

### Modo Invitado
- **Almacenamiento**: `localStorage` del navegador
- **Duración**: Persiste entre sesiones hasta que se limpie el caché/cookies
- **Limitaciones**:
  - Los datos se pierden si se limpia el navegador
  - Los datos NO están sincronizados entre dispositivos
  - Los datos NO están respaldados en la nube
  - No hay gestión de temporadas de series

### Usuario Autenticado
- **Almacenamiento**: Base de datos Supabase
- **Duración**: Permanente hasta que el usuario elimine su cuenta
- **Ventajas**:
  - Datos respaldados en la nube
  - Sincronización entre dispositivos
  - Gestión completa de temporadas de series
  - Seguridad y privacidad garantizadas

---

## 🔄 Flujo de Usuario

### Usuario Nuevo (Modo Invitado)
1. Accede a `/` → Ve la landing page
2. Click en "Probar como Invitado" → Redirige a `/guest`
3. `GuestContext` activa `isGuest = true`
4. Dashboard carga datos de `localStorage`
5. Puede añadir/editar/eliminar contenido
6. Los datos se guardan en `localStorage`
7. Ve banner de advertencia sobre persistencia
8. Puede crear cuenta en cualquier momento

### Usuario con Cuenta
1. Accede a `/` → Ve la landing page
2. Click en "Iniciar Sesión" → Redirige a `/login`
3. Inicia sesión con credenciales
4. `AuthContext` autentica al usuario
5. Redirige a `/dashboard` (protegido)
6. Dashboard carga datos de Supabase
7. Puede añadir/editar/eliminar contenido
8. Los datos se guardan en Supabase
9. No ve banner de advertencia

---

## 🚀 Ventajas de la Implementación

1. **Sin fricción**: Los usuarios pueden probar la app sin registrarse
2. **Conversión**: El banner de advertencia motiva a crear cuenta
3. **Experiencia completa**: El modo invitado tiene casi todas las funcionalidades
4. **Código limpio**: Lógica bifurcada bien organizada con contextos
5. **Consistencia**: El tema visual es idéntico en ambos modos
6. **Performance**: No hay llamadas a API innecesarias en modo invitado

---

## 📝 Atribución

**Creador**: Illán Iglesias Torres  
**Descripción**: Estudiante de ingeniería informática  
**Proyecto**: Experimento personal de "vibe coding"  

El proyecto es de código abierto y está disponible para aprendizaje y experimentación.

---

## 🛠️ Archivos Modificados/Creados

### Nuevos Archivos
- `src/components/LandingPage.tsx`
- `src/contexts/GuestContext.tsx`
- `src/components/dashboard/GuestWarningBanner.tsx`

### Archivos Modificados
- `src/App.tsx` - Nuevas rutas y providers
- `src/components/dashboard/Dashboard.tsx` - Soporte para modo invitado
- `src/components/dashboard/AddMediaModal.tsx` - Lógica bifurcada para guardar
- `src/components/media/MediaDetail.tsx` - CRUD con soporte para invitados

---

## 🔮 Mejoras Futuras Posibles

1. **Migración de datos**: Botón para migrar datos de invitado a cuenta nueva
2. **Temporadas en invitado**: Guardar metadata de temporadas en localStorage
3. **Exportar/Importar**: Permitir descargar datos en JSON
4. **Límites**: Limitar número de items en modo invitado
5. **Analytics**: Tracking de conversión de invitados a usuarios registrados
6. **Tutorial**: Guía interactiva para nuevos usuarios invitados

---

✅ **El modo invitado está completamente funcional y listo para usar.**
