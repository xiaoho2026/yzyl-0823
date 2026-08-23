---
title: JycMqttClient（MQTT 客户端）
description: MQTT 连接与 5 主题订阅，按 topic 分流到 setData/继电器/心跳/重启
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/mqtt/JycMqttClient.java`

## 一句话职责
MQTT 客户端封装——连接中控屏本机 broker，订阅 5 个主题，把收到的消息翻译成 App 内部动作（刷新 UI / 继电器 / 心跳 / 重启）。

## 关键成员
| 名称 | 干嘛 | 接收 | 发出 |
|---|---|---|---|
| `connect()` | 连 `Constant.MQTT_HOST`，订阅 `SUB_TOPIC` | — | MQTT 连接 |
| `subscribe()` | 订阅 5 主题 | — | 订阅 |
| `publish(topic,payload)` | 发消息 | H5/App | `/jyc/control` 等 |
| `messageArrived()` | 回调：按 topic 分流 | MQTT 消息 | 见下 |

## 话题分流（messageArrived）
| 收到 topic | 动作 |
|---|---|
| `/jyc/control` | `MainActivity.setData(json)` 注入 H5 回显 |
| `/jyc/feedback` | 同上（兼容） |
| `/jyc/relay` | 广播 `com.judian.broadcast.relay.control`（巨典继电器） |
| `/jyc/heartbeatback` | 更新 `heartbeatTime`（判在线） |
| `/jyc/reboot` | 发 `ACTION_RK_REBOOT` 重启设备 |

## 白话走读
- 连接失败有重连逻辑。
- 注意 `/jyc/control` 和 `/jyc/feedback` 都走 `setData`——Node-RED 回显用的是 control 不是 feedback（见速查表/手册），这里兼容两者。
- 心跳：`/jyc/heartbeatback` 只更新时间戳，真正判死在 `MainActivity` 的 30s 检测 Cron。

## 与其他模块的接线
- 被 `JycService` 调用
- 调 `MainActivity.setData`、发广播、重启
- 远端对应 Node-RED 的 `/jyc/*` 节点

## 已知问题
无标记。B-15（协议耦合）涉及此处帧/topic，改动须配套。
