import { l10n } from 'vscode';
import { cog } from './config';
import { Rule, Type } from './interface';

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
      single: /([-]?[\d.]+)px?$/,
      fn: (text) => {
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
          documentation: l10n.t(
            'Convert `{px}px` to `{value}` (the current benchmark font-size is `{rootFontSize}px`',
            {
              px,
              value,
              rootFontSize: cog.rootFontSize,
            }
          ),
        };
      },
      hover: cog.remHover ? /([-]?[\d.]+)px/ : null,
      hoverFn: (pxText) => {
        const px = parseFloat(pxText);
        const rem = +(px / cog.rootFontSize).toFixed(cog.fixedDigits);
        return {
          type: 'remToPx',
          from: `${px}px`,
          to: `${rem}rem`,
          documentation: l10n.t(
            'Converted from `{rem}rem` according to the benchmark font-size is `{rootFontSize}px`',
            {
              rem,
              rootFontSize: cog.rootFontSize,
            }
          ),
        };
      },
    },
    {
      type: 'remToPx',
      all: /([-]?[\d.]+)rem/g,
      single: /([-]?[\d.]+)r(e|em)?$/,
      fn: (text) => {
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
          documentation: l10n.t(
            'Convert {px}rem to {value} (the current benchmark font-size is {rootFontSize}px',
            {
              px,
              value,
              rootFontSize: cog.rootFontSize,
            }
          ),
        };
      },
      hover: /([-]?[\d.]+)rem/,
      hoverFn: (remText) => {
        const rem = parseFloat(remText);
        const px = +(rem * cog.rootFontSize).toFixed(cog.fixedDigits);
        return {
          type: 'remToPx',
          from: `${rem}rem`,
          to: `${px}px`,
          documentation: l10n.t(
            'Converted from `{px}px` according to the benchmark font-size is `{rootFontSize}px`',
            {
              px,
              rootFontSize: cog.rootFontSize,
            }
          ),
        };
      },
    },
    {
      type: 'pxSwitchRem',
      all: /([-]?[\d.]+)(rem|px)/g,
      fn: (text) => {
        const type: Type = text.endsWith('px') ? 'pxToRem' : 'remToPx';
        const rule = RULES.find((r) => r.type === type);
        return rule?.fn(text);
      },
    }
  );
  if (cog.vw) {
    RULES.push(
      {
        type: 'pxToVw',
        all: /([-]?[\d.]+)px/g,
        single: /([-]?[\d.]+)px?$/,
        fn: (text) => {
          const px = parseFloat(text);
          const resultValue = +(px / (cog.vwDesign / 100.0)).toFixed(
            cog.fixedDigits
          );
          const vw = cleanZero(resultValue) + 'vw';
          const label = `${px}px -> ${vw}`;
          return {
            type: 'pxToVw',
            text,
            px: `${px}px`,
            pxValue: px,
            vwValue: resultValue,
            vw: vw,
            value: vw,
            label,
            documentation: l10n.t(
              'Convert `{px}px` to `{vw}` (current device width `{vwDesign}px`, base font size is `{rootFontSize}px`)',
              {
                px,
                value: vw,
                vwDesign: cog.vwDesign,
                rootFontSize: cog.rootFontSize,
              }
            ),
          };
        },
        hover: cog.vwHover ? /([-]?[\d.]+)px/ : null,
        hoverFn: (pxText) => {
          const px = parseFloat(pxText);
          const vw = +(px / (cog.vwDesign / 100.0)).toFixed(cog.fixedDigits);
          return {
            type: 'pxToVw',
            from: `${px}px`,
            to: `${vw}vw`,
            documentation: l10n.t(
              'Convert `{px}px` to `{vw}vw` (current device width `{vwDesign}px`, base font size is `{rootFontSize}px`)',
              {
                px,
                vw,
                vwDesign: cog.vwDesign,
                rootFontSize: cog.rootFontSize,
              }
            ),
          };
        },
      },
      {
        type: 'vwToPx',
        all: /([-]?[\d.]+)vw/g,
        single: /([-]?[\d.]+)vw?$/,
        fn: (text) => {
          const vw = parseFloat(text);
          const resultValue = +(vw * (cog.vwDesign / 100.0)).toFixed(
            cog.fixedDigits
          );
          const px = cleanZero(resultValue) + 'px';
          const label = `${vw}vw -> ${px}`;
          return {
            type: 'vwToPx',
            text,
            px: `${vw}px`,
            pxValue: vw,
            vwValue: resultValue,
            vw: px,
            value: px,
            label,
            documentation: l10n.t(
              'Convert `{vw}vw` to `{px}` (current device width `{vwDesign}px`, base font size is `{rootFontSize}px`)',
              {
                vw,
                px,
                vwDesign: cog.vwDesign,
                rootFontSize: cog.rootFontSize,
              }
            ),
          };
        },
        hover: /([-]?[\d.]+)vw/,
        hoverFn: (rpxText) => {
          const vw = parseFloat(rpxText);
          const px = +(vw * (cog.vwDesign / 100.0)).toFixed(cog.fixedDigits);
          return {
            type: 'vwToPx',
            from: `${vw}vw`,
            to: `${px}px`,
            documentation: l10n.t(
              'Converted from `{px}px` (current device width `{vwDesign}px`, base font size is `{rootFontSize}px`)',
              {
                px,
                vwDesign: cog.vwDesign,
                rootFontSize: cog.rootFontSize,
              }
            ),
          };
        },
      },
      {
        type: 'vwSwitchPx',
        all: /([-]?[\d.]+)(vw|px)/g,
        fn: (text) => {
          const type: Type = text.endsWith('px') ? 'pxToVw' : 'vwToPx';
          const rule = RULES.find((r) => r.type === type);
          return rule?.fn(text);
        },
      }
    );
  }
  if (cog.wxss) {
    RULES.push(
      {
        type: 'pxToRpx',
        all: /([-]?[\d.]+)px/g,
        single: /([-]?[\d.]+)px?$/,
        fn: (text) => {
          const px = parseFloat(text);
          const resultValue = +(
            px *
            (cog.wxssScreenWidth / cog.wxssDeviceWidth)
          ).toFixed(cog.fixedDigits);
          const rpx = cleanZero(resultValue) + 'rpx';
          const label = `${px}px -> ${rpx}`;
          return {
            type: 'pxToRpx',
            text,
            px: `${px}px`,
            pxValue: px,
            rpxValue: resultValue,
            rpx: rpx,
            value: rpx,
            label,
            documentation: l10n.t(
              '**WXSS miniprogram style** Convert `{px}px` to `{rpx}` (the current device width is `{wxssDeviceWidth}px` and screen width is `{wxssScreenWidth}px`)',
              {
                px,
                rpx,
                wxssDeviceWidth: cog.wxssDeviceWidth,
                wxssScreenWidth: cog.wxssScreenWidth,
              }
            ),
          };
        },
      },
      {
        type: 'rpxToPx',
        all: /([-]?[\d.]+)rpx/g,
        single: /([-]?[\d.]+)r(p|px)?$/,
        fn: (text) => {
          const rpx = parseFloat(text);
          const resultValue = +(
            rpx /
            (cog.wxssScreenWidth / cog.wxssDeviceWidth)
          ).toFixed(cog.fixedDigits);
          const px = cleanZero(resultValue) + 'px';
          const label = `${rpx}rpx -> ${px}px`;
          return {
            type: 'rpxToPx',
            text,
            px: `${rpx}px`,
            pxValue: rpx,
            rpxValue: resultValue,
            rpx: px,
            value: px,
            label,
            documentation: l10n.t(
              '**WXSS miniprogram style** Convert `{rpx}rpx` to `{px}` (The current device width is `{wxssDeviceWidth}px` and screen width is `{wxssScreenWidth}px`)',
              {
                rpx,
                px,
                wxssDeviceWidth: cog.wxssDeviceWidth,
                wxssScreenWidth: cog.wxssScreenWidth,
              }
            ),
          };
        },
        hover: /([-]?[\d.]+)rpx/,
        hoverFn: (rpxText) => {
          const rpx = parseFloat(rpxText);
          const px = +(
            rpx /
            (cog.wxssScreenWidth / cog.wxssDeviceWidth)
          ).toFixed(cog.fixedDigits);
          return {
            type: 'rpxToPx',
            from: `${rpx}rpx`,
            to: `${px}px`,
            documentation: l10n.t(
              '**WXSS miniprogram style** Converted from `{px}px` (The current device width is `{wxssDeviceWidth}px` and screen width is `{wxssScreenWidth}px`)',
              {
                px,
                wxssDeviceWidth: cog.wxssDeviceWidth,
                wxssScreenWidth: cog.wxssScreenWidth,
              }
            ),
          };
        },
      },
      {
        type: 'rpxSwitchPx',
        all: /([-]?[\d.]+)(rpx|px)/g,
        fn: (text) => {
          const type: Type = text.endsWith('rpx') ? 'rpxToPx' : 'pxToRpx';
          const rule = RULES.find((r) => r.type === type);
          return rule?.fn(text);
        },
      }
    );
  }
}
