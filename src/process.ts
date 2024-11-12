import { ConvertResult, Rule, RuleOPType, Type } from './interface';
import { RULES } from './rules';
import { Position, Range, Selection, TextEditor } from 'vscode';
import { isIngore } from './config';
import { isDisabledNextLine, isDisabledNextLineViaText } from './ignore-comment';

export class CssRemProcess {
  convert(text?: string): ConvertResult[] | null {
    const res = this.getRule('single', text);
    if (res.length === 0) {
      return null;
    }

    return res.map(i => i.rule.fn(i.text));
  }

  private convertAll(code: string, ignores: string[], type: Type): string {
    if (!code) {
      return code;
    }

    const rule = RULES.find(w => w.type === type);

    const lines = code.split('\n');

    const result = lines
      .map((line, lineIndex) => {
        return line.replace(rule.all, word => {
          if (ignores.includes(word)) {
            return word;
          }
          if (lineIndex > 0 && isDisabledNextLineViaText(lines[lineIndex - 1])) return null;
          const res = rule.fn(word);
          if (res) {
            return res.value;
          }
          return word;
        });
      })
      .join('\n');
    return result;
  }

  private getRule(type: RuleOPType, text: string): { rule: Rule; text: string }[] {
    const result: { rule: Rule; text: string }[] = [];
    for (const rule of RULES) {
      const match = text.match(rule[type]);
      if (match && match[1]) {
        result.push({ rule, text: match[1] });
      }
    }
    return result;
  }

  private getWordRange(textEditor: TextEditor, type: Type): Range | null {
    const position = new Position(textEditor.selection.start.line, textEditor.selection.start.character);
    const range = textEditor.document.getWordRangeAtPosition(position);
    if (!range) return null;
    const word = textEditor.document.getText(range);
    if (!word) return null;
    const rule = RULES.find(w => w.type === type);
    return rule && rule.all.test(word) ? range : null;
  }

  modifyDocument(textEditor: TextEditor, ignoresViaCommand: string[], type: Type): void {
    const doc = textEditor.document;
    if (isIngore(doc.uri)) return;

    let selection: Selection | Range = textEditor.selection;
    // When the cursor is in the valid range in switch mode
    if (selection.isEmpty && type.toLowerCase().includes('switch')) {
      const wordRange = this.getWordRange(textEditor, type);
      if (wordRange) {
        selection = wordRange;
      }
    }
    if (selection.isEmpty) {
      const start = new Position(0, 0);
      const end = new Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);
      selection = new Range(start, end);
    }

    const text = doc.getText(selection);
    textEditor.edit(builder => {
      builder.replace(selection, this.convertAll(text, ignoresViaCommand, type));
    });
  }
}
