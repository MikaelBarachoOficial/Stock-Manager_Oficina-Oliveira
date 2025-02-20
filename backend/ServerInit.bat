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

color 3

:: Mensagem de inicialização
echo ------------------------------------
echo Starting server...
timeout /t 2 >nul

cls

color 2

echo MIKAEL BARACHO DEV
echo ------------------------------------
echo Oficina Oliveira - Stock Management
echo By Mikael_Baracho_Development
echo Server Ready to Run :D
echo ------------------------------------
echo Wait...

timeout /t 5 >nul

cls

echo MIKAEL BARACHO DEV
echo ------------------------------------
echo Server Started!

timeout /t 1 >nul
:: Verifica se o caminho do projeto existe
cd /d "C:\Program Files (x86)\OficinaOliveira\" || (
    echo ERROR: Path not found!
    pause
    exit /b
)

if not exist .venv\Scripts\activate (
    echo ERROR: Virtual environment not found!
    pause
    exit /b
)

call .venv\Scripts\activate || (
    echo ERROR: Failed to activate virtual environment!
    pause
    exit /b
)

cd src

powershell -WindowStyle Hidden -Command "Start-Process hypercorn -ArgumentList 'app:app --bind 0.0.0.0:81 --certfile \"C:\Program Files (x86)\OficinaOliveira\cert.pem\" --keyfile \"C:\Program Files (x86)\OficinaOliveira\key.pem\"'"





