@echo off
title Nha Minh - Dev Server
cd /d "%~dp0"

echo Dang kiem tra thu vien...
if not exist node_modules (
    echo Chua co node_modules, dang chay npm install...
    call npm install
)

echo Dang khoi dong server...
start "Nha Minh Server" cmd /k "npm run dev"

echo Dang cho server khoi dong...
timeout /t 5 /nobreak >nul

start http://localhost:3000

exit
