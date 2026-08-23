---
title: NettyClientHandler（门牌 TCP）
description: 门牌 TCP：每2s ping、opendoor、读空闲重连
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/netty/NettyClientHandler.java`

## 一句话职责
门牌 TCP 客户端——连 `172.16.50.27:13580`，每 2s 发 ping 保活，收 pong 忽略，读空闲 10s 且网络可用则断开重连。

## 关键逻辑
| 行为 | 说明 |
|---|---|
| `send("ping")` | 定时心跳 |
| `send("opendoor")` | 开门指令（物理按键3 走这，非 H5） |
| 读空闲 10s | 触发断线重连 |

## 白话走读
- 门牌是独立 TCP 服务，和 MQTT/Node-RED 不是一套。
- `opendoor` 在此有实现，但 H5 的 `android.opendoor()` 在 App 端**没有**对应方法（B-04）——两条开门路不一致。

## 与其他模块的接线
- 被 `Netty.tcpClient` 启
- `SwitchReceiver` 按键3 调其 `send("opendoor")`（但未注册，B-02）

## 已知问题
B-04（H5 opendoor 未实现）、B-02（SwitchReceiver 未注册但逻辑在此被引用）
