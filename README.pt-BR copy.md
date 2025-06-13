![Formatpilot Banner](docs/assets/top_banner.png)

---

[![PyPI version](https://img.shields.io/pypi/v/formatpilot.svg)](https://pypi.org/project/formatpilot/)
[![Python versions](https://img.shields.io/pypi/pyversions/formatpilot.svg)](https://pypi.org/project/formatpilot/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/faelmori/formatpilot/actions/workflows/python-package.yml/badge.svg)](https://github.com/faelmori/formatpilot/actions)
[![Downloads](https://static.pepy.tech/badge/formatpilot)](https://pepy.tech/project/formatpilot)

> Conversão e transformação de textos entre múltiplos formatos (Markdown, LinkedIn, HTML, etc) de forma simples e extensível. Com amor da família Mori!

---

## ✨ Visão Geral

O **formatpilot** é um pacote Python para conversão e transformação de textos entre diversos formatos, como Markdown, HTML e formatos otimizados para LinkedIn. Ideal para desenvolvedores, criadores de conteúdo e automações.

- Conversão de Markdown para LinkedIn
- Conversão de Markdown para HTML
- Conversão de HTML para Markdown
- Conversão automática de links e emojis
- Conversão de tabelas Markdown para texto
- Aviso de limite de caracteres do LinkedIn
- Fácil extensão para novos formatos
- API simples e intuitiva

## 🚀 Instalação

```bash
pip install formatpilot
```

## 🛠️ Exemplos de Uso

### Markdown para LinkedIn

```python
from formatpilot import markdown_to_linkedin, FormatPilot

markdown = """
**Texto em negrito** e *itálico*
- Item 1
- Item 2
Veja mais em [GitHub](https://github.com)
:rocket:
"""

linkedin_text = markdown_to_linkedin(markdown)
print(linkedin_text)

# Ou usando a classe principal
fp = FormatPilot()
print(fp.convert_markdown_to_linkedin(markdown))
```

### Conversão de Tabelas Markdown

```python
from formatpilot import FormatPilot
markdown = """
| Nome   | Idade |
|--------|-------|
| Ana    | 30    |
| Bruno  | 25    |
"""
print(FormatPilot().convert_markdown_to_linkedin(markdown))
# Saída:
# Nome | Idade
# Ana | 30
# Bruno | 25
```

### Aviso de Limite de Caracteres

```python
from formatpilot import FormatPilot
texto_longo = "A" * 3100
print(FormatPilot().convert_markdown_to_linkedin(texto_longo))
# Saída inclui aviso de limite excedido
```

### Emojis Markdown para Unicode

```python
from formatpilot import FormatPilot
markdown = "Parabéns pelo projeto! :tada:"
print(FormatPilot().convert_markdown_to_linkedin(markdown))
# Saída: Parabéns pelo projeto! 🎉
```

## 📚 Funcionalidades

- `markdown_to_linkedin(markdown_text: str) -> str`: Converte Markdown para formato LinkedIn.
- Classe `LinkedInConverter`: Métodos para conversão entre Markdown, HTML e LinkedIn.

## 🧩 Extensibilidade

Você pode criar seus próprios conversores ou estender as classes existentes para suportar novos formatos de texto.

## 🧪 Testes

```bash
pytest tests/
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

1. Fork este repositório
2. Crie sua branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

MIT © Rafael Mori

## 💌 Contato

- [GitHub](https://github.com/faelmori/formatpilot)
- [faelmori@gmail.com](mailto:faelmori@gmail.com)

---

**Feito com carinho pela família Mori!** ❤️
