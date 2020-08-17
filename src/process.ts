import { Result, Rule, RuleOPType, Type, Config } from './interface';

export class CssRemProcess {
  constructor(private cog: Config) {}

  private rules: Rule[] = [
    {
      type: 'pxToRem',
      single: /([-]?[\d.]+)p(x)?$/,
      all: /([-]?[\d.]+)px/g,
      fn: text => {
        const px = parseFloat(text);
        let resultValue = this.cleanZero((px / this.cog.rootFontSize).toFixed(this.cog.fixedDigits));
        const value = resultValue + 'rem';
        const label = `${px}px -> ${value}`;
        return { text, px: `${px}px`, pxValue: px, remValue: resultValue, rem: value, value, label };
      },
    },
    {
      type: 'remToPx',
      single: /([-]?[\d.]+)r(e|em)?$/,
      all: /([-]?[\d.]+)rem/g,
      fn: text => {
        const px = parseFloat(text);
        let resultValue = this.cleanZero((px * this.cog.rootFontSize).toFixed(this.cog.fixedDigits));
        const value = resultValue + 'px';
        const label = `${px}rem -> ${value}`;
        return { text, px: `${px}px`, pxValue: px, remValue: resultValue, rem: value, value, label };
      },
    },
  ];

  private cleanZero(val: string): number {
    if (this.cog.autoRemovePrefixZero) {
      if (val.toString().startsWith('0.')) {
        val = val.toString().substring(1);
      }
    }
    return +val;
  }

  private getRule(type: RuleOPType, text: string): { rule: Rule; text: string } | null {
    console.log(text);
    for (const rule of this.rules) {
      const match = text.match(rule[type]);
      if (match) {
        return { rule, text: match[1] };
      }
    }
    return null;
  }

  convert(text: string): Result {
    const res = this.getRule('single', text);
    if (res == null) return null;

    return res.rule.fn(res.text);
  }

  convertAll(code: string, ingores: string[], type: Type): string {
    if (!code) return code;

    const rule = this.rules.find(w => w.type === type);

    return code.replace(rule.all, (word: string) => {
      if (ingores.includes(word)) return word;
      const res = rule.fn(word);
      if (res) return res.value;
      return word;
    });
  }
}
