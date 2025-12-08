# 🔒 Guía de Seguridad - Media Tracker

## ⚠️ IMPORTANTE: ANTES DE SUBIR A GITHUB

Este documento te ayudará a asegurar que tu repositorio NO filtre información sensible.

---

## 🚫 Archivos que NUNCA Deben Estar en Git

### ❌ Archivos de Configuración con Credenciales

```bash
.env                    # Variables de entorno con tus keys
.env.local
.env.development
.env.production
.env.*.local

# Verificar que están en .gitignore
```

### ✅ Verificación Rápida

Ejecuta estos comandos ANTES de hacer commit:

```bash
# Ver qué archivos están siendo trackeados
git status

# Verificar que .env NO aparece en la lista
# Si aparece, ejecuta:
git rm --cached .env
```

---

## 🔐 Variables de Entorno Seguras

### Supabase Anon Key (✅ SEGURA para frontend)

La `VITE_SUPABASE_ANON_KEY` es segura para usar en aplicaciones frontend porque:
- Está diseñada para ser pública
- El acceso real está protegido por Row Level Security (RLS)
- Solo permite operaciones específicas configuradas en Supabase

**Ejemplo de uso seguro:**
```typescript
// ✅ Esto es SEGURO
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### ❌ NUNCA Expongas Estas Keys

```bash
# ❌ PELIGROSAS - NUNCA en Git o código público
SUPABASE_SERVICE_ROLE_KEY    # Acceso total a la base de datos
DATABASE_URL                  # Conexión directa a PostgreSQL
SECRET_KEY                    # Claves secretas de API
PRIVATE_KEY                   # Claves privadas de cualquier tipo
VITE_IGDB_CLIENT_SECRET      # Client Secret de IGDB (sensible)
```

### ⚠️ Keys Sensibles pero Menos Críticas

```bash
# ⚠️ Estas son más seguras pero evita exponerlas públicamente
VITE_TMDB_API_KEY            # API Key de TMDB
VITE_COMICVINE_API_KEY       # API Key de ComicVine
VITE_IGDB_CLIENT_ID          # Client ID de IGDB

# Aunque estas son relativamente seguras para frontend,
# es mejor mantenerlas privadas para evitar abuso
```

---

## 🛡️ Configuración de Row Level Security (RLS)

El proyecto usa RLS para proteger los datos. Verifica que esté activo:

```sql
-- Ejemplo de política RLS (ya incluida en supabase-schema.sql)
CREATE POLICY "Users can only see their own media items"
ON media_items FOR SELECT
USING (auth.uid() = user_id);
```

### ¿Qué protege RLS?

- ✅ Los usuarios solo ven SUS propios datos
- ✅ No pueden modificar datos de otros usuarios
- ✅ No pueden eliminar datos ajenos
- ✅ La Anon Key es inútil sin autenticación válida

---

## 📋 Checklist de Seguridad Antes de Git Push

Antes de hacer `git push`, verifica:

### 1. Archivos Excluidos
```bash
# ¿Está .env en .gitignore?
cat .gitignore | grep ".env"

# ¿Git está ignorando .env?
git check-ignore .env
# Debería mostrar: .env
```

### 2. Credenciales en Código
```bash
# Buscar posibles keys hardcodeadas
grep -r "supabase.*anon" src/
grep -r "VITE_" src/

# Si encuentras algo como esto, es MALO:
# const API_KEY = "abc123def456"  ❌
```

### 3. Historial de Git
```bash
# Ver si .env fue commiteado antes
git log --all --full-history -- .env

# Si aparece, necesitas limpiar el historial:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

---

## 🔍 Cómo Verificar que NO Filtraste Datos

### Después de Subir a GitHub

1. Ve a tu repositorio en GitHub
2. Usa la búsqueda del repo
3. Busca palabras clave:
   - `VITE_SUPABASE_URL`
   - `supabase.co`
   - `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` (inicio de JWT)
   - Tu email personal
   - Nombres de tus proyectos de Supabase

**Si encuentras algo:**
```bash
# 1. Elimina el archivo del historial (ver sección anterior)
# 2. Rota tus credenciales en Supabase
# 3. Sube los cambios limpios
```

---

## 🔄 Rotación de Credenciales (Si Expusiste Keys)

