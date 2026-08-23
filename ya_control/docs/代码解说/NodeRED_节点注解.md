---
title: Node-RED 节点注解
description: 中控流核心：翻译/队列/场景/持久化，点号→协议映射
type: 分片
---

## 文件
`亚中.json`（Node-RED 流，部署在中控屏本机）

## 一句话职责
中控逻辑大脑——把 MQTT `/jyc/control` 的设备点号翻译成各品牌硬件私有协议，下发 TCP；并持久化状态、跑定时场景。

## 核心节点注解（按职责）
| 节点名 / id | 干嘛 | 关键点 |
|---|---|---|
| aedes broker `e3dd311b` | 本地 MQTT 服务器 | 端口 39201，App 连的就是它 |
| mqtt in `/jyc/control` | 收 H5/小程序指令 | 4 路并行 |
| `数据添加到内存` `8ec6ed7f` | 展开 child → `global.save` → 写 `save.json` | 状态持久化 |
| `解析网络协议(非凡士/空调)` `df48873f` | 灯光/空调/新风/多联机 转协议 | 点号分段见速查表 |
| `解析网络协议(联克)` `d40733b` | 联克继电器 `8xxxxxx` 转帧 | 走 `link_tcps` 队列 |
| `接收小程序控制` `2ae2e8a4` | `/yzyl/control` 云 → 取 data → 转发 | 微信小程序入口 |
| `将内存中的数据发送` `e72ac5fd` | `/jyc/getData` → 回 `/jyc/control` | 回显走 control 非 feedback |
| `mqtt out /jyc/heartbeatback` | 心跳应答 | |
| `开机读取数据` `72f9de38` | 读 `save.json` 重建内存 | 点号≤370 强制 false |
| `空调编号` `699c9af8` | 空调 `IP:port→面板ID` 映射 | 1~5楼+-1楼 |
| `继电器编号` `8028443f` | 联克 `links[楼层]` 映射 | **仅 -1 楼**（B-11） |
| `队列解析`(空调) `8d348f4f` | 每1s 发 `tcps` 队首 | |
| `队列解析`(继电器) `14f905b1` | 每0.5s 发 `link_tcps` 队首 | |
| `6点/12点/20点执行` | crontab 场景（冷光/午休/暖光） | 分5批 setTimeout 下发 |

## 白话走读
- H5 发 `{control,child}` → App → `/jyc/control` → Node-RED 存内存 + 翻译协议 + 入队列 + tcp 下发硬件。
- 状态全在 `global.save` 并落 `save.json`，开机读回。
- 场景（全开/冷光…）是 H5 写特殊点号 + 这里条件分支。

## 与其他模块的接线
- 上游：App `JsInteration.sendMqtt`、微信小程序
- 下游：硬件 TCP（非凡士/空调网关/联克）
- 与 App 关系：灯带/门牌/巨典继电器绕开它（手册 9.5）

## 已知问题
B-10（空调回读待完善）、B-11（联克仅-1楼）、B-12（定时注释未全实现）
