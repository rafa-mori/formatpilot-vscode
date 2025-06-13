# formatpilot

[![PyPI version](https://img.shields.io/pypi/v/formatpilot.svg)](https://pypi.org/project/formatpilot/)
[![Python versions](https://img.shields.io/pypi/pyversions/formatpilot.svg)](https://pypi.org/project/formatpilot/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/faelmori/formatpilot/actions/workflows/python-package.yml/badge.svg)](https://github.com/faelmori/formatpilot/actions)
[![Downloads](https://static.pepy.tech/badge/formatpilot)](https://pepy.tech/project/formatpilot)

> Conversion and transformation of texts between multiple formats (Markdown, LinkedIn, HTML, etc) in a simple and extensible way. With love from the Mori family!

---

## ✨ Overview

**formatpilot** is a Python package for converting and transforming texts between various formats, such as Markdown, HTML, and LinkedIn-optimized formats. Ideal for developers, content creators, and automations.

- Convert Markdown to LinkedIn
- Convert Markdown to HTML
- Convert HTML to Markdown
- Automatic conversion of links and emojis
- Convert Markdown tables to formatted text
- LinkedIn character limit warning
- Easily extensible for new formats
- Simple and intuitive API

## 🚀 Installation

```bash
pip install formatpilot
```

## 🛠️ Usage Examples

### Markdown to LinkedIn

```python
from formatpilot import markdown_to_linkedin, FormatPilot

markdown = """
**Bold text** and *italic*
- Item 1
- Item 2
See more at [GitHub](https://github.com)
:rocket:
"""

linkedin_text = markdown_to_linkedin(markdown)
print(linkedin_text)

# Or using the main class
fp = FormatPilot()
print(fp.convert_markdown_to_linkedin(markdown))
```

### Markdown Table Conversion

```python
from formatpilot import FormatPilot
markdown = """
| Name   | Age |
|--------|-----|
| Ana    | 30  |
| Bruno  | 25  |
"""
print(FormatPilot().convert_markdown_to_linkedin(markdown))
# Output:
# Name | Age
# Ana | 30
# Bruno | 25
```

### LinkedIn Character Limit Warning

```python
from formatpilot import FormatPilot
long_text = "A" * 3100
print(FormatPilot().convert_markdown_to_linkedin(long_text))
# Output includes limit warning
```

### Markdown Emojis to Unicode

```python
from formatpilot import FormatPilot
markdown = "Congratulations on the project! :tada:"
print(FormatPilot().convert_markdown_to_linkedin(markdown))
# Output: Congratulations on the project! 🎉
```

## 📚 Features

- `markdown_to_linkedin(markdown_text: str) -> str`: Converts Markdown to LinkedIn format.
- `FormatPilot` class: Methods for converting between Markdown, HTML, and LinkedIn.

## 🧩 Extensibility

You can create your own converters or extend the existing classes to support new text formats.

## 🧪 Testing

```bash
pytest tests/
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or pull requests.

1. Fork this repository
2. Create your branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

MIT © Rafael Mori

## 💌 Contact

- [GitHub](https://github.com/faelmori/formatpilot)
- [faelmori@gmail.com](mailto:faelmori@gmail.com)

---

**Made with love by the Mori family!** ❤️
