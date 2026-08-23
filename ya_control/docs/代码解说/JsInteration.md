---
title: JsInteration（JS Bridge）
description: H5↔App 翻译官：relay/sync/sendMqtt/updateHopeLightBarColor 四接口；灯带拼写坑
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/api/JsInteration.java`

## 一句话职责
H5 与 App 之间的"翻译官"——H5 网页通过 `window.android.xxx()` 调的 4 个方法都在这。是 JS Bridge 的唯一落地类。

## 关键成员（@JavascriptInterface 暴露给 H5）
| 方法 | H5 调用 | 干嘛 | 接收 | 发出 | 坑 |
|---|---|---|---|---|---|
| `relay(obj)` | `android.relay` | 巨典继电器开关 | JSON{...} | 广播 `com.judian.broadcast.relay.control` | 走巨典，非 Node-RED |
| `sync(str)` | `android.sync` | 启动 MQTT 服务 | 字符串(常空) | 启 `JycService` | H5 `init()` 必调 |
| `updateHopeLightBarColor(obj)` | `android.updateHopeLightBarColor` | 灯带颜色 | JSON{id,color} | `HopeJs` | ⚠️ H5 端叫 `updateZhyLightBarColor`（拼写错，B-01） |
| `sendMqtt(obj)` | `android.sendMqtt` | 把控制指令发到 MQTT | JSON{control,child} | `/jyc/control` | 系统主通道 |

## 白话走读
- 类用 `@JavascriptInterface` 标注，在 `MainActivity` 里通过 `addJavascriptInterface(this,"android")` 挂到 WebView。
- H5 点按钮 → 调 `android.sendMqtt({control,child})` → 这里 publish 到 `/jyc/control` → Node-RED 翻译 → 硬件。
- `sync("")` 是 H5 加载后第一句，启动 MQTT 连接，否则收不到回显。

## 与其他模块的接线
- 被 `MainActivity` 注入 WebView
- 调 `mqtt/JycMqttClient`（sendMqtt）、`api/HopeJs`（灯带）、广播（relay）
- H5 侧对应 `js/utils.js` 的 `led.control` 等

## 已知问题
B-01（`updateZhy` vs `updateHope` 拼写不一致，灯带调用失败）
