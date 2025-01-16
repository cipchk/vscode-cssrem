import * as assert from 'assert';
import { RULES } from '../rules';
import { testConfig } from '../config';

suite('rules', () => {
  suite('pxToRem', () => {
    testConfig({
      rootFontSize: 16,
      fixedDigits: 2,
      autoRemovePrefixZero: true,
    });
    const rule = RULES.find((w) => w.type === 'pxToRem');

    test('should be working', () => {
      const res = rule?.fn(`12px`);
      assert.equal(res?.value, `.75rem`);
    });

    test(`should be return null when character can't be parsed as a number`, () => {
      const res = rule?.fn(`&.px`);
      assert.equal(res, null);
    });
  });
});
