# cssrem

Converts between `px` and `rem` units in VSCode, And support WXSS.

[中文版](README.zh-CN.md)

![](demo.gif)

# Features

- Support intellisense
  - `px` -> `rem`
  - `rem` -> `px`
  - `px` -> `rpx` (微信小程序)
  - `rpx` -> `px` (微信小程序)
- Support mouse hover to display the conversion process
- Support mark

# How To Use

+ Auto snippet
+ CLI: Press `F1`, enter `cssrem`

# Support Language

html vue css less scss sass stylus tpl（php smarty3）

# Configuration

The `.cssrem` file in the root directory has the highest priority, and it's format is as follows:

```json
{
  "rootFontSize": 18,
  "fixedDigits": 3
}
```

Secondly, you can also configure the global. Open your user and workspace settings (`File > Preferences > Settings`):

| Name | Description | Default |
|------|-------------|---------|
| `cssrem.rootFontSize` | root font-size (Unit: `px`) | `16` |
| `cssrem.fixedDigits` | Keeping decimal point maximum length | `6` |
| `cssrem.autoRemovePrefixZero` | Automatically remove prefix 0 | `true` |
| `cssrem.ingoresViaCommand` | Ignores `px` to `rem` when trigger command (Unit: `string[]`), can be set `[ "1px", "0.5px" ]` | `[]` |
| `cssrem.addMark` | Whether to enabled mark | `false` |
| `cssrem.hover` | Whether to enable display conversion data on hover, `disabled`: Disabled, `always` Anything, `onlyMark`: Only valid when `cssrem.addMark` is `true` | `onlyMark` |
| `cssrem.wxss` | **WXSS小程序样式** Whether to enable WXSS support | `false` |
| `cssrem.wxssScreenWidth` | **WXSS小程序样式** 规定屏幕宽度，默认 `750`，[尺寸单位](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html) | `750` |
| `cssrem.wxssDeviceWidth` | **WXSS小程序样式** 设备分辨率宽度，官方推荐使用 iPhone6 作为视觉稿的标准 | `375` |
