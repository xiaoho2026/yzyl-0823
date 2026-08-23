---
title: HopeJs（灯带控制）
description: 灯带：adb 写 sys 节点 led_con_h/zigbee_reset，绕开 Node-RED
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/api/HopeJs.java`

## 一句话职责
灯带控制——把颜色写进 Linux sys 节点（`led_con_h` / `zigbee_reset`），用 adb/root 命令，绕开 Node-RED。

## 关键方法
| 方法 | 干嘛 |
|---|---|
| `updateLightBarColor(id)` | 调 `AdbUtil` 执行 `su` 写 `/sys/.../led_con_h` 节点 |
| 节点值 | `0x00~0x17`（24 路灯带，硬编码 B-09） |

## 白话走读
- H5 `led.control` → `JsInteration.updateHopeLightBarColor` → `HopeJs.updateLightBarColor`。
- 走 **adb root 写 sys 节点**，不经 MQTT/Node-RED，所以 Node-RED 流里没有灯带逻辑（手册 9.5）。
- 需设备已 root，否则写节点失败。

## 与其他模块的接线
- 被 `JsInteration.updateHopeLightBarColor` 调
- 调 `utils/AdbUtil`

## 已知问题
B-01（调用名拼写错导致进不来）、B-09（节点硬编码，扩灯带需改代码）
