import * as vscode from 'vscode';

// Interface para opções de conversão
interface ConversionOptions {
    from: 'markdown' | 'html' | 'text';
    to: 'linkedin' | 'html' | 'markdown';
}

// Classe principal para conversões de texto
class FormatPilotConverter {
    
    /**
     * Converte Markdown para formato LinkedIn
     * Remove formatação e ajusta para o padrão do LinkedIn
     */
    private convertMarkdownToLinkedIn(text: string): string {
        let result = text;
        
        // Remove cabeçalhos Markdown (# ## ### etc)
        result = result.replace(/^#{1,6}\s+(.+)$/gm, '$1');
        
        // Converte negrito **texto** para TEXTO MAIÚSCULO ou remove
        result = result.replace(/\*\*(.*?)\*\*/g, (match, content) => {
            return content.toUpperCase();
        });
        
        // Remove itálico *texto* (LinkedIn não suporta)
        result = result.replace(/\*(.*?)\*/g, '$1');
        
        // Remove código `texto`
        result = result.replace(/`([^`]+)`/g, '$1');
        
        // Converte listas não ordenadas para bullet points
        result = result.replace(/^[\s]*[-\*\+]\s+(.+)$/gm, '• $1');
        
        // Converte listas numeradas
        result = result.replace(/^[\s]*\d+\.\s+(.+)$/gm, (match, content, offset, string) => {
            const lines = string.substring(0, offset).split('\n');
            const currentLine = lines.length;
            return `${currentLine}. ${content}`;
        });
        
        // Converte links [texto](url) para formato LinkedIn
        result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');
        
        // Remove blocos de código
        result = result.replace(/```[\s\S]*?```/g, '');
        result = result.replace(/~~~[\s\S]*?~~~/g, '');
        
        // Remove linhas horizontais
        result = result.replace(/^---+$/gm, '');
        result = result.replace(/^___+$/gm, '');
        result = result.replace(/^\*\*\*+$/gm, '');
        
        // Limpa quebras de linha excessivas
        result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        // Remove espaços extras
        result = result.replace(/[ \t]+/g, ' ');
        
        const finalText = result.trim();
        
        // Adiciona aviso se texto for muito longo para LinkedIn
        if (finalText.length > 3000) {
            return finalText + '\n\n⚠️ AVISO: Este texto excede 3000 caracteres e pode ser cortado no LinkedIn.';
        }
        
        return finalText;
    }
    
    /**
     * Converte Markdown para HTML
     */
    private convertMarkdownToHTML(text: string): string {
        let result = text;
        
        // Cabeçalhos
        result = result.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        result = result.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        result = result.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        result = result.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
        result = result.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
        result = result.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
        
        // Negrito e itálico
        result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Código inline
        result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Blocos de código
        result = result.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Links
        result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        
        // Imagens
        result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
        
        // Processamento de listas
        const lines = result.split('\n');
        let processedLines: string[] = [];
        let inUnorderedList = false;
        let inOrderedList = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const isUnorderedItem = /^[\s]*[-\*\+]\s+(.+)$/.test(line);
            const isOrderedItem = /^[\s]*\d+\.\s+(.+)$/.test(line);
            
            // Lista não ordenada
            if (isUnorderedItem && !inUnorderedList) {
                if (inOrderedList) {
                    processedLines.push('</ol>');
                    inOrderedList = false;
                }
                processedLines.push('<ul>');
                inUnorderedList = true;
            } else if (!isUnorderedItem && inUnorderedList) {
                processedLines.push('</ul>');
                inUnorderedList = false;
            }
            
            // Lista ordenada
            if (isOrderedItem && !inOrderedList) {
                if (inUnorderedList) {
                    processedLines.push('</ul>');
                    inUnorderedList = false;
                }
                processedLines.push('<ol>');
                inOrderedList = true;
            } else if (!isOrderedItem && inOrderedList) {
                processedLines.push('</ol>');
                inOrderedList = false;
            }
            
            if (isUnorderedItem) {
                const content = line.replace(/^[\s]*[-\*\+]\s+(.+)$/, '$1');
                processedLines.push(`  <li>${content}</li>`);
            } else if (isOrderedItem) {
                const content = line.replace(/^[\s]*\d+\.\s+(.+)$/, '$1');
                processedLines.push(`  <li>${content}</li>`);
            } else if (line.trim() && !inUnorderedList && !inOrderedList) {
                // Parágrafos normais
                processedLines.push(`<p>${line}</p>`);
            } else {
                processedLines.push(line);
            }
        }
        
        // Fecha listas abertas
        if (inUnorderedList) {
            processedLines.push('</ul>');
        }
        if (inOrderedList) {
            processedLines.push('</ol>');
        }
        
        // Linhas horizontais
        result = processedLines.join('\n');
        result = result.replace(/^---+$/gm, '<hr>');
        
        return result;
    }
    
    /**
     * Converte HTML para Markdown
     */
    private convertHTMLToMarkdown(text: string): string {
        let result = text;
        
        // Cabeçalhos
        result = result.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
        result = result.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
        result = result.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
        result = result.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n');
        result = result.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n');
        result = result.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n');
        
        // Negrito e itálico
        result = result.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
        result = result.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
        result = result.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
        result = result.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
        
        // Código
        result = result.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
        result = result.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, '```\n$1\n```');
        
        // Links
        result = result.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');
        
        // Imagens
        result = result.replace(/<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)');
        result = result.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']+)["'][^>]*\/?>/gi, '![$1]($2)');
        result = result.replace(/<img[^>]*src=["']([^"']+)["'][^>]*\/?>/gi, '![]($1)');
        
        // Listas
        result = result.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1');
        result = result.replace(/<\/?ul[^>]*>/gi, '');
        result = result.replace(/<\/?ol[^>]*>/gi, '');
        
        // Parágrafos
        result = result.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
        
        // Quebras de linha
        result = result.replace(/<br\s*\/?>/gi, '\n');
        
        // Linhas horizontais
        result = result.replace(/<hr[^>]*\/?>/gi, '\n---\n');
        
        // Remove tags restantes
        result = result.replace(/<[^>]+>/g, '');
        
        // Decodifica entidades HTML
        result = result.replace(/&lt;/g, '<');
        result = result.replace(/&gt;/g, '>');
        result = result.replace(/&amp;/g, '&');
        result = result.replace(/&quot;/g, '"');
        result = result.replace(/&#39;/g, "'");
        
        // Limpa espaços extras
        result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
        result = result.replace(/[ \t]+/g, ' ');
        
        return result.trim();
    }
    
    /**
     * Método principal para conversão
     */
    public convert(text: string, options: ConversionOptions): string {
        if (!text || !text.trim()) {
            throw new Error('Texto vazio fornecido para conversão');
        }
        
        try {
            switch (`${options.from}-${options.to}`) {
                case 'markdown-linkedin':
                    return this.convertMarkdownToLinkedIn(text);
                case 'markdown-html':
                    return this.convertMarkdownToHTML(text);
                case 'html-markdown':
                    return this.convertHTMLToMarkdown(text);
                default:
                    throw new Error(`Conversão ${options.from} → ${options.to} não suportada`);
            }
        } catch (error) {
            throw new Error(`Erro na conversão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    }
}