### Si accidentalmente subiste credenciales:

#### Paso 1: Resetear Anon Key en Supabase
1. Ve a tu proyecto en Supabase
2. Settings → API → Reset Anon Key
3. Copia la nueva key

#### Paso 2: Actualizar .env Local
```bash
# Actualiza tu .env con la nueva key
VITE_SUPABASE_ANON_KEY=nueva_key_aqui
```

#### Paso 3: Limpiar Historial de Git
```bash
# Eliminar archivo del historial
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Forzar push (CUIDADO: sobrescribe historial remoto)
git push origin --force --all
```

---

## 🎯 Buenas Prácticas

### ✅ Hacer

1. **Usar variables de entorno** para TODO lo sensible
2. **Revisar .gitignore** antes de cada commit
3. **Usar .env.example** como template (sin valores reales)
4. **Documentar** qué variables se necesitan
5. **Rotar keys** regularmente (cada 3-6 meses)

### ❌ NO Hacer

1. **Hardcodear credentials** en el código
2. **Commitear archivos .env** NUNCA
3. **Compartir keys** por email/chat sin cifrar
4. **Usar la misma key** en múltiples proyectos
5. **Ignorar warnings** de seguridad de GitHub

---

## 🚨 GitHub Secret Scanning

GitHub escanea automáticamente repositorios públicos buscando:
- API keys conocidas
- Tokens de acceso
- Credenciales de bases de datos
- Certificados privados

Si GitHub detecta algo:
1. Recibirás un email de alerta
2. Rota las credenciales INMEDIATAMENTE
3. Limpia el historial de Git

---

## 📚 Recursos Adicionales

- [Supabase Security Best Practices](https://supabase.com/docs/guides/security)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [API Keys Guide](./API-KEYS-GUIDE.md) - Guía completa de configuración de APIs
- [TMDB Terms of Use](https://www.themoviedb.org/terms-of-use)
- [IGDB API Documentation](https://api-docs.igdb.com/)

---

## 🔑 Manejo Seguro de API Keys Externas

### TMDB (The Movie Database)

✅ **Segura para frontend**: Sí, con limitaciones
- La API key puede estar en el código frontend
- TMDB permite esto para uso personal/educativo
- Respeta los rate limits (40 req/10s)

### IGDB (Internet Game Database)

⚠️ **Parcialmente segura**:
- `VITE_IGDB_CLIENT_ID`: Segura para frontend
- `VITE_IGDB_CLIENT_SECRET`: **Sensible, solo para backend**

🔒 **Recomendación para producción**:
```typescript
// ❌ MAL: Client Secret en frontend
const token = await getAccessToken(clientId, clientSecret);

// ✅ BIEN: Proxy backend
const games = await fetch('/api/igdb/search?query=zelda');
```

### ComicVine

✅ **Relativamente segura**: Sí
- La API key puede estar en frontend
- Limita peticiones para evitar bloqueos (200/hora)
- Usa rate limiting y caché

---

## 🆘 Qué Hacer Si Filtraste Credenciales

### Acción Inmediata (< 5 minutos)

1. **Rota las credenciales en Supabase**
   - Settings → API → Reset Anon Key

2. **Elimina el commit con las credenciales**
   ```bash
   git reset --hard HEAD~1
   git push --force
   ```

3. **Revisa los logs de acceso**
   - Supabase Dashboard → Logs
   - Busca actividad sospechosa

### Acción de Seguimiento (< 1 hora)

4. **Limpia el historial completo**
   - Usa `git filter-branch` (ver arriba)

5. **Actualiza tu .env local**
   - Con las nuevas credenciales

6. **Notifica si es necesario**
   - Si el proyecto tiene otros usuarios

---

## ✅ Verificación Final

Antes de considerarlo seguro:

- [ ] `.env` está en `.gitignore`
- [ ] `git status` NO muestra `.env`
- [ ] Búsqueda en GitHub NO encuentra credenciales
- [ ] `.env.example` solo tiene placeholders
- [ ] RLS está habilitado en todas las tablas
- [ ] No hay keys hardcodeadas en `src/`
- [ ] README.md menciona configuración segura

---

**Recuerda**: La seguridad es un proceso continuo, no un evento único.

**Mantén tus credenciales privadas. Mantén tu código público.** 🔒
