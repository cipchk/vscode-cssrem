import { Config, Result, Rule, RuleOPType, Type } from './interface';

export class CssRemProcess {
  private rules: Rule[] = [
    {
      all: /([-]?[\d.]+)px/g,
      type: 'pxToRem',
      single: /([-]?[\d.]+)p(x)?$/,
      fn: text => {
        const px = parseFloat(text);
        const resultValue = this.cleanZero((px / this.cog.rootFontSize).toFixed(this.cog.fixedDigits));
        const value = resultValue + 'rem';
        const label = `${px}px -> ${value}`;
        return {
          text,
          px: `${px}px`,
          pxValue: px,
          remValue: resultValue,
          rem: value,
          value,
          label,
          documentation: this.genDocument(
            `将 {0}px 转换为 {1} （当前基准大小 ${this.cog.rootFontSize}px，可参考[配置文档](https://github.com/cipchk/vscode-cssrem#configuration)修改）`,
            [px, value],
          ),
        };
      },
    },
    {
      type: 'remToPx',
      single: /([-]?[\d.]+)r(e|em)?$/,
      all: /([-]?[\d.]+)rem/g,
      fn: text => {
        const px = parseFloat(text);
        const resultValue = this.cleanZero((px * this.cog.rootFontSize).toFixed(this.cog.fixedDigits));
        const value = resultValue + 'px';
        const label = `${px}rem -> ${value}`;
        return {
          text,
          px: `${px}px`,
          pxValue: px,
          remValue: resultValue,
          rem: value,
          value,
          label,
          documentation: this.genDocument(
            `将 {0}rem 转换为 {1} （当前基准大小 ${this.cog.rootFontSize}px，可参考[配置文档](https://github.com/cipchk/vscode-cssrem#configuration)修改）`,
            [px, value],
          ),
        };
      },
    },
    {
      type: 'pxToRpx',
      single: /([-]?[\d.]+)p(x)?$/,
      all: /([-]?[\d.]+)px/g,
      fn: text => {
        const px = parseFloat(text);
        const resultValue = this.cleanZero((px * (this.cog.wxssScreenWidth / this.cog.wxssDeviceWidth)).toFixed(this.cog.fixedDigits));
        const value = resultValue + 'rpx';
        const label = `${px}px -> ${value}`;
        return {
          text,
          px: `${px}px`,
          pxValue: px,
          rpxValue: resultValue,
          rpx: value,
          value,
          label,
          documentation: this.genDocument(
            `**WXSS小程序样式** 将 {0}px 转换为 {1} （当前设备宽度 ${this.cog.wxssDeviceWidth}px，可参考[配置文档](https://github.com/cipchk/vscode-cssrem#configuration)修改）`,
            [px, value],
          ),
        };
      },
    },
    {
      type: 'rpxToPx',
      single: /([-]?[\d.]+)r(p|px)?$/,
      all: /([-]?[\d.]+)rpx/g,
      fn: text => {
        const px = parseFloat(text);
        const resultValue = this.cleanZero((px / (this.cog.wxssScreenWidth / this.cog.wxssDeviceWidth)).toFixed(this.cog.fixedDigits));
        const value = resultValue + 'px';
        const label = `${px}rpx -> ${value}px`;
        return {
          text,
          px: `${px}px`,
          pxValue: px,
          rpxValue: resultValue,
          rpx: value,
          value,
          label,
          documentation: this.genDocument(
            `**WXSS小程序样式** 将 {0}rpx 转换为 {1} （当前设备宽度 ${this.cog.wxssDeviceWidth}px，可参考[配置文档](https://github.com/cipchk/vscode-cssrem#configuration)修改）`,
            [px, value],
          ),
        };
      },
    },
  ];
  constructor(private cog: Config) {}

  convert(text: string): Result[] {
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

    const rule = this.rules.find(w => w.type === type);

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

  private cleanZero(val: string): number {
    if (this.cog.autoRemovePrefixZero) {
      if (val.toString().startsWith('0.')) {
        val = val.toString().substring(1);
      }
    }
    return +val;
  }

  private genDocument(message: string, args: any[]): string {
    // https://github.com/microsoft/vscode-nls/blob/master/src/common/common.ts
    return message.replace(/\{(\d+)\}/g, (match, rest) => {
      const index = rest[0];
      const arg = args[index];
      let replacement = match;
      if (typeof arg === 'string') {
        replacement = arg;
      } else if (typeof arg === 'number' || typeof arg === 'boolean' || arg === void 0 || arg === null) {
        replacement = String(arg);
      }
      return replacement;
    });
  }

  private getRule(type: RuleOPType, text: string): Array<{ rule: Rule; text: string }> {
    const result: Array<{ rule: Rule; text: string }> = [];
    for (const rule of this.rules) {
      const match = text.match(rule[type]);
      if (match) {
        result.push({ rule, text: match[1] });
      }
    }
    return result;
  }
}
