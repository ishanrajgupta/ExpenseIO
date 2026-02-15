@echo off
REM Smart Expense & Budget Manager - Installation Script (Windows)
REM This script automates the setup process for local development

echo ==================================
echo Smart Expense ^& Budget Manager
echo Automated Installation Script
echo ==================================
echo.

REM Check if Node.js is installed
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js detected: %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm detected: v%NPM_VERSION%

REM Check if MongoDB is running (optional)
where mongod >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB detected
) else (
    echo [WARNING] MongoDB not detected locally
    echo           You can use MongoDB Atlas instead
)

echo.
echo ==================================
echo Installing Backend Dependencies
echo ==================================
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend installation failed
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed

echo.
echo ==================================
echo Installing Frontend Dependencies
echo ==================================
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend installation failed
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed

echo.
echo ==================================
echo Setting Up Environment Files
echo ==================================

REM Backend .env
cd ..\backend
if not exist .env (
    copy .env.example .env >nul
    echo [OK] Backend .env created
    echo [WARNING] Please edit backend\.env with your MongoDB URI and JWT secret
) else (
    echo [WARNING] Backend .env already exists
)

REM Frontend .env
cd ..\frontend
if not exist .env (
    copy .env.example .env >nul
    echo [OK] Frontend .env created
) else (
    echo [WARNING] Frontend .env already exists
)

cd ..

echo.
echo ==================================
echo Installation Complete! 🎉
echo ==================================
echo.
echo Next steps:
echo 1. Edit backend\.env with your MongoDB URI and JWT secret
echo 2. Start backend:  cd backend ^&^& npm run dev
echo 3. Start frontend: cd frontend ^&^& npm run dev
echo.
echo Default URLs:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:5000
echo.
echo For detailed setup instructions, see SETUP_GUIDE.md
echo For quick start, see QUICKSTART.md
echo.
echo Happy coding! 💻
echo.
pause
