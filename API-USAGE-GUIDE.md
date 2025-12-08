# 🎯 Guía de Uso de APIs - Media Tracker

## 📖 Resumen Ejecutivo

Las integraciones de APIs transforman Media Tracker en una experiencia mucho más cómoda, permitiéndote buscar y añadir contenido con solo escribir el nombre. Sin embargo, **todas las APIs son completamente opcionales** - la aplicación funciona perfectamente sin ellas.

---

## 🎬 TMDB - Películas y Series

### ¿Qué es TMDB?

The Movie Database (TMDB) es la base de datos de películas y series más completa y gratuita disponible. Es usada por aplicaciones como Plex, Kodi, y Jellyfin.

### ¿Qué datos proporciona?

Cuando buscas una película o serie:
- ✅ Título oficial
- ✅ Póster de alta calidad
- ✅ Descripción completa (sinopsis)
- ✅ Fecha de estreno / Año
- ✅ Rating promedio (0-10)
- ✅ Géneros
- ✅ Idioma original

### Ejemplo de uso:

1. Selecciona "Película" o "Serie" en el modal
2. Escribe "The Matrix" en el buscador
3. Aparecen resultados con pósters
4. Click en el resultado deseado
5. Todos los campos se rellenan automáticamente
6. Solo añade tu estado, rating personal y review

### Rate Limits:

- **40 peticiones cada 10 segundos**
- Más que suficiente para uso personal
- El debouncing evita peticiones innecesarias

---

## 🎮 IGDB - Videojuegos

### ¿Qué es IGDB?

Internet Game Database es la API oficial de Twitch para información de videojuegos. Tiene datos de prácticamente todos los juegos existentes.

### ¿Qué datos proporciona?

Cuando buscas un videojuego:
- ✅ Nombre del juego
- ✅ Portada/Cover art
- ✅ Descripción completa
- ✅ Fecha de lanzamiento
- ✅ Rating de críticos (convertido a escala 1-10)
- ✅ Géneros
- ✅ Plataformas (PS5, Xbox, PC, Switch, etc.)
- ✅ Desarrolladora

### Ejemplo de uso:

1. Selecciona "Videojuego" en el modal
2. Escribe "Zelda Breath of the Wild"
3. Aparecen resultados con covers
4. Click en el resultado
5. Datos autocompletados
6. Añade tu progreso y review personal

### Rate Limits:

- **4 peticiones por segundo**
- Token OAuth generado automáticamente
- Se renueva cada 60 días

### ⚠️ Consideración de Seguridad:

IGDB requiere un `Client Secret` que es sensible. En desarrollo local puedes usarlo directamente, pero para producción deberías:

```typescript
// Recomendado para producción: Proxy backend
// Backend (Node.js/Express ejemplo)
app.get('/api/games/search', async (req, res) => {
  const { query } = req.query;
  const token = await getIGDBToken(
    process.env.IGDB_CLIENT_ID,
    process.env.IGDB_CLIENT_SECRET
  );
  const results = await searchGames(token, query);
  res.json(results);
});
```

---

## 📚 ComicVine - Cómics

### ¿Qué es ComicVine?

ComicVine es una base de datos masiva de cómics mantenida por Giant Bomb. Incluye cómics americanos, manga, novelas gráficas y más.

### ¿Qué datos proporciona?

Cuando buscas un cómic:
- ✅ Nombre del volumen
- ✅ Portada
- ✅ Descripción (limpiada de HTML)
- ✅ Año de inicio
- ✅ Editorial/Publisher
- ✅ Número de issues (números publicados)

### Ejemplo de uso:

1. Selecciona "Comic" en el modal
2. Escribe "Amazing Spider-Man"
3. Aparecen resultados con portadas
4. Click en el resultado
5. Datos autocompletados
6. Añade tu progreso de lectura

### Rate Limits:

- **200 peticiones por hora**
- **1 petición por segundo**
- Más limitado que las otras APIs
- El debouncing ayuda a respetar límites

---

## 💡 Mejores Prácticas

### 1. Usa el Debouncing

La búsqueda espera 500ms después de que dejes de escribir antes de hacer la petición. Esto:
- ✅ Reduce peticiones innecesarias
- ✅ Respeta los rate limits
- ✅ Mejora la experiencia (menos resultados fluctuantes)

### 2. Búsquedas Específicas

Cuanto más específico seas, mejores resultados:

❌ Mal: "matrix"
✅ Bien: "The Matrix 1999"

❌ Mal: "zelda"
✅ Bien: "Zelda Breath of the Wild"

### 3. Revisa los Datos Autocompletados

Aunque las APIs son muy precisas, siempre revisa:
- ¿Es la versión correcta? (remakes, reboots)
- ¿El año es correcto?
- ¿Los géneros son apropiados para ti?

