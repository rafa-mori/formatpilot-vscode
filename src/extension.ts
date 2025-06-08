// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "formatpilot" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('formatpilot.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from FormatPilot: Text Converter!');
	});

	context.subscriptions.push(disposable);

	const getPythonPath = async (): Promise<string | null> => {
		// 1. Tenta pegar o Python da extensão Python do VSCode
		const pythonExt = vscode.extensions.getExtension('ms-python.python');
		if (pythonExt) {
			await pythonExt.activate();
			const api = pythonExt.exports;
			if (api && api.settings) {
				const pythonPath = api.settings.getExecutionDetails().execCommand?.[0];
				if (pythonPath) { return pythonPath; }
			}
		}
		// 2. Tenta pegar do PATH
		const which = process.platform === 'win32' ? 'where' : 'which';
		const exec = require('child_process').execSync;
		try {
			const py = exec(`${which} python3 || ${which} python`, { encoding: 'utf8' }).split('\n')[0];
			return py;
		} catch {
			// 3. Pergunta ao usuário
			const manual = await vscode.window.showInputBox({
				prompt: 'Python not found. Please enter the full path to your Python 3 executable:',
				ignoreFocusOut: true
			});
			return manual || null;
		}
	};

	const convertCommand = vscode.commands.registerCommand('formatpilot.convertText', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor found.');
			return;
		}
		const selection = editor.selection;
		const text = editor.document.getText(selection);
		if (!text) {
			vscode.window.showWarningMessage('No text selected.');
			return;
		}

		// Python detection (resilient)
		const python = await getPythonPath();
		if (!python) {
			vscode.window.showErrorMessage('Python is not installed or not found. Please install Python 3.7+ to use FormatPilot.');
			return;
		}

		// Check for formatpilot
		const exec = require('child_process').execSync;
		let hasFormatPilot = true;
		try {
			exec('python3 -m pip show formatpilot || python -m pip show formatpilot', { stdio: 'ignore' });
		} catch {
			hasFormatPilot = false;
		}
		if (!hasFormatPilot) {
			const install = await vscode.window.showInformationMessage('formatpilot is not installed. Install it now?', 'Yes', 'No');
			if (install === 'Yes') {
				try {
					vscode.window.showInformationMessage('Installing formatpilot...');
					exec('python3 -m pip install formatpilot || python -m pip install formatpilot');
				} catch (e) {
					vscode.window.showErrorMessage('Failed to install formatpilot. Please install it manually.');
					return;
				}
			} else {
				return;
			}
		}

		// Ask user for format
		const format = await vscode.window.showQuickPick([
			'LinkedIn', 'HTML', 'Markdown'
		], { placeHolder: 'Select output format' });
		if (!format) { return; }

		// Run formatpilot
		let pyCode = '';
		if (format === 'LinkedIn') {
			pyCode = `from formatpilot import markdown_to_linkedin; print(markdown_to_linkedin(r'''${text}'''))`;
		} else if (format === 'HTML') {
			pyCode = `from formatpilot import FormatPilot; print(FormatPilot().convert_markdown_to_html(r'''${text}'''))`;
		} else if (format === 'Markdown') {
			pyCode = `from formatpilot import FormatPilot; print(FormatPilot().convert_html_to_markdown(r'''${text}'''))`;
		}
		try {
			const result = exec(`${python} -c "${pyCode.replace(/"/g, '\"')}"`, { encoding: 'utf8', maxBuffer: 1024 * 1024 });
			editor.edit(editBuilder => {
				editBuilder.replace(selection, result.trim());
			});
			vscode.window.showInformationMessage('Text converted with FormatPilot!');
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			vscode.window.showErrorMessage('Error running formatpilot: ' + msg);
		}
	});
	context.subscriptions.push(convertCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
