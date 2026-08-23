---
title: JycApplication（启动初始化）
description: App 启动：初始化 SDK、读 conf.ini 覆盖配置、拉起 Netty 四通道
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/JycApplication.java`

## 一句话职责
App 的"开机自检"——Application 启动时初始化设备 SDK、读 `conf.ini` 配置、拉起 Netty 的四件套通道（TCP服务/门牌客户端/部署客户端/心跳）。

## 关键成员
| 名称 | 类型 | 干嘛 | 接收 | 发出 |
|---|---|---|---|---|
| `onCreate()` | 生命周期 | 初始化入口 | 系统启动 | 启 Netty、读配置、初始化设备 |
| `initSDK()` | 方法 | 调设备厂商 SDK（巨典等） | — | 设备就绪 |
| `readIni()` | 方法 | 用 `Ini4jUtil` 读 `conf.ini` 覆盖 `Constant` 字段 | `conf.ini` | 覆盖 `WEB` 等 |

## 白话走读
1. `onCreate` 最先跑（比 MainActivity 早）。
2. 先 `initSDK` 让硬件 SDK 就绪。
3. `readIni` 读外部 `conf.ini`（**运行时配置覆盖点**），这就是为什么部署工具能改 `web` 而不重打包。
4. 启动 `Netty`：监听 8888 收 PC 工具下发、连门牌 TCP、起部署客户端、起定时心跳。

## 与其他模块的接线
- 调 `utils/Ini4jUtil`、`netty/Netty`
- 读 `conf.ini`（部署工具 type4 可写）

## 已知问题
无标记。注意 `conf.ini` 覆盖机制是系统灵活性的关键，改动需同步速查表/手册。
