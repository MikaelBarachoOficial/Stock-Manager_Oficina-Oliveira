@echo off
cd /d "%~dp0"  REM Move to script directory

title Init_Server
color 3
cls
:: Enable delayed expansion
setlocal enabledelayedexpansion

:: Message to display
set "msg=MIKAEL_BARACHO_DEV"

:: Display each letter one by one (including spaces)
for /L %%i in (0,1,21) do (
    set "char=!msg:~%%i,1!"
    <nul set /p=!char!
    powershell -command "Start-Sleep -Milliseconds 10"
)

echo.

:: Start a simple Python HTTP server
echo Starting server...
timeout /t 4 >nul



:: Start Rick Astley ASCII animation in the background
start /b cmd /c curl ascii.live/rick

:: Wait for animation
timeout /t 5 >nul

:: Kill curl process to stop animation
taskkill /f /im curl.exe >nul 2>&1

:: Clear the screen
cls

:: Navigate to the Flask project directory
cd /d "C:\Users\Mikael\Desktop\dev\Oficina Oliveira Server\backend\src" || (
    echo ERROR: Path not found!
    pause
    exit /b
)

:: Start Flask server in a new window
start "Oficina Oliveira - Stock Manager - Server" py app.py
