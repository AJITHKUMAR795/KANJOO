@echo off
title KANJOO Frontend Cockpit (Next.js)
cd /d "%~dp0kanjoo-frontend"
echo ===================================================
echo   Starting KANJOO Next.js Frontend on port 3000...
echo   Working Directory: %CD%
echo ===================================================
call npm.cmd run dev
pause
