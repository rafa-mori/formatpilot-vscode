import * as assert from 'assert';
import * as vscode from 'vscode';

suite('FormatPilot Extension Test Suite', () => {
	vscode.window.showInformationMessage('Starting FormatPilot tests...');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('faelmori.formatpilot'));
	});

	test('Commands should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		
		assert.ok(commands.includes('formatpilot.convertText'));
		assert.ok(commands.includes('formatpilot.convertToLinkedIn'));
		assert.ok(commands.includes('formatpilot.convertToHTML'));
		assert.ok(commands.includes('formatpilot.convertToMarkdown'));
	});

	test('Extension should activate', async () => {
		const extension = vscode.extensions.getExtension('faelmori.formatpilot');
		if (extension) {
			await extension.activate();
			assert.ok(extension.isActive);
		}
	});
});
