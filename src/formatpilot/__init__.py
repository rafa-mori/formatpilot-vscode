from .converter import FormatPilot

def markdown_to_linkedin(markdown_text: str) -> str:
    """
    Função utilitária para conversão rápida de Markdown para LinkedIn.
    """
    return FormatPilot().convert_markdown_to_linkedin(markdown_text)

__all__ = [
    "FormatPilot",
    "markdown_to_linkedin"
]

__version__ = "0.1.0"
__author__ = "Rafael Mori"
__email__ = "faelmori@gmail.com"
__license__ = "MIT"
__copyright__ = "Copyright (c) 2024 Rafael Mori"
__status__ = "Development"
__url__ = "https://github.com/faelmori/formatpilot"
__description__ = (
    "Conversão e transformação de textos entre múltiplos formatos (Markdown, LinkedIn, HTML, etc) de forma simples e extensível. Com amor da família Mori!"
)
__keywords__ = [
    "conversão de texto",
    "markdown",
    "linkedin",
    "html",
    "formatação",
    "transformação"
]