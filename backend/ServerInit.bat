@echo off
cd /d "%~dp0"  REM Move to script directory

title Oficina Oliveira - Stock Manager
color 4
cls
setlocal enabledelayedexpansion

:: Mensagem animada
set "msg=MIKAEL_BARACHO_DEV"
for /L %%i in (0,1,21) do (
    set "char=!msg:~%%i,1!"
    <nul set /p=!char!
    powershell -command "Start-Sleep -Milliseconds 10"
)
echo.

:: Mensagem de inicialização
echo Starting server...
timeout /t 2 >nul

:: Verifica se o caminho do projeto existe
cd /d "C:\Program Files (x86)\OficinaOliveira\" || (
    echo ERROR: Path not found!
    pause
    exit /b
)

:: Ativa o ambiente virtual
call .venv\Scripts\activate || (
    echo ERROR: Failed to activate virtual environment!
    pause
    exit /b
)

cd src

:: Exibe uma mensagem antes de iniciar o servidor
echo Server is starting, please wait...

color 3

:: Opcional: Exibe uma animação ASCII divertida
if exist "C:\Windows\System32\curl.exe" (
    start /b cmd /c curl -s ascii.live/rick
    timeout /t 4 >nul
    taskkill /f /im curl.exe >nul 2>&1
) else (
    echo (No ASCII animation, curl not found)
)

:: Inicia o servidor Flask com logs
start "Oficina Oliveira - Stock Manager - Server" /min pythonw run.py