---
title: JycService（MQTT 前台服务）
description: 前台 Service 保活 MQTT 连接，拉起 JycMqttClient
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/mqtt/JycService.java`

## 一句话职责
前台 Service，保活 MQTT 连接——让 MQTT 在 App 退到后台也不被杀，同时拉起 `JycMqttClient`。

## 关键成员
| 名称 | 干嘛 |
|---|---|
| `onCreate()` | 启 `JycMqttClient.connect()` |
| `onStartCommand()` | 前台服务通知（常驻通知栏） |

## 白话走读
- 标准前台服务，`foregroundServiceType=dataSync`。
- `MainActivity` 在 `sync()` 后 `startService` 拉它。
- 若服务被系统杀，需配合 `Self` 开机广播或 `com.jyc.keepalive` 保活 App 重启。

## 与其他模块的接线
- 调 `JycMqttClient`
- 被 `JsInteration.sync` / `MainActivity` 启动

## 已知问题
无标记。注意保活依赖外部 App（keepalive），运维时确认其已安装。
