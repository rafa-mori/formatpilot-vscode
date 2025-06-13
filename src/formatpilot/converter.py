"""
Este módulo contém funções para converter texto em Markdown e HTML para um formato compatível com LinkedIn.
As funções incluem a conversão de negrito para maiúsculas, remoção de itálico, formatação de listas e preservação de links.
"""

import mistune
import re

class FormatPilot:
    def __init__(self):
        # Inicializa o parser de Markdown
        self.markdown_parser = mistune.create_markdown()

    def convert_markdown_to_html(self, markdown_text: str) -> str:
        """
        Converte texto em Markdown para HTML.
        """
        try:
            return str(self.markdown_parser(markdown_text)).strip()
        except Exception as e:
            raise ValueError(f"Erro ao converter Markdown para HTML: {e}")

    def convert_html_to_markdown(self, html_text: str) -> str:
        """
        Converte texto em HTML para Markdown.
        """
        try:
            # Utiliza mistune para converter HTML para Markdown
            markdown = self.markdown_parser(html_text)
            return markdown.strip() if isinstance(markdown, str) else str(markdown).strip()
        except Exception as e:
            raise ValueError(f"Erro ao converter HTML para Markdown: {e}")
    
    def convert_markdown_to_linkedin(self, markdown_text: str) -> str:
        """
        Converte texto em Markdown para um formato compatível com LinkedIn.
        """
        html = self.convert_markdown_to_html(markdown_text)
        return self._convert_html_to_linkedin(html)

    def convert_html_to_linkedin(self, html_text: str) -> str:
        """
        Converte texto em HTML para um formato compatível com LinkedIn.
        """
        return self._convert_html_to_linkedin(html_text)

    def convert_text_to_linkedin(self, text: str, format_type: str = 'markdown') -> str:
        """
        Converte texto para um formato compatível com LinkedIn, dependendo do tipo de formatação.
        
        :param text: Texto a ser convertido.
        :param format_type: Tipo de formatação ('markdown' ou 'html').
        :return: Texto convertido.
        """
        if format_type == 'markdown':
            return self.convert_markdown_to_linkedin(text)
        elif format_type == 'html':
            return self.convert_html_to_linkedin(text)
        else:
            raise ValueError("Tipo de formatação inválido. Use 'markdown' ou 'html'.")

    def _convert_html_to_linkedin(self, html_text: str) -> str:
        """
        Função interna para converter HTML para um formato compatível com LinkedIn,
        incluindo suporte a negrito, itálico, listas, blocos de código e blockquotes.
        """
        html = re.sub(r'<(/?p|/?h[1-6])>', '', html_text)

        # Negrito para maiúsculas
        def bold_break(match):
            bold = match.group(1).upper()
            after = match.group(2)
            # Só insere quebra dupla se houver texto real após o negrito (não só espaços ou fim de string)
            if after and after.strip():
                return f"{bold}\n\n{after.lstrip()}"
            else:
                return bold
        html = re.sub(r'<strong>(.*?)</strong>([^<\n]*)', bold_break, html)

        html = re.sub(r'<em>(.*?)</em>', lambda m: m.group(1), html)
        html = re.sub(r'<code>(.*?)</code>', lambda m: f'`{m.group(1)}`', html)
        html = re.sub(r'<blockquote>(.*?)</blockquote>', lambda m: f'\n> {m.group(1)}\n', html, flags=re.DOTALL)
        html = re.sub(r'<ul>.*?</ul>', 
                      lambda m: '\n'.join(f'• {item}' for item in re.findall(r'<li>(.*?)</li>', m.group(0))), 
                      html, flags=re.DOTALL)
        # Conversão de links Markdown para HTML (LinkedIn-friendly)
        html = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'<a href="\2">\1</a>', html)

        # Conversão de emojis Markdown para Unicode (ex: :smile: -> 😄)
        import emoji
        html = emoji.emojize(html, language='alias')

        # Conversão de tabelas Markdown para texto formatado (LinkedIn não suporta tabelas)
        def table_to_text(match):
            table = match.group(0)
            lines = [l.strip() for l in table.strip().split('\n') if l.strip()]
            # Remove separadores de header
            lines = [l for l in lines if not re.match(r'^[|\s:-]+$', l)]
            return '\n'.join(' | '.join(cell.strip() for cell in l.strip('|').split('|')) for l in lines)
        html = re.sub(r'(\|.+\|\n)(\|[:\- ]+\|\n)((\|.+\|\n?)+)', table_to_text, html)

        # Limite de caracteres para LinkedIn (ex: 3000)
        self.linkedin_char_limit = 3000
        if len(html) > self.linkedin_char_limit:
            html += f"\n\n⚠️ Atenção: O texto possui {len(html)} caracteres e excede o limite de {self.linkedin_char_limit} do LinkedIn."
        return html.strip()

