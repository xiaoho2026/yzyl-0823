---
title: Self（开机自启）
description: BOOT_COMPLETED 拉起 MainActivity，已注册
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/utils/Self.java`

## 一句话职责
开机自启广播接收器——设备通电/`BOOT_COMPLETED` 时拉起 `MainActivity`。

## 关键逻辑
- `onReceive` → `startActivity(MainActivity)`（带 FLAG_ACTIVITY_NEW_TASK）

## 白话走读
- 中控屏断电再来电，自动起 App，无需人工。
- 在 `AndroidManifest` 注册（priority 1000），`SwitchReceiver` 未注册（B-02）。

## 与其他模块的接线
- 被系统 `BOOT_COMPLETED` 触发
- 启 `MainActivity`

## 已知问题
无标记。与 keepalive App 共同保活。
