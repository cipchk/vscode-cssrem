import { CompletionItem, CompletionItemKind, CompletionItemProvider, MarkdownString, Position, Range, TextDocument } from 'vscode';
import { cog, isIngore } from './config';
import { CssRemProcess } from './process';
import { isDisabledNextLine } from './ignore-comment';

export default class implements CompletionItemProvider {
  constructor(private lan: string, private process: CssRemProcess) {}

  provideCompletionItems(document: TextDocument, position: Position): Thenable<CompletionItem[]> {
    if (isIngore(document.uri)) return Promise.resolve([]);

    return new Promise(resolve => {
      if (isDisabledNextLine(document, position.line)) return null;
      const lineText = document.getText(new Range(position.with(undefined, 0), position));
      const res = this.process.convert(lineText);
      if (res == null || res.length === 0) {
        return resolve([]);
      }

      return resolve(
        res.map((i, idx) => {
          const item = new CompletionItem(i.label, CompletionItemKind.Snippet);
          if (i.documentation) {
            item.documentation = new MarkdownString(i.documentation);
          }
          item.preselect = idx === 0;
          item.insertText = i.value + (cog.addMark ? ` /* ${i.label} */` : ``);
          return item;
        }),
      );
    });
  }
}
