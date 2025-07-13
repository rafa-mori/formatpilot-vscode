# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [0.1.0] - 2025-01-13

### ✨ Adicionado
- **Suporte ao uv**: Migração completa do pip para uv como gerenciador de pacotes Python
- **Interface melhorada**: Novos ícones, mensagens em português e melhor UX
- **Status em tempo real**: Barra de status mostra estado do ambiente Python
- **Configurações avançadas**: Opções para personalizar comportamento da extensão
- **Comandos extras**: Setup de ambiente e verificação de status
- **Detecção inteligente**: Melhores algoritmos para encontrar Python e dependências
- **Tratamento de erros robusto**: Melhor handling de erros e recuperação
- **Logs detalhados**: Canal de output para debugging

### 🔧 Melhorado
- **Detecção de Python**: Múltiplas estratégias de detecção (extensão Python, PATH, manual)
- **Performance**: Instalações mais rápidas com uv
- **Resiliência**: Melhor recuperação de falhas e estados inconsistentes
- **Documentação**: README detalhado com exemplos e troubleshooting

### 🐛 Corrigido
- **Escape de caracteres**: Melhor handling de aspas e caracteres especiais
- **Timeout**: Prevenção de travamentos em operações longas
- **Validação**: Verificação de caminhos e comandos antes da execução

### 🔄 Alterado
- **Pip → uv**: Migração completa para o moderno gerenciador de pacotes
- **Interface**: Textos em português e emojis para melhor experiência
- **Estrutura**: Código refatorado em classes para melhor manutenibilidade

## [0.0.1] - 2024-12-XX

### ✨ Inicial
- Conversão básica entre Markdown, LinkedIn e HTML
- Integração com pacote formatpilot Python
- Comando de contexto para texto selecionado
- Instalação automática de dependências via pip
