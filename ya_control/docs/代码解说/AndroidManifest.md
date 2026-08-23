---
title: AndroidManifest（声明）
description: 权限/组件/保活/明文网络/外部存储声明；SwitchReceiver 未注册
type: 分片
---

## 文件路径
`app/src/main/AndroidManifest.xml`

## 一句话职责
App 的"身份证+权限表"——声明组件、权限、保活、明文网络、外部存储。

## 关键声明
| 项 | 内容 | 注意 |
|---|---|---|
| `permission REBOOT` | `android.permission.REBOOT`（signature|system） | `tools:ignore=ProtectedPermissions`（B-系统权限） |
| `Self` receiver | `BOOT_COMPLETED`，exported=true，priority 1000 | 开机自启 ✅ |
| `SwitchReceiver` | **未声明** | B-02 |
| `MainActivity` | exported=true, LAUNCHER | 入口 |
| `JycService`/`MqttService` | exported=true, foregroundServiceType=dataSync | MQTT 保活 |
| `queries` | `com.jyc.keepalive` | 保活 App 包名 |
| `networkSecurityConfig` | `@xml/http_net_config` | 明文 HTTP（B-06） |
| `application` | `exported=true`（无效写法） | B-05 |
| `requestLegacyExternalStorage` | true | 兼容外部存储 |
| `largeHeap` | true | 防 OOM |

## 白话走读
- 权限集中在 `REBOOT`、网络、存储。
- 明文 HTTP 由 `http_net_config.xml` 允许（会议后端 HTTP）。
- `keepalive` 仅在 queries 引用，是独立守护 App。

## 与其他模块的接线
- 注册 `Self`/`MainActivity`/`JycService`/`MqttService`
- 引用 `res/xml/http_net_config.xml`、`file_paths.xml`

## 已知问题
B-05（application exported 无效）、B-06（明文 HTTP）
