# 🤝 Guía de Contribución

¡Gracias por tu interés en Media Tracker! Este documento te guiará sobre cómo puedes usar y aprender del proyecto.

---

## 📜 Licencia y Uso

### ⚖️ Términos de Uso

Este proyecto está bajo una **Licencia de Uso Personal y No Comercial**. Antes de usar el código, por favor lee:

#### ✅ Puedes:
- Clonar el repositorio para aprendizaje personal
- Estudiar el código fuente y entender cómo funciona
- Ejecutar la aplicación localmente
- Modificar el código para experimentación propia
- Usar el proyecto como referencia en tu aprendizaje
- Hacer fork para tu uso personal

#### ❌ NO Puedes:
- Usar el proyecto comercialmente o con fines de lucro
- Vender o licenciar el software
- Redistribuir como producto propio
- Eliminar las atribuciones al autor original
- Reclamar autoría del código

### 🎓 Uso Educativo

Si eres estudiante o profesor:
- ✅ Puedes usar este proyecto como material de estudio
- ✅ Puedes referenciarlo en trabajos académicos
- ✅ Puedes presentarlo como ejemplo de buenas prácticas
- ⚠️ Siempre menciona la autoría: "Illán Iglesias Torres"

---

## 🐛 Reportar Problemas

### Issues de GitHub

Si encuentras un bug o tienes una sugerencia:

1. **Busca** si ya existe un issue similar
2. **Abre un nuevo issue** con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Screenshots si es visual
   - Tu entorno (OS, navegador, versión de Node)

**Ejemplo de buen issue:**
```markdown
## Descripción
El modal de añadir contenido no se cierra al hacer clic fuera.

## Pasos para reproducir
1. Abrir dashboard
2. Click en botón "+"
3. Hacer clic fuera del modal
4. El modal permanece abierto

## Entorno
- OS: Windows 11
- Navegador: Chrome 120
- Node: v20.10.0
```

---

## 💡 Sugerencias de Mejora

### Ideas Bienvenidas

Aunque el proyecto no acepta contribuciones directas de código, ¡tus ideas son valiosas!

**Cómo sugerir mejoras:**
1. Abre un issue con la etiqueta `enhancement`
2. Describe tu idea claramente
3. Explica por qué mejoraría la aplicación
4. Si tienes mockups o sketches, ¡compártelos!

---

## 🎨 Usando el Proyecto como Referencia

### Para Aprender

Este proyecto es ideal para aprender sobre:

#### 1. **React + TypeScript**
- Context API para gestión de estado
- Hooks personalizados (`useAuth`, `useGuest`)
- Componentes funcionales con TypeScript
- Props typing y interfaces

**Archivos clave:**
```
src/contexts/AuthContext.tsx
src/contexts/GuestContext.tsx
src/components/dashboard/Dashboard.tsx
```

#### 2. **Integración con Supabase**
- Autenticación
- Row Level Security (RLS)
- Operaciones CRUD
- Realtime subscriptions (potencial)

**Archivos clave:**
```
src/lib/supabase/supabaseClient.ts
src/lib/supabase/api.ts
supabase-schema.sql
```

#### 3. **Diseño con Tailwind CSS**
- Sistema de diseño consistente
- Responsive design
- Dark theme elegante
- Animaciones sutiles

**Archivos clave:**
```
src/index.css
tailwind.config.js
src/components/LandingPage.tsx
```

#### 4. **Arquitectura Frontend**
- Organización de carpetas
- Separación de responsabilidades
- Routing con React Router
- Lazy loading y code splitting

**Archivos clave:**
```
src/App.tsx
src/main.tsx
```

---

## 🏫 Proyectos Educativos Basados en Este

Si usas este proyecto como base para un trabajo educativo:

### Requisitos de Atribución

```markdown
Este proyecto está basado en [Media Tracker](https://github.com/illaniit/media-tracker)
Creado originalmente por Illán Iglesias Torres
Licencia: Uso Personal y No Comercial
```

### Ideas de Extensiones Educativas

Puedes crear tu propia versión modificada con:

1. **Diferentes tipos de contenido**
   - Podcasts, Música, Cursos online
   - Recetas de cocina
   - Lugares para visitar

2. **Nuevas funcionalidades**
   - Recomendaciones basadas en IA
   - Importar desde CSV
   - Exportar a PDF
   - Estadísticas avanzadas

3. **Diferentes estilos visuales**
   - Tema claro/oscuro toggle
   - Múltiples temas de color
   - Vista de lista vs grid
   - Animaciones avanzadas

4. **Otras integraciones**
   - Open Library API (para libros)
   - RAWG API (para videojuegos)
   - Spotify API (para música)

---

## 🔧 Setup para Desarrollo

Si quieres experimentar con el código:

### 1. Fork Personal (Recomendado)

