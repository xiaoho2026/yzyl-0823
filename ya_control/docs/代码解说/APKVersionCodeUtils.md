---
title: APKVersionCodeUtils（APK 版本）
description: 取本机/本地 APK 版本，静默安装判断
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/utils/APKVersionCodeUtils.java`

## 一句话职责
APK 版本工具——取本机/本地 APK 的 versionName/versionCode，用于静默安装时判断版本。

## 关键方法
| 方法 | 干嘛 |
|---|---|
| `getVersionName(ctx)` | 当前 App 版本名 |
| `getAPKVersion(path)` | 待装 APK 的版本信息 |

## 白话走读
- 部署工具下发 APK（type3），`NettyServerHandler` 用此判断型号/版本后安装。
- `versionCode` 在 `build.gradle` 用 `time()` 生成 `yyyyMMdd`，每天构建不同。

## 与其他模块的接线
- 被 `NettyServerHandler`(type3) 调

## 已知问题
无标记。
