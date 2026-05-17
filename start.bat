@echo off
echo ===================================================
echo FODE Student Management System - Startup Script
echo ===================================================
echo.

cd web-app

echo Installing dependencies (if required)...
call npm install

echo Syncing Database schema...
call npx prisma generate
call npx prisma db push

echo Seeding database with users...
call node scripts/seed.js

echo Building the application...
call npm run build

echo.
echo Starting the FODE SMS Web Application...
echo Please open your browser and navigate to http://localhost:3000
echo.
call npm run start
