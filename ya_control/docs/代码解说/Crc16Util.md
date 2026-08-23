---
title: Crc16Util（CRC 工具）
description: Modbus CRC16 计算，当前无调用（死代码）
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/utils/Crc16Util.java`

## 一句话职责
Modbus CRC16 计算工具——**当前无任何调用（死代码）**。

## 关键方法
| 方法 | 干嘛 |
|---|---|
| `getCRC()` / `crc16()` | 算 CRC16 |

## 白话走读
- Node-RED 侧空调用 `crc16Modbus`、联克用 `makeCheckSum`，App 端这套 CRC 没接上。
- 门牌 Modbus 未在此实现，故闲置。

## 与其他模块的接线
- 无调用方

## 已知问题
B-07（死代码，可删或接入门牌 Modbus）
