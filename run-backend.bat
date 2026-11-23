@echo off
title KANJOO Backend Service (Spring Boot)
cd /d "%~dp0kanjoo-backend"
echo ===================================================
echo   Starting KANJOO Backend Service on port 8080...
echo   Working Directory: %CD%
echo ===================================================
if exist "target\kanjoo-backend-1.0.0-SNAPSHOT.jar" (
    echo Launching pre-built JAR package...
    java -jar target\kanjoo-backend-1.0.0-SNAPSHOT.jar
) else (
    echo Building and running with Maven...
    call mvn.cmd spring-boot:run
)
pause