// Função utilitária para obter texto selecionado
function getSelectedText(): { editor: vscode.TextEditor, selection: vscode.Selection, text: string } | null {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('❌ Nenhum editor ativo encontrado');
        return null;
    }
    
    const selection = editor.selection;
    const text = editor.document.getText(selection);
    
    if (!text.trim()) {
        vscode.window.showWarningMessage('⚠️ Selecione um texto para converter');
        return null;
    }
    
    return { editor, selection, text };
}

// Função para aplicar conversão
async function applyConversion(conversionType: ConversionOptions, successMessage: string) {
    const selected = getSelectedText();
    if (!selected) {
        return;
    }
    
    const { editor, selection, text } = selected;
    const converter = new FormatPilotConverter();
    
    try {
        const convertedText = converter.convert(text, conversionType);
        
        await editor.edit(editBuilder => {
            editBuilder.replace(selection, convertedText);
        });
        
        vscode.window.showInformationMessage(successMessage);
    } catch (error) {
        vscode.window.showErrorMessage(`❌ ${error instanceof Error ? error.message : 'Erro na conversão'}`);
    }
}

// Função principal de ativação da extensão
export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 FormatPilot extension activated!');
    
    // Comando genérico com seleção de tipo
    const convertTextCommand = vscode.commands.registerCommand('formatpilot.convertText', async () => {
        const selected = getSelectedText();
        if (!selected) {
            return;
        }
        
        const { editor, selection, text } = selected;
        const converter = new FormatPilotConverter();
        
        // Mostra opções de conversão
        const conversionOptions = [
            { 
                label: '📱 LinkedIn', 
                description: 'Markdown → LinkedIn', 
                detail: 'Remove formatação, ajusta para LinkedIn',
                value: { from: 'markdown', to: 'linkedin' } as ConversionOptions
            },
            { 
                label: '🌐 HTML', 
                description: 'Markdown → HTML', 
                detail: 'Converte para HTML com tags',
                value: { from: 'markdown', to: 'html' } as ConversionOptions
            },
            { 
                label: '📝 Markdown', 
                description: 'HTML → Markdown', 
                detail: 'Converte HTML para sintaxe Markdown',
                value: { from: 'html', to: 'markdown' } as ConversionOptions
            }
        ];
        
        const selected_option = await vscode.window.showQuickPick(conversionOptions, {
            placeHolder: '🎯 Escolha o tipo de conversão',
            matchOnDescription: true,
            matchOnDetail: true
        });
        
        if (!selected_option) {
            return;
        }
        
        try {
            const convertedText = converter.convert(text, selected_option.value);
            
            await editor.edit(editBuilder => {
                editBuilder.replace(selection, convertedText);
            });
            
            vscode.window.showInformationMessage(`✅ Texto convertido para ${selected_option.label}`);
        } catch (error) {
            vscode.window.showErrorMessage(`❌ ${error instanceof Error ? error.message : 'Erro na conversão'}`);
        }
    });
    
    // Comandos específicos para cada tipo de conversão
    const convertToLinkedInCommand = vscode.commands.registerCommand('formatpilot.convertToLinkedIn', async () => {
        await applyConversion(
            { from: 'markdown', to: 'linkedin' },
            '✅ Texto convertido para LinkedIn'
        );
    });
    
    const convertToHTMLCommand = vscode.commands.registerCommand('formatpilot.convertToHTML', async () => {
        await applyConversion(
            { from: 'markdown', to: 'html' },
            '✅ Texto convertido para HTML'
        );
    });
    
    const convertToMarkdownCommand = vscode.commands.registerCommand('formatpilot.convertToMarkdown', async () => {
        await applyConversion(
            { from: 'html', to: 'markdown' },
            '✅ Texto convertido para Markdown'
        );
    });
    
    // Registra todos os comandos
    context.subscriptions.push(
        convertTextCommand,
        convertToLinkedInCommand,
        convertToHTMLCommand,
        convertToMarkdownCommand
    );
    
    console.log('✅ All FormatPilot commands registered successfully!');
}

export function deactivate() {
    console.log('👋 FormatPilot extension deactivated');
}
