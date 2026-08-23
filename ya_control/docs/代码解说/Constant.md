---
title: Constant（配置中心）
description: App 配置中心：所有 IP/端口/MQTT 主题/路径/设备型号常量；WEB 默认值白屏坑
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/utils/Constant.java`

## 一句话职责
系统的"配置中心"——所有 IP、端口、MQTT 主题、路径、设备型号都定义在这里的静态常量。改环境（换中控屏 IP、换 broker）先看这里。

## 关键成员
| 名称 | 值 | 干嘛 | 坑/注意 |
|---|---|---|---|
| `MQTT_HOST` | `tcp://172.168.30.101:39201` | 连中控屏本机 Node-RED 的 aedes broker | **硬协议边界**，勿改（宪法 4.4） |
| `SERVER_IP` | `172.16.50.27:13580` | 门牌 TCP 服务器 | 门牌通道 |
| `UDP_HOST`/`UDP_PORT` | `225.0.0.20`/`55555` | 设备发现组播 | 部署工具靠它发现屏 |
| `BIND_PORT` | `8888` | 本机 TCP 监听（收 PC 工具下发） | |
| `SUB_TOPIC` | 5 个 `/jyc/*` + `/yzyl/control` | MQTT 订阅主题 | 见速查表 |
| `PROJECT` | `.../yz_control`（外部存储根） | 工程/配置/APK 落地目录 | |
| `WEB` | `file:///android_asset/html/index_android.html` | 默认首页 | ⚠️ 真实前端无此文件，部署须用 conf.ini 改 `web`（B-03） |
| `DEVICE_TYPE`/`MODEL` | `["yz", "rk", "xcy", "cy"]` | 设备型号→APK 安装匹配 | |

## 白话走读
全是 `public static final`。App 启动和各模块直接引用。注意 `WEB` 默认值是个**坑**：前端工程入口是 `总控选择.html`，但默认指向不存在的 `index_android.html`，靠部署时 conf.ini 覆盖。

## 与其他模块的接线
- 被几乎所有模块引用（Netty、Mqtt、MainActivity、JsInteration）
- `WEB` 的实际值运行时可被 `Ini4jUtil` 从 `conf.ini` 覆盖

## 已知问题
B-03（WEB 默认值导致白屏风险）、B-08（会议 host 硬编码在 JS 不在本文件，但环境配置思路同此）
