---
title: SwitchReceiver（物理按键）
description: 按键1/2→control_jdq、按键3→门牌opendoor；逻辑在但未注册
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/utils/SwitchReceiver.md`

## 一句话职责
物理按键接收器——按键1/2 触发 `control_jdq`、按键3 走门牌 TCP `opendoor`。**逻辑已实现但未在 Manifest 注册。**

## 关键逻辑
| 按键 | 动作 |
|---|---|
| 1 | `control_jdq('1')` |
| 2 | `control_jdq('2')` |
| 3 | `NettyClientHandler.send("opendoor")` |

## 白话走读
- 代码完整，但 `AndroidManifest.xml` 没有它的 `<receiver>` 注册 → 按键无效。
- 按键3 开门走门牌 TCP（非 H5 的 `opendoor()`），这是另一条路。

## 与其他模块的接线
- 调 `NettyClientHandler.send`
- H5 侧 `control_jdq` 仅部分页实现

## 已知问题
B-02（未注册，按键不生效）、B-04（H5 opendoor 无 App 方法，但此处按键3 有）
