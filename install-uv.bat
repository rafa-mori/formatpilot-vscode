@echo off
REM Script de instalação do FormatPilot usando uv para Windows
REM Para ser usado como referência pela extensão

echo 🚀 Configurando FormatPilot com uv...

REM Verifica se Python está disponível
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python não encontrado. Por favor, instale Python 3.7+
    exit /b 1
)

echo ✅ Python encontrado
python --version

REM Instala uv se não estiver disponível
uv --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Instalando uv...
    python -m pip install uv
    echo ✅ uv instalado com sucesso
) else (
    echo ✅ uv já está disponível
    uv --version
)

REM Instala formatpilot usando uv
echo 📦 Instalando formatpilot...
uv pip install formatpilot

echo ✅ FormatPilot configurado com sucesso!
echo 🎯 Pronto para usar na extensão VS Code
pause
