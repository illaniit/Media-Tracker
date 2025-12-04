# 🔌 Ejemplos de Uso de la API - Media Tracker

Guía práctica con ejemplos de código para usar las funciones API de Supabase.

## 📚 Índice

1. [Autenticación](#autenticación)
2. [Gestión de Media Items](#gestión-de-media-items)
3. [Gestión de Temporadas](#gestión-de-temporadas)
4. [Gestión de Perfiles](#gestión-de-perfiles)

---

## 🔐 Autenticación

### Registrar Usuario

```typescript
import { authApi } from './lib/supabase/api';

const handleRegister = async () => {
  const { data, error } = await authApi.signUp(
    'usuario@email.com',
    'password123',
    'nombre_usuario'
  );

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Usuario creado:', data.user);
    // Automáticamente se crea un perfil en la tabla profiles
  }
};
```

### Iniciar Sesión

```typescript
const handleLogin = async () => {
  const { data, error } = await authApi.signIn(
    'usuario@email.com',
    'password123'
  );

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Sesión iniciada:', data.session);
  }
};
```

### Cerrar Sesión

```typescript
const handleLogout = async () => {
  const { error } = await authApi.signOut();
  
  if (!error) {
    console.log('Sesión cerrada');
  }
};
```

### Obtener Usuario Actual

```typescript
const checkUser = async () => {
  const { user, error } = await authApi.getCurrentUser();
  
  if (user) {
    console.log('Usuario actual:', user.email);
  }
};
```

---

## 🎬 Gestión de Media Items

### Obtener Todos los Items

```typescript
import { mediaApi } from './lib/supabase/api';

// Obtener todos
const { data, error } = await mediaApi.getMediaItems();

// Solo películas
const { data } = await mediaApi.getMediaItems('movie');

// Solo series
const { data } = await mediaApi.getMediaItems('series');

// Filtrar por status
const { data } = await mediaApi.getMediaItems(undefined, 'watching');
```

### Obtener Item por ID

```typescript
const { data, error } = await mediaApi.getMediaItemById('uuid-del-item');

if (data) {
  console.log('Título:', data.title);
  console.log('Temporadas:', data.seasons); // Si es serie
}
```

### Crear Película

```typescript
const { data, error } = await mediaApi.createMediaItem({
  title: 'Inception',
  type: 'movie',
  status: 'completed',
  rating: 9,
  poster_url: 'https://image.tmdb.org/t/p/w500/poster.jpg',
});

if (data) {
  console.log('Película creada:', data.id);
}
```

### Crear Serie (sin temporadas)

```typescript
const { data, error } = await mediaApi.createMediaItem({
  title: 'Breaking Bad',
  type: 'series',
  status: 'watching',
  rating: 10,
});

// Luego añadir temporadas usando seasonsApi
```

### Actualizar Item

```typescript
const { data, error } = await mediaApi.updateMediaItem('uuid-del-item', {
  status: 'completed',
  rating: 10,
});
```

### Eliminar Item

```typescript
const { error } = await mediaApi.deleteMediaItem('uuid-del-item');

if (!error) {
  console.log('Item eliminado (y sus temporadas si era serie)');
}
```

---

## 📺 Gestión de Temporadas

### Obtener Temporadas de una Serie

```typescript
import { seasonsApi } from './lib/supabase/api';

const { data, error } = await seasonsApi.getSeasonsByMediaId('uuid-de-serie');

if (data) {
  data.forEach(season => {
    console.log(`Temporada ${season.season_number}: ${season.episodes_watched}/${season.total_episodes}`);
  });
}
```

### Crear Una Temporada

```typescript
const { data, error } = await seasonsApi.createSeason({
  media_id: 'uuid-de-serie',
  season_number: 1,
  total_episodes: 13,
  episodes_watched: 0, // Opcional, default es 0
});
```

### Crear Múltiples Temporadas

```typescript
const { data, error } = await seasonsApi.createMultipleSeasons([
  {
    media_id: 'uuid-de-serie',
    season_number: 1,
    total_episodes: 13,
  },
  {
    media_id: 'uuid-de-serie',
    season_number: 2,
    total_episodes: 13,
  },
  {
    media_id: 'uuid-de-serie',
    season_number: 3,
    total_episodes: 13,
  },
]);

console.log(`${data?.length} temporadas creadas`);
```

### Incrementar Episodios Vistos

```typescript
const { data, error } = await seasonsApi.incrementEpisodesWatched('uuid-temporada');

if (data) {
  console.log(`Ahora has visto: ${data.episodes_watched}/${data.total_episodes}`);
  
  if (data.is_completed) {
    console.log('¡Temporada completada! 🎉');
  }
}
```

### Decrementar Episodios Vistos

```typescript
const { data, error } = await seasonsApi.decrementEpisodesWatched('uuid-temporada');
```

### Actualizar Temporada Manualmente

```typescript
const { data, error } = await seasonsApi.updateSeason('uuid-temporada', {
  episodes_watched: 7,
  total_episodes: 13, // Si cambió el total
});
```

### Eliminar Temporada

```typescript
const { error } = await seasonsApi.deleteSeason('uuid-temporada');
```

---

## 👤 Gestión de Perfiles

### Obtener Perfil Actual

```typescript
import { profileApi } from './lib/supabase/api';

const { data, error } = await profileApi.getCurrentProfile();

if (data) {
  console.log('Username:', data.username);
  console.log('Avatar:', data.avatar_url);
}
```

### Actualizar Perfil

```typescript
const { data, error } = await profileApi.updateProfile({
  username: 'nuevo_username',
  avatar_url: 'https://example.com/avatar.jpg',
});
```

---

## 🔗 Ejemplo Completo: Añadir Serie con Temporadas

```typescript
import { mediaApi, seasonsApi } from './lib/supabase/api';

const addSeriesComplete = async () => {
  try {
    // 1. Crear la serie
    const { data: series, error: seriesError } = await mediaApi.createMediaItem({
      title: 'Breaking Bad',
      type: 'series',
      status: 'watching',
      rating: 10,
      poster_url: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    });

    if (seriesError) throw seriesError;

    console.log('Serie creada:', series?.id);

    // 2. Añadir temporadas
    const { data: seasons, error: seasonsError } = await seasonsApi.createMultipleSeasons([
      { media_id: series!.id, season_number: 1, total_episodes: 7 },
      { media_id: series!.id, season_number: 2, total_episodes: 13 },
      { media_id: series!.id, season_number: 3, total_episodes: 13 },
      { media_id: series!.id, season_number: 4, total_episodes: 13 },
      { media_id: series!.id, season_number: 5, total_episodes: 16 },
    ]);

    if (seasonsError) throw seasonsError;

    console.log(`${seasons?.length} temporadas añadidas`);
    console.log('✅ Serie completa creada exitosamente');

  } catch (error: any) {
    console.error('Error:', error.message);
  }
};
```

---

## 🔍 Ejemplo Completo: Buscar y Actualizar

```typescript
const trackEpisode = async (seriesId: string, seasonNumber: number) => {
  try {
    // 1. Obtener la serie con sus temporadas
    const { data: series, error: seriesError } = await mediaApi.getMediaItemById(seriesId);
    
    if (seriesError || !series) throw new Error('Serie no encontrada');

    // 2. Encontrar la temporada específica
    const season = series.seasons?.find(s => s.season_number === seasonNumber);
    
    if (!season) throw new Error('Temporada no encontrada');

    // 3. Incrementar episodios vistos
    const { data: updatedSeason, error: updateError } = 
      await seasonsApi.incrementEpisodesWatched(season.id);

    if (updateError) throw updateError;

    // 4. Verificar si completó la temporada
    if (updatedSeason?.is_completed) {
      console.log(`🎉 ¡Completaste la temporada ${seasonNumber}!`);
      
      // Opción: Actualizar el estado de la serie si completó todo
      const allCompleted = series.seasons?.every(s => 
        s.id === season.id ? updatedSeason.is_completed : s.is_completed
      );

      if (allCompleted) {
        await mediaApi.updateMediaItem(seriesId, {
          status: 'completed'
        });
        console.log('🏆 ¡Serie completada!');
      }
    }

  } catch (error: any) {
    console.error('Error:', error.message);
  }
};

// Uso
trackEpisode('uuid-de-breaking-bad', 3);
```

---

## 🎯 Buenas Prácticas

### 1. Siempre Verificar Errores

```typescript
const { data, error } = await mediaApi.getMediaItems();

if (error) {
  console.error('Error:', error);
  // Mostrar mensaje al usuario
  return;
}

// Ahora puedes usar data con seguridad
console.log(data);
```

### 2. Loading States

```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const { data, error } = await mediaApi.getMediaItems();
    if (error) throw error;
    setItems(data || []);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### 3. Usar try-catch para Múltiples Operaciones

```typescript
const createFullSeries = async () => {
  try {
    const series = await createSeries();
    const seasons = await createSeasons(series.id);
    return { series, seasons };
  } catch (error) {
    console.error('Error creando serie:', error);
    throw error;
  }
};
```

---

## 📱 Uso en Componentes React

```typescript
import { useState, useEffect } from 'react';
import { mediaApi } from '../lib/supabase/api';

function MyComponent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const { data, error } = await mediaApi.getMediaItems();
    if (data) setItems(data);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

---

¡Estos ejemplos cubren todos los casos de uso principales de la API! 🚀
