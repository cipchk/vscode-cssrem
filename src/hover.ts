import { Hover, HoverProvider, MarkdownString, Position, ProviderResult, TextDocument } from 'vscode';
import { cog, isIngore } from './config';
import { RULES } from './rules';

export default class implements HoverProvider {
  private getText(line: string, pos: Position): string {
    const point = pos.character;
    let text = '';
    line.replace(/[.0-9]+(px|rem|rpx)/g, (a, _, idx) => {
      const start = idx + 1;
      const end = idx + a.length + 1;
      if (!text && point >= start && point <= end) {
        text = a;
      }
      return '';
    });
    return text;
  }

  provideHover(doc: TextDocument, pos: Position): ProviderResult<Hover> {
    if (isIngore(doc.uri)) return null;
    const line = doc.lineAt(pos.line).text.trim();
    const text = this.getText(line, pos);
    if (!text) {
      return null;
    }
    const rule = RULES.find(w => w.hover && w.hover.test(text));
    if (rule == null) {
      return null;
    }
    const res = rule.hoverFn(text);
    if (!res || !res.documentation) {
      return null;
    }
    if (cog.hover === 'onlyMark' && !line.includes(`/* ${res.type} */`)) {
      return null;
    }
    return new Hover(new MarkdownString(res.documentation));
  }
}
