'use strict';
import * as vscode from 'vscode';

let cog = null;
export function activate(context: vscode.ExtensionContext) {
    
    cog = vscode.workspace.getConfiguration('cssrem');

    vscode.languages.getLanguages().then(data => console.log(data));

    let provider = new CssRemProvider();
    const LANS = [ 'html', 'css', 'less', 'scss', 'sass', 'stylus' ];
    for (let lan of LANS) {
        let providerDisposable = vscode.languages.registerCompletionItemProvider(lan, provider);
        context.subscriptions.push(providerDisposable);
    }
}

class CssRemProvider implements vscode.CompletionItemProvider {
    provideCompletionItems (document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]> {

        return new Promise((resolve, reject) => {
            let lineText = document.getText(new vscode.Range(position.with(undefined, 0), position));
            let match = lineText.match(/([\d.]+)p(x)?/);
            if (!match) {
                return resolve([]);
            }

            const value = parseFloat(match[1]);
            let remValue: number | string = +(value / cog.rootFontSize).toFixed(cog.fixedDigits);
            if (cog.autoRemovePrefixZero) {
                if (remValue.toString().startsWith('0.'))
                    remValue = remValue.toString().substring(1);
            }
            const item = new vscode.CompletionItem(`${value}px -> ${remValue}rem`, vscode.CompletionItemKind.Snippet);
            item.insertText = `${remValue}rem`;
            return resolve([item]);

        });
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}