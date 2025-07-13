# FormatPilot VS Code Extension

[![Version](https://img.shields.io/visual-studio-marketplace/v/formatpilot.formatpilot.svg)](https://marketplace.visualstudio.com/items?itemName=formatpilot.formatpilot)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/formatpilot.formatpilot.svg)](https://marketplace.visualstudio.com/items?itemName=formatpilot.formatpilot)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/formatpilot.formatpilot.svg)](https://marketplace.visualstudio.com/items?itemName=formatpilot.formatpilot)

> 🚀 **Converta texto selecionado entre múltiplos formatos (Markdown ↔ LinkedIn ↔ HTML) com gerenciamento inteligente de dependências usando uv**

![FormatPilot Banner](docs/assets/top_banner.png)

## ✨ Características

- 🔄 **Conversão rápida**: Markdown → LinkedIn, HTML → Markdown, Markdown → HTML
- ⚡ **uv Integration**: Usa o moderno gerenciador de pacotes Python `uv` para instalações rápidas
- 🛡️ **Auto-detecção**: Detecta automaticamente Python, uv e dependências
- 🎯 **Interface intuitiva**: Comando no menu de contexto e palette
- 📊 **Status em tempo real**: Barra de status mostra o estado do ambiente
- ⚙️ **Configurável**: Configurações flexíveis para diferentes ambientes

## 🚀 Instalação

1. Instale a extensão do VS Code Marketplace
2. Certifique-se de ter Python 3.7+ instalado
3. A extensão irá automaticamente:
   - Detectar seu ambiente Python
   - Instalar `uv` se não estiver disponível
   - Instalar o pacote `formatpilot` usando uv

## 🎯 Como Usar

### Conversão Rápida
1. **Selecione** o texto que deseja converter
2. **Clique com botão direito** → "🚀 FormatPilot: Convert Selected Text"
3. **Escolha** o formato de destino (LinkedIn/HTML/Markdown)
4. **Pronto!** O texto será convertido automaticamente

### Comandos Disponíveis

- `🚀 FormatPilot: Convert Selected Text` - Converte texto selecionado
- `⚙️ FormatPilot: Setup Environment` - Configura ambiente Python
- `🔍 FormatPilot: Check Status` - Verifica status do ambiente

## ⚙️ Configurações

Acesse as configurações via `File > Preferences > Settings` e busque por "FormatPilot":

```json
{
  "formatpilot.pythonPath": "",           // Caminho personalizado do Python
  "formatpilot.useUv": true,              // Usar uv em vez de pip
  "formatpilot.autoInstall": true,        // Instalar dependências automaticamente
  "formatpilot.showNotifications": true   // Mostrar notificações
}
```

## 🔧 Tecnologias

- **TypeScript**: Código da extensão
- **Python**: Engine de conversão (formatpilot)
- **uv**: Gerenciador de pacotes Python moderno
- **VS Code API**: Integração nativa

## 📋 Exemplos

### Markdown → LinkedIn
```markdown
**Texto em negrito** e *itálico*
- Item 1
- Item 2
Veja mais em [GitHub](https://github.com)
:rocket:
```

Resultado:
```
Texto em negrito e itálico
• Item 1
• Item 2
Veja mais em GitHub (https://github.com)
🚀
```

### Markdown → HTML
```markdown
# Título
**Negrito** e *itálico*
```

Resultado:
```html
<h1>Título</h1>
<p><strong>Negrito</strong> e <em>itálico</em></p>
```

## 🔍 Status da Extensão

A barra de status mostra o estado atual:
- 🚀 **FormatPilot: Ready** - Tudo configurado
- ⚠️ **FormatPilot: Setup Required** - Necessita configuração

Clique na barra de status para ver detalhes do ambiente.

## 🐛 Solução de Problemas

### Python não encontrado
1. Instale Python 3.7+ do [python.org](https://python.org)
2. Use `FormatPilot: Setup Environment` para configurar
3. Configure `formatpilot.pythonPath` manualmente se necessário

### uv não instalado
A extensão tentará instalar automaticamente, mas você pode instalar manualmente:
```bash
pip install uv
```

### FormatPilot não instalado
Use o comando `FormatPilot: Setup Environment` ou configure `formatpilot.autoInstall: true`.

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

MIT © Rafael Mori

## 💌 Contato

- [GitHub](https://github.com/faelmori/formatpilot)
- [Email](mailto:faelmori@gmail.com)

---

**Feito com carinho pela família Mori!** ❤️
