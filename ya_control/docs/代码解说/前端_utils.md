---
title: 前端 utils.js（全局接口）
description: host 硬编码 HTTP、led.control 拼写错、face 未实现
type: 分片
---

## 文件路径（前端）
`ya_control-html/js/utils.js`（= 原始 `亚中中控控制优化/js/utils.js`）

## 一句话职责
H5 全局工具——定义后端 host、灯带/人脸等接口封装，是各页共享的"出口层"。

## 关键成员
| 名称 | 干嘛 | 坑 |
|---|---|---|
| `host` | `http://meeting-test.scasia-core.com:8099` | ⚠️ 测试地址硬编码 HTTP（B-08） |
| `led.control(id,color)` | 调 `window.android.updateZhyLightBarColor` | ⚠️ 拼写错，App 端是 `updateHope`（B-01） |
| `face.showFace(...)` | 人脸展示 | App 未实现（B-未编号，文档提示） |
| `pushCurrentMeetingOpenId(...)` | 推送会议 | App 未实现 |

## 白话走读
- 所有页 `document.write('<script src="js/utils.js?t=...">')` 动态引入（防缓存）。
- `led.control` 是灯带入口，拼写错导致调用失败——修一端即可（宪法 4.4 注意 JS Bridge 方法名是硬边界，改须两端配套）。

## 与其他模块的接线
- 调 `window.android.*`（JsInteration）
- 被各 html 页引入

## 已知问题
B-01（拼写）、B-08（host 硬编码）
