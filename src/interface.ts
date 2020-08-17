export interface Config {
  /** root font-size (unit: px), default: 16 */
  rootFontSize: number;
  /** Px to rem decimal point maximum length, default: 6 */
  fixedDigits: number;
  /** Automatically remove prefix 0, default: true */
  autoRemovePrefixZero: boolean;
  /** Ignores `px` to `rem` when trigger command, can be set `[ \"1px\", \"0.5px\" ]`, default: [] */
  ingoresViaCommand: string[];
}

export interface Rule {
  type: Type;
  single: RegExp;
  all: RegExp;
  fn: (text: string) => Result;
}

export type Type = 'pxToRem' | 'remToPx';

export type RuleOPType = 'single' | 'all';

export interface Result {
  text: string;
  px: string;
  pxValue: number | string;
  rem: string;
  remValue: number | string;
  label: string;
  value: string;
}
