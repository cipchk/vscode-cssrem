import { Config, ConvertResult, Rule, RuleOPType, Type } from './interface';
import { RULES } from './rules';

export class CssRemProcess {
  constructor(private cog: Config) {}

  convert(text: string): ConvertResult[] {
    const res = this.getRule('single', text);
    if (res.length === 0) {
      return null;
    }

    return res.map(i => i.rule.fn(this.cog, i.text));
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
      const res = rule.fn(this.cog, word);
      if (res) {
        return res.value;
      }
      return word;
    });
  }

  private getRule(type: RuleOPType, text: string): Array<{ rule: Rule; text: string }> {
    const result: Array<{ rule: Rule; text: string }> = [];
    for (const rule of RULES) {
      const match = text.match(rule[type]);
      if (match) {
        result.push({ rule, text: match[1] });
      }
    }
    return result;
  }
}
