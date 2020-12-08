import { Hover, HoverProvider, MarkdownString, Position, ProviderResult, TextDocument } from 'vscode';
import { Config } from './interface';
import { RULES } from './rules';

export default class implements HoverProvider {
  constructor(private cog: Config) {}

  provideHover(doc: TextDocument, pos: Position): ProviderResult<Hover> {
    const line = doc.lineAt(pos.line).text.trim();
    const arr = line.split(' ');
    if (arr.length <= 1) {
      return null;
    }
    const text = arr[1].replace(';', '');
    if (!text) {
      return null;
    }
    const rule = RULES.find(w => w.hover && w.hover.test(text));
    if (rule == null) {
      return null;
    }
    const res = rule.hoverFn(this.cog, text);
    if (!res || !res.documentation) {
      return null;
    }
    if (this.cog.hover === 'onlyMark' && !line.includes(`/* ${res.type} */`)) {
      return null;
    }
    return new Hover(new MarkdownString(res.documentation));
  }
}
