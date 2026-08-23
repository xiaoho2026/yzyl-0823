---
title: 前端 element.js（组件库）
description: 灯光/空调/服务/会议控件封装 addEmn/addHvac/addBottom 等
type: 分片
---

## 文件路径（前端）
`ya_control-html/js/element.js`

## 一句话职责
H5 组件库——把"灯光/空调/服务/会议"等控件封装成可复用函数，各控制页调用它生成 DOM。

## 关键函数
| 函数 | 干嘛 |
|---|---|
| `addEmn(灯光)` | 生成灯光控件：type1开关 / type2色温亮度滑条 / type3带开关滑条 |
| `addHvac(空调)` | type1开关 / type2模式风速 |
| `addBottom` | 底部场景/灯光/空调/新风切换栏 |
| `addHvacPop` | 空调模式风速弹窗（互锁） |
| `addMeeting` / `addCall` / `addService` | 会议/呼叫/服务控件 |
| `addBindMeeting` | 长按3s 绑定会议室 |
| `addLink` | 跳转链接 |

## 白话走读
- 每个控件最终挂 `control`/`child` 属性（点号），点击时由 `index_10.js` 收集并发 `android.sendMqtt`。
- 互锁（inter-lock）在 `addHvacPop` 内处理：选模式时清掉其他模式。
- 这是"页面怎么拼出来"的核心，新增控件先看这里。

## 与其他模块的接线
- 被各 html 页调用
- 与 `index_10.js` 的 `setData` 回填配合（按 control 匹配 DOM）

## 已知问题
无标记。控件与 App 点号契约见速查表。