### 4. Personaliza Después

Los datos de las APIs son "objetivos". Añade tu toque personal:
- Tu rating puede diferir del promedio
- Añade tu propia review con tus opiniones
- Cambia géneros si no te convencen

---

## 🔧 Troubleshooting

### "Error al buscar. Verifica tu configuración de API"

**Causa**: La API no está configurada o las credenciales son incorrectas.

**Solución**:
```bash
# 1. Verifica que tu .env existe
ls .env

# 2. Verifica que las keys están configuradas
cat .env | grep VITE_TMDB_API_KEY

# 3. Reinicia el servidor de desarrollo
npm run dev
```

### "429 Too Many Requests"

**Causa**: Has excedido el rate limit.

**Solución**:
- Espera unos segundos antes de buscar de nuevo
- No busques demasiado rápido
- Verifica que no tienes múltiples instancias ejecutándose

### "IGDB OAuth Error"

**Causa**: Client ID o Secret incorrectos.

**Solución**:
1. Ve a [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. Verifica tu aplicación
3. Regenera el Client Secret si es necesario
4. Actualiza tu `.env`

### Los resultados no coinciden con mi búsqueda

**Causa**: Búsqueda demasiado genérica o base de datos incompleta.

**Solución**:
- Sé más específico en la búsqueda
- Incluye el año si hay múltiples versiones
- Si no encuentras el contenido, añádelo manualmente

---

## 📊 Comparativa: Con API vs Sin API

### Sin Configurar APIs

```
Añadir "The Witcher 3"
1. Click en "+" para añadir contenido
2. Seleccionar "Videojuego"
3. Escribir "The Witcher 3" manualmente
4. Buscar portada en Google
5. Copiar URL de la imagen
6. Escribir descripción manualmente
7. Añadir año manualmente
8. Seleccionar géneros de la lista
9. Guardar

Tiempo: ~5 minutos
```

### Con IGDB Configurado

```
Añadir "The Witcher 3"
1. Click en "+" para añadir contenido
2. Seleccionar "Videojuego"
3. Escribir "Witcher 3" en el buscador
4. Click en el resultado
5. [Todos los datos ya están rellenados]
6. Añadir estado y rating personal
7. Guardar

Tiempo: ~30 segundos
```

**Diferencia**: 90% menos tiempo ⚡

---

## 🎓 Casos de Uso Reales

### Caso 1: Maratón de Marvel

```
Quiero añadir todas las películas de Marvel en orden cronológico.

Con TMDB:
1. Busco "Iron Man 2008" → click → guardar
2. Busco "Incredible Hulk" → click → guardar
3. Busco "Iron Man 2" → click → guardar
... y así sucesivamente

Tiempo para 30 películas: ~15 minutos
Sin TMDB: ~2-3 horas
```

### Caso 2: Lista de Juegos de Steam

```
Tengo 100 juegos en Steam que quiero trackear.

Con IGDB:
- Búsqueda rápida de cada juego
- Datos precisos automáticamente
- Solo añado mi progreso personal

Tiempo estimado: 30-45 minutos
Sin IGDB: 4-5 horas
```

### Caso 3: Colección de Manga

```
Quiero registrar toda mi colección física de manga.

Con ComicVine:
- Busco cada volumen
- Portadas oficiales
- Información de editorial

Tiempo para 50 volúmenes: ~20 minutos
Sin ComicVine: 1-2 horas
```

---

## 🚀 Recomendaciones Finales

### Para Usuarios Casuales

Si solo añades contenido ocasionalmente:
- ⚡ Configura al menos TMDB (más fácil)
- ⏭️ Puedes saltarte IGDB y ComicVine

### Para Power Users

Si vas a añadir mucho contenido:
- ✅ Configura las 3 APIs
- ✅ El tiempo ahorrado vale totalmente la pena
- ✅ Experiencia mucho más fluida

### Para Desarrollo

Si estás desarrollando o experimentando:
- 🔧 Configura todas las APIs para probar
- 🔒 Lee bien las secciones de seguridad
- 📖 Consulta documentación oficial de cada API

---

## 🔗 Enlaces Útiles

- [TMDB API Docs](https://developers.themoviedb.org/3)
- [IGDB API Docs](https://api-docs.igdb.com/)
- [ComicVine API Docs](https://comicvine.gamespot.com/api/documentation)
- [Guía de Configuración](./API-KEYS-GUIDE.md)
- [Guía de Seguridad](./SECURITY.md)

---

**¿Preguntas?** Consulta la documentación oficial de cada API o abre un issue en GitHub.

**Creado por Illán Iglesias Torres** 🎮
