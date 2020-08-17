import { CompletionItemProvider, TextDocument, Position, CompletionItem, Range, CompletionItemKind } from 'vscode';
import { CssRemProcess } from './process';

export class CssRemProvider implements CompletionItemProvider {
  constructor(private process: CssRemProcess) {}

  provideCompletionItems(document: TextDocument, position: Position): Thenable<CompletionItem[]> {
    return new Promise((resolve, _reject) => {
      const lineText = document.getText(new Range(position.with(undefined, 0), position));
      const res = this.process.convert(lineText);
      if (!res) {
        return resolve([]);
      }

      const item = new CompletionItem(res.label, CompletionItemKind.Snippet);
      item.insertText = res.value;
      return resolve([item]);
    });
  }
}
