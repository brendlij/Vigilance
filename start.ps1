# Start Frontend and Backend in parallel
Write-Host "🚀 Starting Vigilance..." -ForegroundColor Green
Write-Host ""

# Start Backend in separate process
Write-Host "📦 Starting Backend (Go)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; go run main.go"

# Wait a bit for backend to start
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "🎨 Starting Frontend (Vue + Vite)..." -ForegroundColor Cyan
& bun run dev

Write-Host ""
Write-Host "✅ Vigilance is running!" -ForegroundColor Green
Write-Host "Frontend:  http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend:   http://localhost:8080" -ForegroundColor Yellow
