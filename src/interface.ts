export interface Config {
  /** root font-size (unit: px), default: 16 */
  rootFontSize: number;
  /** Px to rem decimal point maximum length, default: 6 */
  fixedDigits: number;
  /** Automatically remove prefix 0, default: true */
  autoRemovePrefixZero: boolean;
  /** Ignores `px` to `rem` when trigger command, can be set `[ \"1px\", \"0.5px\" ]`, default: [] */
  ignoresViaCommand: string[];
  /**
   * Whether to enabled mark, default: false
   */
  addMark: boolean;
  /**
   * Whether to enable display conversion data on hover, Default: onlyMark
   */
  hover: 'disabled' | 'always' | 'onlyMark';
  /**
   * Whether to display mark in after line, `disabled`: Disabled, `show` Show
   */
  currentLine: 'disabled' | 'show';
  /**
   * 忽略清单，支持 glob 表达式
   */
  ignores: string[];
  /**
   * 支持语言清单
   */
  languages: string[];
  /**
   * Whether to enable rem hover
   */
  remHover: boolean;
  /**
   * Whether to enable VW switch px support
   */
  vw: boolean;
  /**
   * Whether to enable vw hover
   */
  vwHover: boolean;
  /**
   * Specifies the width of the design (equar to the browser viewport width), default: `750`
   */
  vwDesign: number;
  /**
   * Whether to enable WXSS support
   */
  wxss: boolean;
  /**
   * 规定屏幕宽度，默认 `750`，[尺寸单位](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html)
   */
  wxssScreenWidth: number;
  /**
   * 设备分辨率宽度，官方推荐使用 iPhone6 作为视觉稿的标准，默认：`375`
   */
  wxssDeviceWidth: number;
}

export interface Rule {
  type: Type;
  all: RegExp;
  single?: RegExp;
  fn: (text: string) => ConvertResult | undefined;
  hover?: RegExp | null;
  hoverFn?: (text: string) => HoverResult;
}

export type Type =
  | 'pxToRem'
  | 'remToPx'
  | 'pxSwitchRem'
  | 'pxToVw'
  | 'vwToPx'
  | 'vwSwitchPx'
  | 'pxToRpx'
  | 'rpxToPx'
  | 'rpxSwitchPx';

export type RuleOPType = 'single' | 'all';

export interface ConvertResult {
  type: string;
  text: string;
  px?: string;
  pxValue?: number | string;
  rem?: string;
  remValue?: number | string;
  vw?: string;
  vwValue?: number | string;
  rpx?: string;
  rpxValue?: number | string;
  label: string;
  value: string;
  documentation?: string;
}

export interface HoverResult {
  type: string;
  documentation: string;
  from: string;
  to: string;
}
