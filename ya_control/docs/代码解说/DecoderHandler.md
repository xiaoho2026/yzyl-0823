---
title: DecoderHandler（TCP 解帧）
description: 按 4 字节长度前缀切包，解决粘包；与 PC 工具帧格式契约
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/netty/DecoderHandler.java`

## 一句话职责
TCP 解帧器——把字节流按"4 字节长度前缀"切成完整包，交给 `NettyServerHandler`。

## 关键逻辑
- 读前 4 字节 = 包体长度 `len`
- 等凑齐 `len` 字节再往后传（解决 TCP 粘包/拆包）
- 对应 PC 工具 `中控上传程序.exe` 的 `FixLength`/`futureLen`/`length` 字段

## 白话走读
- Netty `LengthFieldBasedFrameDecoder` 思路的手动实现。
- 这是 App 与 PC 工具能互通的**帧格式契约**之一（宪法 4.4 硬边界）。

## 与其他模块的接线
- pipeline 在 `Netty.tcpServer` 里挂在 `NettyServerHandler` 前

## 已知问题
B-15（帧格式与 exe 耦合，勿单独改）
