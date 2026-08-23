---
title: 前端 index_10.js（10寸主逻辑）
description: init/sync/setData 回显/楼层总控/视频矩阵/getChilds；opendoor 未实现
type: 分片
---

## 文件路径（前端）
`ya_control-html/js/index_10.js`（10寸屏主逻辑）

## 一句话职责
10寸屏控制页的"大脑"——页面初始化、组件加载、状态回显（setData）、楼层总控、视频矩阵、设备点号收集。

## 关键逻辑
| 函数 | 干嘛 |
|---|---|
| `init()` | 动态加载组件 → `window.android.sync("")` 启 MQTT |
| `setData(json)` | 回显入口：合并 child→json_data，按 control 匹配 DOM 回填 |
| `floor-init/cw1/cw2/mode1/mode2` | 楼层总控：全开/冷光/暖光/休息/正常（点号见速查表） |
| `video-in/out` | 视频矩阵：点号 `10001`，ASCII 数组改首字节 |
| `getChilds(a,b)` | 点号展开：`a-b` 连段 / `a:b` 步长2 / 单点 |
| `opendoor` 点击 | `window.android.opendoor()`（**App 无此方法，B-04**） |

## 白话走读
- 页面加载 → `init` 拼控件 → `sync` 启 MQTT → 收 `/jyc/control` → `setData` 把状态写回对应控件。
- 楼层总控按钮直接发特殊点号（888888888 等），Node-RED 翻译。
- 翻页每页 4 个（`Math.ceil(len/4)`），4寸屏是 2 个（见 index_4.js）。

## 与其他模块的接线
- 调 `window.android.sync/sendMqtt/opendoor`
- 依赖 `element.js` 组件、`utils.js` 接口
- 接收 MQTT 回显（App `setData` 注入）

## 已知问题
B-04（opendoor 未实现）、B-08（host 在 utils）
