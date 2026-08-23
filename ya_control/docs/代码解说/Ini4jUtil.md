---
title: Ini4jUtil（conf.ini 工具）
description: 读写 conf.ini [系统配置]，运行时配置持久化入口
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/utils/Ini4jUtil.java`

## 一句话职责
读写 `conf.ini` 的 `[系统配置]` 小节——运行时配置（MQTT/门牌/首页/设备名）的持久化入口。

## 关键方法
| 方法 | 干嘛 |
|---|---|
| `readIni()` | 读各字段覆盖 `Constant` |
| `writeIni(map)` | 部署工具 type4 调用，写回配置 |

## 白话走读
- `conf.ini` 是部署工具能"不改包"调配置的关键文件。
- 字段：`server_ip`/`server_port`/`mqtt_*`/`web`/`device_name`/`project_date`。
- `web` 字段是白屏(B-03)的开关。

## 与其他模块的接线
- 被 `JycApplication.readIni`、`NettyServerHandler`(type4) 调

## 已知问题
B-03（web 默认值与真实前端不符）
