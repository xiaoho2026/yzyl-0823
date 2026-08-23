---
title: MainActivity（主 Activity）
description: 全屏 WebView、JS Bridge 注入、Handler 消息、3 个自愈 Cron
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/MainActivity.java`

## 一句话职责
唯一 Activity——全屏 WebView 加载 H5，注入 JS Bridge，处理 11/12/13/200/666/-1 等 Handler 消息，跑 3 个定时 Cron（心跳/重启/心跳检测）。

## 关键成员
| 项 | 说明 |
|---|---|
| `onCreate` | 隐藏导航/状态栏、权限申请、**拒绝则 killProcess**、WebView 设置、加 JS Bridge、加载 `WEB` |
| `setData(json)` | 注入 H5 的回显入口（`webView.loadUrl("javascript:setData(...))"`） |
| `Handler` 消息 | 11=加载完成 / 12=加载失败重试 / 13=隐藏 loading / 200=重载 WebView / 666=? / -1=错误 |
| `CronUtil` ×3 | 10s 心跳上报 / 0,8,12,18 点重启 / 30s 检测心跳超 5min 重启 |

## 白话走读
1. 启动先要权限（悬浮窗等），拿不到直接 `killProcess` → 屏黑（B-14）。
2. WebView 加载 `Constant.WEB`（默认 `index_android.html`，部署时被 conf.ini 改）。
3. `addJavascriptInterface(new JsInteration(),"android")` 让 H5 能调原生。
4. `sync("")` 由 H5 `init()` 触发 → 启 MQTT → 收 `/jyc/control` → `setData` 回显。
5. 三个 Cron 是"自愈"机制：心跳保活、定时重启清状态、心跳超时重启救活。

## 与其他模块的接线
- 注入 `JsInteration`
- 收 `JycMqttClient` 的 `setData`
- 收 `NettyServerHandler` 的 200（重载）

## 已知问题
B-03（WEB 默认白屏）、B-14（权限拒绝杀进程体验差）、B-05（application exported 无效写法，此处无）
