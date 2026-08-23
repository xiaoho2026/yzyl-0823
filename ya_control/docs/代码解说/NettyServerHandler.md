---
title: NettyServerHandler（部署下发）
description: 处理 PC 工具 type1/2/3/4：取配置/工程zip/APK/配置覆盖
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/netty/NettyServerHandler.java`

## 一句话职责
TCP 业务处理器——处理 PC 部署工具下发的 4 类消息：取配置 / 工程包 / APK / 配置覆盖。

## 消息 type 分流
| type | 含义 | 动作 |
|---|---|---|
| 1 | 取配置 | 回传 `conf.ini` 当前内容 |
| 2 | 工程 zip | 解压到 `html/` 目录（前端部署） |
| 3 | APK | 按 `Constant.MODEL` 设备型号静默安装 |
| 4 | 配置 JSON | 覆写 `Constant` 字段（含 `web` 指向真实入口） |

## 白话走读
- 收到 type2：把 zip 解压覆盖 `html/`，然后 `MainActivity.handler.sendEmptyMessage(200)` 重新加载 WebView。
- 收到 type4：写 `conf.ini`，下次启动 `JycApplication.readIni` 覆盖 `WEB` 等——**这是解决白屏(B-03)的机制**。
- 静默安装用 `Intent.ACTION_VIEW` + FileProvider（`file_paths.xml` 的 external-path `/`）。

## 与其他模块的接线
- 上游 `DecoderHandler` 解帧后到这里
- 调 `MainActivity`（重载）、`Ini4jUtil`（写配置）、`APKVersionCodeUtils`（版本）

## 已知问题
B-03（部署须配套 type4 改 web）、B-15（帧格式与 exe 耦合）
