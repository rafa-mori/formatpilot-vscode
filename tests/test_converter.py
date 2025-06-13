import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.formatpilot import markdown_to_linkedin
import unittest

class TestMarkdownToLinkedIn(unittest.TestCase):

    def test_bold_to_uppercase(self):
        markdown = "**Texto em negrito**"
        expected = "TEXTO EM NEGRITO"
        self.assertEqual(markdown_to_linkedin(markdown), expected)

    def test_italic_removal(self):
        markdown = "*Texto em itálico*"
        expected = "Texto em itálico"
        self.assertEqual(markdown_to_linkedin(markdown), expected)

    def test_list_to_bullets(self):
        markdown = """\
- Item 1
- Item 2
"""
        expected = "• Item 1\n• Item 2"
        self.assertEqual(markdown_to_linkedin(markdown), expected)

    def test_combined_formatting(self):
        markdown = """\
**Negrito** e *itálico*\n
- Lista 1\n- Lista 2\n"""
        expected = "NEGRITO\n\ne itálico\n• Lista 1\n• Lista 2"
        self.assertEqual(markdown_to_linkedin(markdown), expected)

    def test_links_preservation(self):
        markdown = "Veja mais em [GitHub](https://github.com)"
        expected = "Veja mais em <a href=\"https://github.com\">GitHub</a>"
        self.assertEqual(markdown_to_linkedin(markdown), expected)

if __name__ == "__main__":
    unittest.main()
