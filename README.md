# cssrem

一个CSS值转REM的VSCode插件

![效果图](screenshots/cssrem.gif)

# Install

```bash
ext install cssrem
```

# How To Use

+ Auto snippet
+ Shortcuts: `ctrl+p ctrl+r`
+ CLI: Press `F1`, enter `cssrem`

# Support Language

html vue css less scss sass stylus

# Configuration

+ `cssrem.rootFontSize` root font-size (unit: px), default: 16
+ `cssrem.fixedDigits` px转rem小数点最大长度，默认：6。
+ `cssrem.autoRemovePrefixZero` 自动移除0开头的前缀，默认：true

Restart vscode **[!Important]**