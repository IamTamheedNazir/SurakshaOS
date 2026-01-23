# Fix API Environment Variables
# This script fixes the frontend API service to use correct Vite environment variables

Write-Host "Fixing API environment variables..." -ForegroundColor Cyan

$apiFile = "frontend/src/services/api.js"

if (Test-Path $apiFile) {
    # Read the file
    $content = Get-Content $apiFile -Raw
    
    # Fix environment variable syntax
    $content = $content -replace 'process\.env\.REACT_APP_API_URL', 'import.meta.env.VITE_API_URL'
    
    # Fix default API URL
    $content = $content -replace "http://localhost:5000/api", "http://localhost:8000/api"
    
    # Fix timeout
    $content = $content -replace "timeout: 10000, // 10 seconds", "timeout: import.meta.env.VITE_API_TIMEOUT || 30000"
    
    # Save the file
    $content | Set-Content $apiFile -NoNewline
    
    Write-Host "✅ Fixed: $apiFile" -ForegroundColor Green
    Write-Host ""
    Write-Host "Changes made:" -ForegroundColor Yellow
    Write-Host "  - Changed process.env.REACT_APP_API_URL to import.meta.env.VITE_API_URL" -ForegroundColor White
    Write-Host "  - Changed default URL from localhost:5000 to localhost:8000" -ForegroundColor White
    Write-Host "  - Changed timeout to use VITE_API_TIMEOUT" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. cd frontend" -ForegroundColor White
    Write-Host "  2. npm run build" -ForegroundColor White
    Write-Host "  3. Copy dist to package" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ Error: $apiFile not found!" -ForegroundColor Red
    Write-Host "Make sure you're in the repository root directory." -ForegroundColor Yellow
}
