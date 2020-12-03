import { CompletionItemProvider, TextDocument, Position, CompletionItem, Range, CompletionItemKind, MarkdownString } from 'vscode';
import { CssRemProcess } from './process';

export class CssRemProvider implements CompletionItemProvider {
  constructor(private lan: string, private process: CssRemProcess) {}

  provideCompletionItems(document: TextDocument, position: Position): Thenable<CompletionItem[]> {
    return new Promise((resolve, _reject) => {
      const lineText = document.getText(new Range(position.with(undefined, 0), position));
      const res = this.process.convert(lineText);
      if (res.length === 0) {
        return resolve([]);
      }

      return resolve(
        res.map(i => {
          const item = new CompletionItem(i.label, CompletionItemKind.Snippet);
          if (i.documentation) {
            item.documentation = new MarkdownString(i.documentation);
          }
          item.insertText = i.value;
          return item;
        }),
      );
    });
  }
}
