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
      hover: cog.remHover ? /([-]?[\d.]+)px/ : null,
      hoverFn: pxText => {
        const px = parseFloat(pxText);
        const val = +(px / cog.rootFontSize).toFixed(cog.fixedDigits);
        return {
          type: 'remToPx',
          from: `${px}px`,
          to: `${val}rem`,
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
        const rem = parseFloat(remText);
        const val = +(rem * cog.rootFontSize).toFixed(cog.fixedDigits);
        return {
          type: 'remToPx',
          from: `${rem}rem`,
          to: `${val}px`,
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
  if (cog.vw) {
    RULES.push(
      {
        type: 'pxToVw',
        all: /([-]?[\d.]+)px/g,
        single: /([-]?[\d.]+)p(x)?$/,
        fn: text => {
          const px = parseFloat(text);
          const resultValue = +(px / (cog.vwDesign / 100.0)).toFixed(cog.fixedDigits);
          const value = cleanZero(resultValue) + 'vw';
          const label = `${px}px -> ${value}`;
          return {
            type: 'pxToVw',
            text,
            px: `${px}px`,
            pxValue: px,
            vwValue: resultValue,
            vw: value,
            value,
            label,
            documentation: localize(
              `pxToVw.documentation`,
              'Convert `{0}px` to `{1}` (current device width `{2}px`, base font size is `{3}px`)',
              px,
              value,
              cog.vwDesign,
              cog.rootFontSize,
            ),
          };
        },
        hover: cog.vwHover ? /([-]?[\d.]+)px/ : null,
        hoverFn: pxText => {
          const px = parseFloat(pxText);
          const val = +(px / (cog.vwDesign / 100.0)).toFixed(cog.fixedDigits);
          console.log('pxToVw', px, val, cog.rootFontSize);
          return {
            type: 'pxToVw',
            from: `${px}px`,
            to: `${val}vw`,
            documentation: localize(
              `pxToVw.documentation.hover`,
              'Convert `{0}px` to `{1}vw` (current device width `{2}px`, base font size is `{3}px`)',
              val,
              cog.rootFontSize,
              cog.vwDesign,
              cog.rootFontSize,
            ),
          };
        },
      },
      {
        type: 'vwToPx',
        all: /([-]?[\d.]+)vw/g,
        single: /([-]?[\d.]+)vw?$/,
        fn: text => {
          const vw = parseFloat(text);
          const resultValue = +(vw * (cog.vwDesign / 100.0)).toFixed(cog.fixedDigits);
          const value = cleanZero(resultValue) + 'px';
          const label = `${vw}vw -> ${value}`;
          return {
            type: 'vwToPx',
            text,
            px: `${vw}px`,
            pxValue: vw,
            vwValue: resultValue,
            vw: value,
            value,
            label,
            documentation: localize(
              `vwToPx.documentation`,
              'Convert `{0}vw` to `{1}` (current device width `{2}px`, base font size is `{3}px`)',
              vw,
              value,
              cog.vwDesign,
              cog.rootFontSize,
            ),
          };
        },
        hover: /([-]?[\d.]+)vw/,
        hoverFn: rpxText => {
          const vw = parseFloat(rpxText);
          const val = +(vw * (cog.vwDesign / 100.0)).toFixed(cog.fixedDigits);
          return {
            type: 'vwToPx',
            from: `${vw}vw`,
            to: `${val}px`,
            documentation: localize(
              `vwToPx.documentation.hover`,
              'Converted from `{0}px` (current device width `{1}px`, base font size is `{2}px`)',
              val,
              cog.vwDesign,
              cog.rootFontSize,
            ),
          };
        },
      },
      {
        type: 'vwSwitchPx',
        all: /([-]?[\d.]+)(vw|px)/g,
        fn: text => {
          const type: Type = text.endsWith('px') ? 'pxToVw' : 'vwToPx';
          const rule = RULES.find(r => r.type === type);
          return rule.fn(text);
        },
      },
    );
  }
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
          const rpx = parseFloat(rpxText);
          const val = +(rpx / (cog.wxssScreenWidth / cog.wxssDeviceWidth)).toFixed(cog.fixedDigits);
          return {
            type: 'rpxToPx',
            from: `${rpx}rpx`,
            to: `${val}px`,
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
          const type: Type = text.endsWith('rpx') ? 'rpxToPx' : 'pxToRpx';
          const rule = RULES.find(r => r.type === type);
          return rule.fn(text);
        },
      },
    );
  }
}
