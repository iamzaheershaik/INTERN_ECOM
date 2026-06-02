# Start E-Commerce MERN Stack (Backend and Frontend) concurrently
Write-Host "[*] Launching Intern Ecom servers..." -ForegroundColor Purple

# Start Backend Server
Write-Host "[+] Starting Node.js/Express Backend on Port 5000..." -ForegroundColor Violet
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend; npm install; npm run dev"

# Start Frontend Dev Server
Write-Host "[+] Starting Vite/React Frontend on Port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Frontend/vite-project; npm install; npm run dev"

Write-Host "[!] Both servers have been launched in separate terminals!" -ForegroundColor Green
Write-Host "--> Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "--> Backend:  http://localhost:5000" -ForegroundColor Green
