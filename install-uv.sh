#!/bin/bash
# Script de instalação do FormatPilot usando uv
# Para ser usado como referência pela extensão

set -e

echo "🚀 Configurando FormatPilot com uv..."

# Verifica se Python está disponível
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.7+"
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"

# Instala uv se não estiver disponível
if ! command -v uv &> /dev/null; then
    echo "📦 Instalando uv..."
    python3 -m pip install uv
    echo "✅ uv instalado com sucesso"
else
    echo "✅ uv já está disponível: $(uv --version)"
fi

# Instala formatpilot usando uv
echo "📦 Instalando formatpilot..."
uv pip install formatpilot

echo "✅ FormatPilot configurado com sucesso!"
echo "🎯 Pronto para usar na extensão VS Code"
