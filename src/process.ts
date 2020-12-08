import * as nls from 'vscode-nls';
import { Config, Result, Rule, RuleOPType, Type } from './interface';

const localize = nls.config({ messageFormat: nls.MessageFormat.both })();

export class CssRemProcess {
  private rules: Rule[] = [
    {
      all: /([-]?[\d.]+)px/g,
      type: 'pxToRem',
      single: /([-]?[\d.]+)p(x)?$/,
      fn: text => {
        const px = parseFloat(text);
        const resultValue = +(px / this.cog.rootFontSize).toFixed(this.cog.fixedDigits);
        const value = this.cleanZero(resultValue) + 'rem';
        const label = `${px}px -> ${value}`;
        return {
          text,
          px: `${px}px`,
          pxValue: px,
          remValue: resultValue,
          rem: value,
          value,
          label,
          documentation: localize(
            `pxToRem.documentation`,
            `Convert {0}px to {1} (the current benchmark font-size is {2}px, please refer to [Configuration Document](https://github.com/cipchk/vscode-cssrem#configuration) modify`,
            px,
            value,
            this.cog.rootFontSize,
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
        const resultValue = +(px * this.cog.rootFontSize).toFixed(this.cog.fixedDigits);
        const value = this.cleanZero(resultValue) + 'px';
        const label = `${px}rem -> ${value}`;
        return {
          text,
          px: `${px}px`,
          pxValue: px,
          remValue: resultValue,
          rem: value,
          value,
          label,
          documentation: localize(
            `remToPx.documentation`,
            `Convert {0}rem to {1} (the current benchmark font-size is {2}px, please refer to [Configuration Document](https://github.com/cipchk/vscode-cssrem#configuration) modify`,
            px,
            value,
            this.cog.rootFontSize,
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
        const resultValue = +(px * (this.cog.wxssScreenWidth / this.cog.wxssDeviceWidth)).toFixed(this.cog.fixedDigits);
        const value = this.cleanZero(resultValue) + 'rpx';
        const label = `${px}px -> ${value}`;
        return {
          text,
          px: `${px}px`,
          pxValue: px,
          rpxValue: resultValue,
          rpx: value,
          value,
          label,
          documentation: localize(
            `pxToRpx.documentation`,
            `**WXSS miniprogram style** Convert {0}px to {1} (the current device width is {2}px, please refer to [Configuration Document](https://github.com/cipchk/vscode-cssrem#configuration) modify)`,
            px,
            value,
            this.cog.wxssDeviceWidth,
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
        const resultValue = +(px / (this.cog.wxssScreenWidth / this.cog.wxssDeviceWidth)).toFixed(this.cog.fixedDigits);
        const value = this.cleanZero(resultValue) + 'px';
        const label = `${px}rpx -> ${value}px`;
        return {
          text,
          px: `${px}px`,
          pxValue: px,
          rpxValue: resultValue,
          rpx: value,
          value,
          label,
          documentation: localize(
            `rpxToPx.documentation`,
            `**WXSS miniprogram style** Convert {0}rpx to {1} (the current device width is {2}px, please refer to [Configuration Document](https://github.com/cipchk/vscode-cssrem#configuration) modify)`,
            px,
            value,
            this.cog.wxssDeviceWidth,
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

  private cleanZero(val: number): string {
    if (this.cog.autoRemovePrefixZero) {
      if (val.toString().startsWith('0.')) {
        return val.toString().substring(1);
      }
    }
    return val + '';
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
