@echo off
title Launch KANJOO 2.0 Global Platform
echo ===================================================
echo   Launching KANJOO 2.0 Platform (Full-Stack)
echo ===================================================
echo.
echo 1. Launching Backend in new window...
start "KANJOO-Backend" cmd /k "%~dp0run-backend.bat"
echo.
echo 2. Launching Frontend in new window...
start "KANJOO-Frontend" cmd /k "%~dp0run-frontend.bat"
echo.
echo 3. Opening browser at http://localhost:3000 in 5 seconds...
timeout /t 5 /nobreak >nul
start http://localhost:3000
echo.
echo KANJOO is up and running!
pause