```bash
# 1. Haz fork en GitHub (mantén privado si vas a añadir tus credenciales)
# 2. Clona TU fork
git clone https://github.com/TU_USUARIO/media-tracker.git
cd media-tracker

# 3. Añade el original como upstream
git remote add upstream https://github.com/illaniit/media-tracker.git

# 4. Instala dependencias
npm install

# 5. Configura tus variables de entorno
cp .env.example .env
# Edita .env con tus credenciales
```

### 2. Mantén tu Fork Actualizado

```bash
# Traer cambios del original
git fetch upstream
git merge upstream/main
```

### 3. Experimenta Libremente

```bash
# Crea ramas para tus experimentos
git checkout -b feature/mi-experimento

# Haz commits descriptivos
git commit -m "feat: Añadir filtro por año"

# Push a TU fork
git push origin feature/mi-experimento
```

---

## 📚 Recursos de Aprendizaje

### Documentación Oficial

- [React Docs](https://react.dev/) - La nueva documentación oficial
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Guía completa
- [Tailwind CSS](https://tailwindcss.com/docs) - Documentación interactiva
- [Supabase Docs](https://supabase.com/docs) - Tutoriales y guías

### Tutoriales Relacionados

- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/best-practices)
- [Supabase Auth Tutorial](https://supabase.com/docs/guides/auth)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)

### Videos Recomendados

Busca en YouTube:
- "React TypeScript Full Course"
- "Tailwind CSS Crash Course"
- "Supabase Full Stack App"
- "React Context API Tutorial"

---

## 🎯 Buenas Prácticas del Proyecto

Si te inspiras en este proyecto, observa estas prácticas:

### 1. Estructura de Archivos
```
✅ Organización por feature (auth/, dashboard/, media/)
✅ Separación de lógica (contexts/, lib/)
✅ Tipos centralizados (types.ts)
```

### 2. Nomenclatura
```typescript
✅ Componentes en PascalCase (Dashboard.tsx)
✅ Hooks con prefijo 'use' (useAuth.ts)
✅ Tipos con sufijo 'Type' (MediaType)
✅ Constantes en UPPER_CASE (TMDB_API_KEY)
```

### 3. TypeScript
```typescript
✅ Interfaces para props de componentes
✅ Types para uniones y tipos complejos
✅ Tipado estricto (no any a menos que sea necesario)
✅ Enums para valores fijos
```

### 4. Estilos
```typescript
✅ Tailwind para estilos (no CSS modules)
✅ Clases utilitarias composables
✅ Variables CSS para valores reutilizables
✅ Mobile-first approach
```

---

## 🚀 Roadmap y Futuras Ideas

Funcionalidades que podrían añadirse (¡inspírate!):

### Alta Prioridad
- [ ] Sistema de tags personalizados
- [ ] Búsqueda avanzada con filtros
- [ ] Importar/Exportar datos (JSON, CSV)
- [ ] Modo offline con Service Workers

### Media Prioridad
- [ ] Estadísticas y gráficos
- [ ] Compartir listas con otros usuarios
- [ ] Recomendaciones basadas en gustos
- [ ] Notificaciones de nuevos episodios

### Baja Prioridad
- [ ] Modo colaborativo (listas compartidas)
- [ ] Integración con redes sociales
- [ ] App móvil nativa (React Native)
- [ ] Extensión de navegador

---

## ❓ Preguntas Frecuentes

### ¿Puedo usar este código en mi portfolio?

Sí, pero:
- ✅ Menciona que es un fork/basado en Media Tracker
- ✅ Incluye atribución al autor original
- ✅ Indica qué modificaciones hiciste tú
- ❌ No lo presentes como completamente original

### ¿Puedo hacer una versión comercial?

No. El proyecto tiene licencia no comercial. Si tienes interés en uso comercial, contacta al autor.

### ¿Puedo enviar Pull Requests?

Por ahora, el proyecto no acepta PRs directos. Sin embargo:
- Puedes abrir issues con sugerencias
- Puedes hacer tu propio fork y experimentar
- El autor puede considerar ideas para versiones futuras

### ¿El autor ofrece mentoría o ayuda?

El proyecto es de código abierto para aprendizaje, pero el autor no puede garantizar soporte directo. Para dudas:
1. Revisa la documentación
2. Busca en issues existentes
3. Abre un nuevo issue si es necesario

---

## 🙏 Agradecimientos

Si este proyecto te ayudó a aprender:

- ⭐ Dale una estrella en GitHub
- 🐦 Comparte en redes sociales
- 📝 Escribe un blog post sobre lo que aprendiste
- 💬 Recomiéndalo a otros estudiantes

---

## 📞 Contacto

**Illán Iglesias Torres**

- GitHub: [@illaniit](https://github.com/illaniit)
- LinkedIn: [Illán Iglesias Torres](https://linkedin.com/in/illan-iglesias-torres)
- Email: Disponible en el perfil de GitHub

---

<div align="center">

**¡Gracias por tu interés en Media Tracker!**

_Hecho con ❤️ como experimento de vibe coding_

</div>
