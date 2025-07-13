import * as assert from 'assert';
import * as vscode from 'vscode';

suite('FormatPilot Extension Test Suite', () => {
	vscode.window.showInformationMessage('Starting FormatPilot tests...');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('formatpilot.formatpilot'));
	});

	test('Commands should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		
		assert.ok(commands.includes('formatpilot.convertText'));
		assert.ok(commands.includes('formatpilot.setup'));
		assert.ok(commands.includes('formatpilot.checkStatus'));
	});

	test('Configuration should be available', () => {
		const config = vscode.workspace.getConfiguration('formatpilot');
		
		assert.notStrictEqual(config, undefined);
		assert.strictEqual(typeof config.get('useUv'), 'boolean');
		assert.strictEqual(typeof config.get('autoInstall'), 'boolean');
		assert.strictEqual(typeof config.get('showNotifications'), 'boolean');
	});

	test('Extension should activate', async () => {
		const extension = vscode.extensions.getExtension('formatpilot.formatpilot');
		if (extension) {
			await extension.activate();
			assert.ok(extension.isActive);
		}
	});
});
