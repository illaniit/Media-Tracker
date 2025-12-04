# Script de configuración automática para Media Tracker
# Ejecuta este script con: .\setup.ps1

Write-Host "🚀 Configurando Media Tracker..." -ForegroundColor Cyan
Write-Host ""

# Verificar que Node.js esté instalado
Write-Host "✓ Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Node.js no está instalado" -ForegroundColor Red
    Write-Host "   Descárgalo desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "  Node.js $nodeVersion detectado" -ForegroundColor Green
Write-Host ""

# Verificar que npm esté instalado
Write-Host "✓ Verificando npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: npm no está instalado" -ForegroundColor Red
    exit 1
}
Write-Host "  npm $npmVersion detectado" -ForegroundColor Green
Write-Host ""

# Verificar que el archivo .env existe
Write-Host "✓ Verificando archivo .env..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -like "*tu-proyecto*" -or $envContent -like "*tu-anon-key*") {
        Write-Host "⚠️  ADVERTENCIA: El archivo .env contiene valores de ejemplo" -ForegroundColor Yellow
        Write-Host "   Necesitas configurar tus credenciales de Supabase en el archivo .env" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   1. Ve a https://supabase.com" -ForegroundColor Cyan
        Write-Host "   2. Crea un proyecto nuevo" -ForegroundColor Cyan
        Write-Host "   3. Ejecuta el script SQL de 'supabase-schema.sql'" -ForegroundColor Cyan
        Write-Host "   4. Copia tus credenciales en el archivo .env" -ForegroundColor Cyan
        Write-Host ""
        $continuar = Read-Host "¿Deseas continuar de todos modos? (s/n)"
        if ($continuar -ne "s") {
            Write-Host "Configuración cancelada." -ForegroundColor Red
            exit 0
        }
    } else {
        Write-Host "  Archivo .env configurado correctamente" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Error: El archivo .env no existe" -ForegroundColor Red
    Write-Host "   Por favor, crea el archivo .env con tus credenciales de Supabase" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
Write-Host "   (Esto puede tomar unos minutos)" -ForegroundColor Gray
Write-Host ""
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Asegúrate de haber ejecutado el script SQL en Supabase" -ForegroundColor White
Write-Host "   2. Verifica que el archivo .env tenga tus credenciales reales" -ForegroundColor White
Write-Host "   3. Ejecuta: npm run dev" -ForegroundColor White
Write-Host "   4. Abre http://localhost:5173 en tu navegador" -ForegroundColor White
Write-Host ""
Write-Host "🎉 ¡Listo para comenzar!" -ForegroundColor Green
Write-Host ""

# Preguntar si desea ejecutar el servidor
$ejecutar = Read-Host "¿Deseas iniciar el servidor de desarrollo ahora? (s/n)"
if ($ejecutar -eq "s") {
    Write-Host ""
    Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Cyan
    Write-Host ""
    npm run dev
}
