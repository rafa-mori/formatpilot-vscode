"""
Este módulo contém funções para formatar texto de acordo com as especificações do LinkedIn.
As funções incluem formatação de texto simples, Markdown e HTML, além de manipulações criativas de texto.
"""

from __future__ import annotations
from .converter import FormatPilot


class LinkedInFormatter:
    def __init__(self, creative: bool = False):
        self.converter = FormatPilot()
        self.creative = creative

    def creative_text_formatter(self, text: str) -> str:
        """
        Aplica transformações criativas ao texto fornecido.
        """
        # Exemplo de manipulação de texto:
        lines = text.splitlines()
        formatted_lines = []
        for line in lines:
            if line.strip():
                # Exemplo: adiciona contagem de palavras no início da linha
                words = line.split()
                formatted_lines.append(f"[{len(words)} words] {line}")
            else:
                formatted_lines.append(line)
        return "\n".join(formatted_lines)

    def format_text(self, text: str) -> str:
        """
        Formata o texto de acordo com as especificações.
        """
        return self.creative_text_formatter(text) if self.creative else text

    def format_markdown(self, markdown_text: str) -> str:
        """
        Formata o texto Markdown de acordo com as especificações.
        """
        converted = self.converter.convert_markdown_to_linkedin(markdown_text)
        return self.format_text(converted)

    def format_html(self, html_text: str) -> str:
        """
        Formata o texto HTML de acordo com as especificações.
        """
        converted = self.converter.convert_html_to_linkedin(html_text)
        return self.format_text(converted)

    def format_file(self, file_path: str, format_type: str = 'markdown') -> str:
        """
        Formata o texto de um arquivo de acordo com as especificações.
        """
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        if format_type == 'markdown':
            return self.format_markdown(content)
        elif format_type == 'html':
            return self.format_html(content)
        else:
            return self.format_text(content)
