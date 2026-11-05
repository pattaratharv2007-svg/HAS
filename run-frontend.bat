@echo off
setlocal
echo ========================================================
echo  Starting CareLink MediSync Frontend (Vite React 3000)
echo ========================================================

cd /d "%~dp0frontend"
npm run dev
pause

