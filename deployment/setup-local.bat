@echo off
REM Epicenter Local Development Setup Script

echo ========================================
echo Epicenter - Local Development Setup
echo ========================================

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker not found. Please install Docker Desktop.
    exit /b 1
)

echo Installing Docker Compose setup...

REM Create .env files if they don't exist
if not exist "backend\.env" (
    copy backend\.env.example backend\.env
    echo Created backend\.env
)

if not exist "frontend\.env.local" (
    copy frontend\.env.example frontend\.env.local
    echo Created frontend\.env.local
)

REM Start Docker Compose
echo Starting services with Docker Compose...
docker-compose -f deployment/docker-compose.yml up -d

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Services running:
echo - Backend:   http://localhost:3001
echo - Frontend:  http://localhost:3000
echo - Database:  localhost:5432
echo.
echo To view logs:
echo   docker-compose -f deployment/docker-compose.yml logs -f
echo.
echo To stop services:
echo   docker-compose -f deployment/docker-compose.yml down
echo.
