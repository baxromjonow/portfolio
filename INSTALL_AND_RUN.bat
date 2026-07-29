@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo BW Portfolio o'rnatilmoqda...
echo ========================================

py -m pip install -r requirements.txt
if errorlevel 1 goto error

call npm install
if errorlevel 1 goto error

call npm run build
if errorlevel 1 goto error

echo.
echo ========================================
echo Tayyor. Sayt ochiladi: http://127.0.0.1:5000
echo ========================================
py app.py
pause
exit /b

:error
echo.
echo O'rnatishda xatolik yuz berdi.
pause
