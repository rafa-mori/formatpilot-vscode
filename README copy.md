# FormatPilot: Text Converter VSCode Extension

Convert selected text to LinkedIn, HTML, or Markdown using the [formatpilot](https://pypi.org/project/formatpilot/) Python package. Installs dependencies automatically and guides the user if Python is missing.

## Features

- Convert selected text to LinkedIn, HTML, or Markdown using the formatpilot Python package
- Installs Python and formatpilot automatically if needed
- Works from the command palette and right-click context menu

## Usage

1. Select the text you want to convert in the editor
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and search for `FormatPilot: Convert Selected Text`
3. Or right-click the selection and choose `FormatPilot: Convert Selected Text`
4. Choose the output format (LinkedIn, HTML, Markdown)
5. The selected text will be replaced with the converted output

## Requirements

- Python 3.7+ must be installed and available in your PATH
- Internet connection to install the formatpilot package if not present

## Extension Settings

No settings required. The extension is ready to use out of the box.

## Known Issues

- If Python is not installed, the extension will prompt you to install it manually
- If formatpilot fails to install automatically, install it manually with `pip install formatpilot`

## Release Notes

### 0.0.1

- Initial release: Convert text using formatpilot with automatic dependency management

---
**Made with love by the Mori family!** ❤️
