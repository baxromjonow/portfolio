@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Sayt ochiladi: http://127.0.0.1:5000
py app.py
pause
