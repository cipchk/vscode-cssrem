export interface Config {
  /** root font-size (unit: px), default: 16 */
  rootFontSize: number;
  /** Px to rem decimal point maximum length, default: 6 */
  fixedDigits: number;
  /** Automatically remove prefix 0, default: true */
  autoRemovePrefixZero: boolean;
  /** Ignores `px` to `rem` when trigger command, can be set `[ \"1px\", \"0.5px\" ]`, default: [] */
  ingoresViaCommand: string[];
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
  single: RegExp;
  all: RegExp;
  fn: (text: string) => Result;
}

export type Type = 'pxToRem' | 'remToPx' | 'pxToRpx' | 'rpxToPx';

export type RuleOPType = 'single' | 'all';

export interface Result {
  text: string;
  px?: string;
  pxValue?: number | string;
  rem?: string;
  remValue?: number | string;
  rpx?: string;
  rpxValue?: number | string;
  label: string;
  value: string;
  documentation?: string;
}
