---
title: UiUtil（UI/设备信息）
description: 沉浸式、取 IP、设备ID(ANDROID_ID)、读 sys 节点
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/utils/UiUtil.java`

## 一句话职责
UI 与设备信息小工具——沉浸式状态栏、取 IP、生成设备 ID、读 sys 节点文件。

## 关键方法
| 方法 | 干嘛 |
|---|---|
| `hideNavigation()` | 隐藏导航栏（中控屏常驻） |
| `getIp()` | 取本机 IP |
| `getDeviceId()` | 用 `ANDROID_ID` 抽位生成设备ID |
| `readFile(path)` | 读 `/sys/...` 节点（如门牌状态） |
| `getDid()` | 读 `ro.serialno` 设备序列号 |

## 白话走读
- 纯工具，无业务分支，风险低。
- `getDeviceId` 用于 UDP 上报设备信息，让 PC 工具识别这块屏。

## 与其他模块的接线
- 被 `MainActivity`、`Netty.udpClient` 等调用

## 已知问题
无标记。
