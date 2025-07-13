import * as vscode from 'vscode';
import { execSync, spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

interface PythonEnvironment {
	pythonPath: string;
	uvPath?: string;
	hasUv: boolean;
	hasFormatpilot: boolean;
	version?: string;
}

class FormatPilotManager {
	private outputChannel: vscode.OutputChannel;
	private statusBarItem: vscode.StatusBarItem;

	constructor() {
		this.outputChannel = vscode.window.createOutputChannel('FormatPilot');
		this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		this.statusBarItem.command = 'formatpilot.checkStatus';
		this.statusBarItem.text = '$(rocket) FormatPilot';
		this.statusBarItem.tooltip = 'Click to check FormatPilot status';
		this.statusBarItem.show();
	}

	private log(message: string, show: boolean = false): void {
		this.outputChannel.appendLine(`[${new Date().toISOString()}] ${message}`);
		if (show) {
			this.outputChannel.show();
		}
	}

	private getConfig(): vscode.WorkspaceConfiguration {
		return vscode.workspace.getConfiguration('formatpilot');
	}

	private async showNotification(message: string, type: 'info' | 'warning' | 'error' = 'info'): Promise<void> {
		if (!this.getConfig().get('showNotifications', true)) {
			return;
		}
		
		switch (type) {
			case 'info':
				vscode.window.showInformationMessage(message);
				break;
			case 'warning':
				vscode.window.showWarningMessage(message);
				break;
			case 'error':
				vscode.window.showErrorMessage(message);
				break;
		}
	}

	private async getPythonPath(): Promise<string | null> {
		// 1. Primeiro verifica configuração manual
		const configPython = this.getConfig().get<string>('pythonPath');
		if (configPython && fs.existsSync(configPython)) {
			this.log(`Using configured Python: ${configPython}`);
			return configPython;
		}

		// 2. Tenta pegar da extensão Python do VSCode
		try {
			const pythonExt = vscode.extensions.getExtension('ms-python.python');
			if (pythonExt) {
				await pythonExt.activate();
				const api = pythonExt.exports;
				if (api?.settings) {
					const details = api.settings.getExecutionDetails();
					const pythonPath = details?.execCommand?.[0];
					if (pythonPath && fs.existsSync(pythonPath)) {
						this.log(`Using Python extension path: ${pythonPath}`);
						return pythonPath;
					}
				}
			}
		} catch (error) {
			this.log(`Failed to get Python from extension: ${error}`);
		}

		// 3. Tenta encontrar no PATH
		const pythonCommands = process.platform === 'win32' 
			? ['python', 'py', 'python3'] 
			: ['python3', 'python'];
		
		for (const cmd of pythonCommands) {
			try {
				const which = process.platform === 'win32' ? 'where' : 'which';
				const result = execSync(`${which} ${cmd}`, { encoding: 'utf8', stdio: 'pipe' });
				const pythonPath = result.split('\n')[0].trim();
				if (pythonPath && fs.existsSync(pythonPath)) {
					this.log(`Found Python in PATH: ${pythonPath}`);
					return pythonPath;
				}
			} catch {
				// Continue trying other commands
			}
		}

		// 4. Pergunta ao usuário
		const manual = await vscode.window.showInputBox({
			prompt: '🐍 Python não encontrado. Digite o caminho completo para seu executável Python 3:',
			placeHolder: '/usr/bin/python3 ou C:\\Python\\python.exe',
			ignoreFocusOut: true,
			validateInput: (value) => {
				if (!value) {
					return 'Caminho é obrigatório';
				}
				if (!fs.existsSync(value)) {
					return 'Arquivo não encontrado';
				}
				return null;
			}
		});

		if (manual) {
			// Salva na configuração para próximas vezes
			await this.getConfig().update('pythonPath', manual, vscode.ConfigurationTarget.Global);
			this.log(`Using manual Python path: ${manual}`);
		}

		return manual || null;
	}

	private async checkUvInstallation(pythonPath: string): Promise<string | null> {
		try {
			// Primeiro tenta uv no PATH
			const which = process.platform === 'win32' ? 'where' : 'which';
			const uvPath = execSync(`${which} uv`, { encoding: 'utf8', stdio: 'pipe' }).split('\n')[0].trim();
			if (uvPath && fs.existsSync(uvPath)) {
				this.log(`Found uv in PATH: ${uvPath}`);
				return uvPath;
			}
		} catch {
			// Se não encontrou no PATH, tenta instalar via pip
			this.log('uv not found in PATH, attempting to install...');
		}

		try {
			// Tenta instalar uv
			execSync(`"${pythonPath}" -m pip install uv`, { stdio: 'pipe' });
			this.log('Successfully installed uv via pip');
			return 'uv'; // Comando uv deve estar disponível agora
		} catch (error) {
			this.log(`Failed to install uv: ${error}`);
			return null;
		}
	}

	private async checkFormatpilotInstallation(pythonPath: string, uvPath?: string): Promise<boolean> {
		try {
			if (uvPath && this.getConfig().get('useUv', true)) {
				// Verifica com uv
				execSync(`${uvPath} pip show formatpilot`, { stdio: 'pipe' });
			} else {
				// Verifica com pip
				execSync(`"${pythonPath}" -m pip show formatpilot`, { stdio: 'pipe' });
			}
			return true;
		} catch {
			return false;
		}
	}

	public async getPythonEnvironment(): Promise<PythonEnvironment | null> {
		this.log('Checking Python environment...');
		
		const pythonPath = await this.getPythonPath();
		if (!pythonPath) {
			await this.showNotification('🚫 Python não encontrado. Por favor, instale Python 3.7+ para usar FormatPilot.', 'error');
			return null;
		}

		// Verifica versão do Python
		let version: string | undefined;
		try {
			version = execSync(`"${pythonPath}" --version`, { encoding: 'utf8' }).trim();
			this.log(`Python version: ${version}`);
		} catch (error) {
			this.log(`Failed to get Python version: ${error}`);
		}

		// Verifica uv
		const useUv = this.getConfig().get('useUv', true);
		let uvPath: string | undefined;
		let hasUv = false;

		if (useUv) {
			const uvResult = await this.checkUvInstallation(pythonPath);
			uvPath = uvResult || undefined;
			hasUv = !!uvPath;
		}

		// Verifica formatpilot
		const hasFormatpilot = await this.checkFormatpilotInstallation(pythonPath, uvPath);

		const env: PythonEnvironment = {
			pythonPath,
			uvPath,
			hasUv,
			hasFormatpilot,
			version
		};

		this.updateStatusBar(env);
		return env;
	}

	private updateStatusBar(env: PythonEnvironment): void {
		const icon = env.hasFormatpilot ? '$(rocket)' : '$(warning)';
		const status = env.hasFormatpilot ? 'Ready' : 'Setup Required';
		this.statusBarItem.text = `${icon} FormatPilot: ${status}`;
		this.statusBarItem.tooltip = `Python: ${env.version || 'Unknown'}\nuv: ${env.hasUv ? 'Available' : 'Not available'}\nFormatPilot: ${env.hasFormatpilot ? 'Installed' : 'Not installed'}`;
	}

	public async installFormatpilot(env: PythonEnvironment): Promise<boolean> {
		if (!this.getConfig().get('autoInstall', true)) {
			const install = await vscode.window.showInformationMessage(
				'📦 FormatPilot não está instalado. Instalar agora?',
				'Sim',
				'Não'
			);
			if (install !== 'Sim') {
				return false;
			}
		}

		try {
			this.log('Installing formatpilot...');
			await this.showNotification('📦 Instalando FormatPilot...', 'info');

			if (env.hasUv && env.uvPath) {
				execSync(`${env.uvPath} pip install formatpilot`, { stdio: 'pipe' });
			} else {
				execSync(`"${env.pythonPath}" -m pip install formatpilot`, { stdio: 'pipe' });
			}

			this.log('FormatPilot installed successfully');
			await this.showNotification('✅ FormatPilot instalado com sucesso!', 'info');
			return true;
		} catch (error) {
			const errorMsg = `Failed to install formatpilot: ${error}`;
			this.log(errorMsg);
			await this.showNotification('❌ Falha ao instalar FormatPilot. Verifique os logs.', 'error');
			this.outputChannel.show();
			return false;
		}
	}

	public async convertText(text: string, format: string, env: PythonEnvironment): Promise<string | null> {
		this.log(`Converting text to ${format}...`);

		let pyCode = '';
		switch (format) {
			case 'LinkedIn':
				pyCode = `from formatpilot import markdown_to_linkedin; print(markdown_to_linkedin(r'''${text}'''))`;
				break;
			case 'HTML':
				pyCode = `from formatpilot import FormatPilot; print(FormatPilot().convert_markdown_to_html(r'''${text}'''))`;
				break;
			case 'Markdown':
				pyCode = `from formatpilot import FormatPilot; print(FormatPilot().convert_html_to_markdown(r'''${text}'''))`;
				break;
			default:
				throw new Error(`Unsupported format: ${format}`);
		}

		try {
			const result = execSync(
				`"${env.pythonPath}" -c "${pyCode.replace(/"/g, '\\"')}"`,
				{ 
					encoding: 'utf8', 
					maxBuffer: 1024 * 1024,
					timeout: 30000 // 30 segundos timeout
				}
			);
			
			this.log(`Successfully converted text to ${format}`);
			return result.trim();
		} catch (error) {
			const errorMsg = `Error converting text: ${error}`;
			this.log(errorMsg);
			throw error;
		}
	}

	public dispose(): void {
		this.outputChannel.dispose();
		this.statusBarItem.dispose();
	}
}

let formatPilotManager: FormatPilotManager;

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('🚀 FormatPilot extension is now active!');
	
	formatPilotManager = new FormatPilotManager();
	context.subscriptions.push(formatPilotManager);

	// Comando principal de conversão
	const convertCommand = vscode.commands.registerCommand('formatpilot.convertText', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('❌ Nenhum editor ativo encontrado.');
			return;
		}

		const selection = editor.selection;
		const text = editor.document.getText(selection);
		if (!text.trim()) {
			vscode.window.showWarningMessage('⚠️ Nenhum texto selecionado.');
			return;
		}

		try {
			// Verifica ambiente Python
			const env = await formatPilotManager.getPythonEnvironment();
			if (!env) {
				return;
			}

			// Instala formatpilot se necessário
			if (!env.hasFormatpilot) {
				const success = await formatPilotManager.installFormatpilot(env);
				if (!success) {
					return;
				}
				env.hasFormatpilot = true;
			}

			// Pergunta formato de destino
			const formatOptions = [
				{
					label: '$(globe) LinkedIn',
					description: 'Converte Markdown para formato LinkedIn',
					detail: 'Remove formatação, converte listas e emojis',
					format: 'LinkedIn'
				},
				{
					label: '$(code) HTML',
					description: 'Converte Markdown para HTML',
					detail: 'Mantém toda formatação em HTML',
					format: 'HTML'
				},
				{
					label: '$(markdown) Markdown',
					description: 'Converte HTML para Markdown',
					detail: 'Converte tags HTML para sintaxe Markdown',
					format: 'Markdown'
				}
			];

			const selected = await vscode.window.showQuickPick(formatOptions, {
				placeHolder: '🎯 Selecione o formato de destino',
				matchOnDescription: true,
				matchOnDetail: true
			});

			if (!selected) {
				return;
			}

			// Converte o texto
			await vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: `Convertendo para ${selected.format}...`,
				cancellable: false
			}, async () => {
				const result = await formatPilotManager.convertText(text, selected.format, env);
				if (result) {
					await editor.edit(editBuilder => {
						editBuilder.replace(selection, result);
					});
					vscode.window.showInformationMessage(`✅ Texto convertido para ${selected.format}!`);
				}
			});

		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : String(error);
			vscode.window.showErrorMessage(`❌ Erro ao converter texto: ${errorMsg}`);
		}
	});

	// Comando de setup
	const setupCommand = vscode.commands.registerCommand('formatpilot.setup', async () => {
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: 'Configurando FormatPilot...',
			cancellable: false
		}, async () => {
			const env = await formatPilotManager.getPythonEnvironment();
			if (env && !env.hasFormatpilot) {
				await formatPilotManager.installFormatpilot(env);
			}
		});
	});

	// Comando de status
	const statusCommand = vscode.commands.registerCommand('formatpilot.checkStatus', async () => {
		const env = await formatPilotManager.getPythonEnvironment();
		if (!env) {
			return;
		}

		const items = [
			`🐍 **Python**: ${env.version || 'Versão desconhecida'}`,
			`📦 **uv**: ${env.hasUv ? '✅ Disponível' : '❌ Não disponível'}`,
			`🚀 **FormatPilot**: ${env.hasFormatpilot ? '✅ Instalado' : '❌ Não instalado'}`,
			`📍 **Caminho**: ${env.pythonPath}`
		];

		vscode.window.showInformationMessage('Status do FormatPilot', {
			modal: true,
			detail: items.join('\n')
		});
	});

	// Registra comandos
	context.subscriptions.push(convertCommand, setupCommand, statusCommand);

	// Verifica status inicial em background
	setTimeout(async () => {
		await formatPilotManager.getPythonEnvironment();
	}, 1000);
}

export function deactivate() {
	formatPilotManager?.dispose();
}
