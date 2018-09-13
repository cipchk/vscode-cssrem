# cssrem

一个将 `px` 转 `rem` 的 VSCode 插件

![](screenshots/cssrem.gif)

# 如何安装

```bash
ext install cssrem
```

# 如何使用

+ 在文件内自动转换，例如录入 `12px` 智能提醒对应转化后 `rem` 值
+ 通过 `F1` 面板查找：`cssrem`

# 支持语言

html vue css less scss sass stylus tpl（php smarty3）

# 配置

点击 VS Code 的 `文件 > 首选项 > 设置`，打开设置面板：

+ `cssrem.rootFontSize` 基准font-size（单位：px），默认：16
+ `cssrem.fixedDigits` `px` 转 `rem` 小数点最大长度，默认：6
+ `cssrem.autoRemovePrefixZero` 自动移除0开头的前缀，默认：true

**注意：** 需要重新启动 VSCode 才会生效
