---
title: AdbUtil（root 命令）
description: Runtime.exec('su') 执行 root 命令，灯带/重启用
type: 分片
---

## 文件路径
`app/src/main/java/com/jyc/yz_control/utils/AdbUtil.java`

## 一句话职责
执行 root 命令——灯带/重启等需要系统权限的操作经此 `Runtime.exec("su")`。

## 关键方法
| 方法 | 干嘛 |
|---|---|
| `exec(cmd)` | 执行 shell 命令（带 su） |
| `execWithResult(cmd)` | 执行并返回输出 |

## 白话走读
- `HopeJs` 写灯带节点、`MainActivity` 重启都走这。
- 设备必须 root，否则命令失败（运维时确认 root 权限）。

## 与其他模块的接线
- 被 `HopeJs`、`MainActivity`(重启) 调

## 已知问题
无标记。注意无 root 时功能静默失败。
