import * as nls from 'vscode-nls';
import { cog } from './config';
import { Rule, Type } from './interface';

const localize = nls.config({ messageFormat: nls.MessageFormat.both })();

export const RULES: Rule[] = [];

function cleanZero(val: number): string {
  if (cog.autoRemovePrefixZero) {
    if (val.toString().startsWith('0.')) {
      return val.toString().substring(1);
    }
  }
  return val + '';
}

export function resetRules(): void {
  RULES.length = 0;
  RULES.push(
    {
      type: 'pxToRem',
      all: /([-]?[\d.]+)px/g,
      single: /([-]?[\d.]+)p(x)?$/,
      fn: text => {
        const px = parseFloat(text);
        const resultValue = +(px / cog.rootFontSize).toFixed(cog.fixedDigits);
        const value = cleanZero(resultValue) + 'rem';
        const label = `${px}px -> ${value}`;
        return {
          type: 'pxToRem',
          text,
          px: `${px}px`,
          pxValue: px,
          remValue: resultValue,
          rem: value,
          value,
          label,
          documentation: localize(
            `pxToRem.documentation`,
            'Convert `{0}px` to `{1}` (the current benchmark font-size is `{2}px`, please refer to [Configuration Document](https://github.com/cipchk/vscode-cssrem#configuration) modify',
            px,
            value,
            cog.rootFontSize,
          ),
        };
      },
      hover: /([-]?[\d.]+)px/,
      hoverFn: pxText => {
        const val = +(parseFloat(pxText) / cog.rootFontSize).toFixed(cog.fixedDigits);
        return {
          type: 'remToPx',
          documentation: localize(
            `pxToRem.documentation.hover`,
            'Converted from `{0}rem` according to the benchmark font-size is `{1}px`',
            val,
            cog.rootFontSize,
          ),
        };
      },
    },
    {
      type: 'remToPx',
      all: /([-]?[\d.]+)rem/g,
      single: /([-]?[\d.]+)r(e|em)?$/,
      fn: text => {
        const px = parseFloat(text);
        const resultValue = +(px * cog.rootFontSize).toFixed(cog.fixedDigits);
        const value = cleanZero(resultValue) + 'px';
        const label = `${px}rem -> ${value}`;
        return {
          type: 'remToPx',
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
            cog.rootFontSize,
          ),
        };
      },
      hover: /([-]?[\d.]+)rem/,
      hoverFn: remText => {
        const val = +(parseFloat(remText) * cog.rootFontSize).toFixed(cog.fixedDigits);
        return {
          type: 'pxToRem',
          documentation: localize(
            `remToPx.documentation.hover`,
            'Converted from `{0}px` according to the benchmark font-size is `{1}px`, please refer to [Configuration Document](https://github.com/cipchk/vscode-cssrem#configuration) modify',
            val,
            cog.rootFontSize,
          ),
        };
      },
    },
    {
      type: 'pxSwitchRem',
      all: /([-]?[\d.]+)(rem|px)/g,
      fn: text => {
        const type: Type = text.endsWith('px') ? 'pxToRem' : 'remToPx';
        const rule = RULES.find(r => r.type === type);
        return rule.fn(text);
      },
    },
  );
  if (cog.wxss) {
    RULES.push(
      {
        type: 'pxToRpx',
        all: /([-]?[\d.]+)px/g,
        single: /([-]?[\d.]+)p(x)?$/,
        fn: text => {
          const px = parseFloat(text);
          const resultValue = +(px * (cog.wxssScreenWidth / cog.wxssDeviceWidth)).toFixed(cog.fixedDigits);
          const value = cleanZero(resultValue) + 'rpx';
          const label = `${px}px -> ${value}`;
          return {
            type: 'pxToRpx',
            text,
            px: `${px}px`,
            pxValue: px,
            rpxValue: resultValue,
            rpx: value,
            value,
            label,
            documentation: localize(
              `pxToRpx.documentation`,
              '**WXSS miniprogram style** Convert `{0}px` to `{1}` (the current device width is `{2}px` and screen width is `{3}px`, please refer to [Configuration Document](https://github.com/cipchk/vscode-cssrem#configuration) modify)',
              px,
              value,
              cog.wxssDeviceWidth,
              cog.wxssScreenWidth,
            ),
          };
        },
      },
      {
        type: 'rpxToPx',
        all: /([-]?[\d.]+)rpx/g,
        single: /([-]?[\d.]+)r(p|px)?$/,
        fn: text => {
          const px = parseFloat(text);
          const resultValue = +(px / (cog.wxssScreenWidth / cog.wxssDeviceWidth)).toFixed(cog.fixedDigits);
          const value = cleanZero(resultValue) + 'px';
          const label = `${px}rpx -> ${value}px`;
          return {
            type: 'rpxToPx',
            text,
            px: `${px}px`,
            pxValue: px,
            rpxValue: resultValue,
            rpx: value,
            value,
            label,
            documentation: localize(
              `rpxToPx.documentation`,
              '**WXSS miniprogram style** Convert `{0}rpx` to `{1}` (The current device width is `{2}px` and screen width is `{3}px`, please refer to [Configuration Document](https://github.com/cipchk/vscode-cssrem#configuration) modify)',
              px,
              value,
              cog.wxssDeviceWidth,
              cog.wxssScreenWidth,
            ),
          };
        },
        hover: /([-]?[\d.]+)rpx/,
        hoverFn: rpxText => {
          const val = +(parseFloat(rpxText) / (cog.wxssScreenWidth / cog.wxssDeviceWidth)).toFixed(cog.fixedDigits);
          return {
            type: 'rpxToPx',
            documentation: localize(
              `rpxToPx.documentation.hover`,
              '**WXSS miniprogram style** Converted from `{0}px` (The current device width is `{1}px` and screen width is `{2}px`)',
              val,
              cog.wxssDeviceWidth,
              cog.wxssScreenWidth,
            ),
          };
        },
      },
      {
        type: 'rpxSwitchPx',
        all: /([-]?[\d.]+)(rpx|px)/g,
        fn: text => {
          const type: Type = text.endsWith('px') ? 'pxToRpx' : 'rpxToPx';
          const rule = RULES.find(r => r.type === type);
          return rule.fn(text);
        },
      },
    );
  }
}
