# 🚀 Guía de Despliegue en Netlify

## Pasos para desplegar en Netlify

### 1. Preparar el Repositorio Git

Primero, inicializa git en tu proyecto (si no lo has hecho):

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Subir a GitHub

Crea un repositorio en GitHub y súbelo:

```bash
git remote add origin https://github.com/tu-usuario/media-tracker.git
git branch -M main
git push -u origin main
```

### 3. Conectar con Netlify

**Opción A: Desde Netlify Dashboard (Recomendado)**

1. Ve a [netlify.com](https://netlify.com) e inicia sesión
2. Click en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub** y autoriza Netlify
4. Busca tu repositorio `media-tracker`
5. Configuración de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click en **"Deploy site"**

**Opción B: Usando Netlify CLI**

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login en Netlify
netlify login

# Desplegar
netlify deploy --prod
```

### 4. Configurar Variables de Entorno

⚠️ **MUY IMPORTANTE**: Debes configurar las variables de entorno de Supabase en Netlify

1. En tu dashboard de Netlify, ve a **Site settings** → **Environment variables**
2. Añade las siguientes variables:
   - `VITE_SUPABASE_URL`: Tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase

3. **Obtener las credenciales de Supabase**:
   - Ve a [supabase.com](https://supabase.com)
   - Abre tu proyecto
   - Ve a **Settings** → **API**
   - Copia:
     - **Project URL** → `VITE_SUPABASE_URL`
     - **anon public** → `VITE_SUPABASE_ANON_KEY`

### 5. Re-desplegar

Después de añadir las variables de entorno:
- Ve a **Deploys** → Click en **"Trigger deploy"** → **"Deploy site"**

### 6. ¡Listo! 🎉

Tu aplicación estará disponible en una URL como:
```
https://your-site-name.netlify.app
```

## 📝 Notas Importantes

### Actualizar la Base de Datos

Asegúrate de que tu base de datos de Supabase tenga el campo `review`:

```sql
-- Añadir columna review si no existe
ALTER TABLE media_items 
ADD COLUMN IF NOT EXISTS review TEXT;
```

### Configurar CORS en Supabase

En Supabase, ve a **Authentication** → **URL Configuration** y añade tu URL de Netlify a las URLs permitidas.

### Despliegue Automático

Netlify desplegará automáticamente cada vez que hagas push a tu repositorio de GitHub.

## 🔧 Comandos Útiles

```bash
# Probar el build localmente
npm run build

# Preview local del build
npm run preview

# Ver logs de Netlify
netlify logs

# Abrir dashboard de Netlify
netlify open
```

## 🐛 Solución de Problemas

### Error: "Failed to load module"
- Verifica que las variables de entorno estén configuradas correctamente
- Re-despliega después de añadir variables de entorno

### Error: "404 on page refresh"
- Verifica que `netlify.toml` esté en la raíz del proyecto
- El archivo debe tener la configuración de redirects

### Error de Autenticación
- Verifica las credenciales de Supabase
- Asegúrate de que la URL de Netlify esté en las URLs permitidas de Supabase

## 📚 Recursos

- [Documentación de Netlify](https://docs.netlify.com)
- [Documentación de Supabase](https://supabase.com/docs)
- [Vite en Netlify](https://vitejs.dev/guide/static-deploy.html#netlify)
