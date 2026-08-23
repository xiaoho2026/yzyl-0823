---
title: Netty（网络通道总控）
description: 启 TCP 服务(8888)/门牌客户端/UDP 组播/心跳，四件套
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/netty/Netty.java`

## 一句话职责
网络通道总控——启 TCP 服务（收 PC 工具下发）、门牌 TCP 客户端、部署客户端、UDP 组播上报、定时心跳。

## 关键成员
| 方法 | 干嘛 | 对应协议 |
|---|---|---|
| `tcpServer()` | 监听 `BIND_PORT=8888`，接 `DecoderHandler`+`NettyServerHandler` | 收工程/APK/配置（type1/2/3/4） |
| `tcpClient()` | 连门牌 `SERVER_IP` | 门牌通信 |
| `udpClient()` | 组播 `225.0.0.20:55555` 每5s 上报设备信息 | 部署工具发现屏 |
| `sendHeartBeat()` | 定时发心跳 | 保活 |

## 白话走读
- `JycApplication.onCreate` 调它，四件套一起起。
- TCP 服务用 Netty `ServerBootstrap`， pipeline 挂 `DecoderHandler`（解帧）→ `NettyServerHandler`（业务）。
- UDP 用 `MulticastSocket`，上报 `{"type":0, ...设备信息}`。

## 与其他模块的接线
- 被 `JycApplication` 调
- 内联 `DecoderHandler` / `NettyServerHandler` / `NettyClientHandler`

## 已知问题
B-15（与 PC 工具 exe 协议耦合，改一端需同步）
