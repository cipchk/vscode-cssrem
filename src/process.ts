import { ConvertResult, Rule, RuleOPType, Type } from './interface';
import { RULES } from './rules';

export class CssRemProcess {
  convert(text: string): ConvertResult[] {
    const res = this.getRule('single', text);
    if (res.length === 0) {
      return null;
    }

    return res.map(i => i.rule.fn(i.text));
  }

  convertAll(code: string, ingores: string[], type: Type): string {
    if (!code) {
      return code;
    }

    const rule = RULES.find(w => w.type === type);

    return code.replace(rule.all, (word: string) => {
      if (ingores.includes(word)) {
        return word;
      }
      const res = rule.fn(word);
      if (res) {
        return res.value;
      }
      return word;
    });
  }

  private getRule(type: RuleOPType, text: string): { rule: Rule; text: string }[] {
    const result: { rule: Rule; text: string }[] = [];
    for (const rule of RULES) {
      const match = text.match(rule[type]);
      if (match) {
        result.push({ rule, text: match[1] });
      }
    }
    return result;
  }
}
