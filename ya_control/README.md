# 亚中楼宇中控系统 (ya_control)

> 楼宇壁挂中控屏 Android 应用 —— 单 Activity + 全屏 WebView 的「本地 H5 控制端 + 多通道设备通信」架构。

## 0. 文档导航（地图）

| 文件名 | 描述 | 加载策略 |
|---|---|---|
| 🧭 `docs/上下文路由.md` | 文档索引与加载策略（地图的地图），含每文件描述与场景路由 | 常查 |
| ⚖️ `docs/开发宪法.md` | 最高约束：读/改/运维铁律（现场bug才修、解耦、文档即代码） | **长驻** |
| `docs/系统解剖手册.md` | 新手读懂系统：阅读顺序、模块解剖、关键契约、踩坑、运维流程 | 按需 |
| `docs/设备点号速查表.md` | 点号→设备→协议→硬件 全景映射，开发/排障地图 | 按需 |
| `docs/工作日志.md` | 工作记录模板 + 已知 bug 标记清单（B-01~B-15） | 按需 |
| `docs/演化日志.md` | 每次改代码的变更史（E-00 基线 + 后续 E-xx） | 改代码时 |
| `docs/代码解说/` | **代码即文档**：逐文件源码注解（20 个）。**默认不加载**，仅任务明确涉及某模块时读对应单文件 | 🗄️ 默认冷存储 |

> **上下文治理**：宪法长驻；其余按 `上下文路由.md` 按需加载；**代码解说默认不加载**（禁止批量读）。首次接手：路由 → 宪法 → 手册第0~2节。每个 md 头部均有 YAML frontmatter（title/description/type）供检索。

## 1. 项目定位

这是一台**楼宇中控屏**（Android 设备，强制横屏、常亮、隐藏导航栏）上运行的 App。
它本身几乎不含业务逻辑 UI，而是：

- 启动一个全屏 `WebView` 加载**本地 H5 工程**（控制界面）；
- 通过 **JS Bridge** 让 H5 调用原生能力（继电器、灯带、MQTT 下发）；
- 通过 **MQTT / Netty(TCP+UDP)** 与门牌设备、服务端后台通信；
- 通过 **局域网 TCP** 接收服务端下发的「工程包 / APK / 配置」。

H5 工程（页面、样式、组件库）**不在 App 源码里**，由服务端经 Netty TCP 下发到
`Context.getExternalFilesDir(null)/html/` 目录，App 直接 `file://` 加载。

---

## 2. 目录结构

```
ya_control/
├── settings.gradle            # rootProject.name = "智能控制系统"
├── build.gradle               # AGP 7.4.0
├── gradle.properties
├── gradlew / gradlew.bat
├── local.properties           # SDK 路径（本机生成）
└── app/
    ├── build.gradle           # namespace=com.jyc.yz_control, versionName=2.2.8
    ├── proguard-rules.pro
    ├── libs/                  # 闭源 SDK：巨典(judian)继电器/音乐/智能家居、pullToRefresh 等
    │   ├── javalib.jar
    │   ├── jdbase-abc2902-2.0.06.aar
    │   ├── JdMusicSdk-1.2.74.aar
    │   ├── jdsmart-common.aar
    │   ├── pullToRefresh.aar
    │   └── universal-image-loader-1.9.5.jar
    └── src/main/
        ├── AndroidManifest.xml
        ├── assets/html/       # 默认占位（实际控制工程由服务端下发覆盖）
        ├── res/
        │   ├── layout/activity_main.xml
        │   ├── xml/           # http_net_config / file_paths / backup_rules ...
        │   ├── values/        # strings / colors / themes
        │   └── ...
        └── java/com/jyc/yz_control/
            ├── JycApplication.java        # Application 入口
            ├── MainActivity.java          # 唯一 Activity（全屏 WebView 容器）
            ├── api/
            │   ├── JsInteration.java      # JS Bridge：android.* 接口
            │   └── HopeJs.java             # 希之望门牌灯带控制（adb 写节点）
            ├── mqtt/
            │   ├── JycMqttClient.java      # MQTT 连接/订阅/消息分发
            │   └── JycService.java         # 前台 MQTT 服务
            ├── netty/
            │   ├── Netty.java              # TCP 服务 / UDP 组播 / 门牌 TCP 客户端 / 心跳
            │   ├── NettyServerHandler.java # 局域网指令（配置/工程/APK）
            │   ├── NettyClientHandler.java # 门牌连接 + 心跳
            │   └── DecoderHandler.java     # 长度前缀解码器
            └── utils/
                ├── Constant.java          # 全局常量（IP/端口/MQTT/路径）
                ├── UiUtil.java            # 沉浸式、IP、设备ID、读 sys 节点
                ├── Ini4jUtil.java          # conf.ini 读写持久化
                ├── AdbUtil.java            # root 命令执行
                ├── Crc16Util.java          # Modbus CRC16（当前未调用）
                ├── APKVersionCodeUtils.java
                ├── SwitchReceiver.java     # 物理按键广播（⚠️ 未在 Manifest 注册）
                └── Self.java               # 开机自启广播
```

---

## 3. 运行流程

```
[开机] BOOT_COMPLETED
   └─ Self → 启动 MainActivity（singleInstance, 横屏）
        ├─ 全屏 + 隐藏导航栏
        ├─ 申请媒体权限（拒绝则 killProcess —— 待优化）
        ├─ WebView 加载 file://<externalFilesDir>/html/index_android.html
        ├─ WebView.addJavascriptInterface(JsInteration, "android")
        ├─ 注册 JdMusicSdk
        └─ CronUtil 定时任务：
             ├─ 每 10s  → MQTT 心跳 /jyc/heartbeat
             ├─ 0/8/12/18 点 → 广播 ACTION_RK_REBOOT 重启设备
             └─ 每 30s  → 检测心跳超时(>5min)则 restartService()

[JycApplication.onCreate]（App 进程创建时）
   ├─ YxDeviceManager 初始化（设备 SDK）
   ├─ Ini4jUtil.initIni4j() 读取 conf.ini
   └─ Netty.tcpServer() / udpClient() / nettyClient() / sendHeartBeat()
```

---

## 4. 通信通道

### 4.1 MQTT（与服务端后台）
| 项 | 值 |
|---|---|
| 地址 | `Constant.MQTT_HOST` = `tcp://172.168.30.101:39201` |
| 订阅 | `/jyc/control`, `/jyc/relay`, `/jyc/feedback`, `/jyc/heartbeatback`, `/jyc/reboot` (QoS 2) |
| 发布 | `/jyc/heartbeat`, `/jyc/getData`, `/jyc/control` |
| 库 | `org.eclipse.paho.android.service` + `paho-client-mqttv3` |
| 运行 | `JycService` 前台服务（dataSync 类型），`START_STICKY` 自动重连 |

消息处理（`JycMqttClient.messageArrived`）：
- `/jyc/control` / `/jyc/feedback` → `MainActivity.wb.evaluateJavascript("setData('...')")` 注入 H5
- `/jyc/relay` → 解析 JSON 数组，对每个 `sn` 命中 `JsInteration.jdqs` 的条目，广播
  `com.judian.broadcast.relay.control`（巨典继电器）
- `/jyc/heartbeatback` → 更新 `MainActivity.heartbeat`（用于超时检测）
- `/jyc/reboot` → 广播 `ACTION_RK_REBOOT`

### 4.2 Netty 局域网（与服务端下发工具）
- **TCP 8888 服务端**（`Netty.tcpServer`）：接收服务端工具下发的数据，按 4 字节长度前缀分包。
  - type 1 `getConfig` → 回传当前配置 JSON
  - type 2 → 接收工程 zip，解压到 `html/`，触发刷新（handler 200 / 13）
  - type 3 → 接收 APK，按设备型号静默安装
  - type 4 → 接收配置 JSON，覆写 `Constant.*` 并持久化
- **UDP 组播 225.0.0.20:55555**（`Netty.udpClient`）：每 5s 上报本机 `{type:0,name,ip,sn,version,date}`
- **门牌 TCP 客户端**（`Netty.nettyClient`，连接 `SERVER_IP:SERVER_PORT=172.16.50.27:13580`）：
  每 2s 发 `ping`，收到 `pong` 忽略；读空闲 10s 且网络可用则关闭重连。

### 4.3 JS Bridge（App ⇄ H5）
H5 调用原生（`window.android.*`，见 `JsInteration`）：

| 方法 | 作用 |
|---|---|
| `sync("sn1,sn2")` | 首次调用启动 MQTT 服务；之后发 `/jyc/getData`；入参为继电器 SN 列表 |
| `relay(id, status)` | 广播 `com.judian.broadcast.relay.control` 控制继电器 |
| `sendMqtt(json)` | 发布到 `/jyc/control` |
| `updateHopeLightBarColor(id)` | 希之望门牌灯带（adb 写 `led_con_h/zigbee_reset` 节点） |

原生调用 H5（`MainActivity.wb.evaluateJavascript`）：
- `setData('...')` —— MQTT 下发的控制/反馈数据
- `control_jdq('1'|'2'|'3')` —— 物理按键（judian 旋钮/按键）回调

### 4.4 持久化配置
`conf.ini`（`[系统配置]` 小节）：`server_ip / server_port / mqtt_host / mqtt_username /
mqtt_password / web / device_name / project_date`。
`Ini4jUtil` 在 App 启动读取、配置变更时保存。

---

## 5. H5 工程（控制界面）`亚中中控控制优化/`

> 工作区副本：`/Users/david/Developer/yzyl-0823/ya_control-html/`
> （原始位置：`00项目文档/00锦悦创/亚中/亚中中控控制优化/`）
> 由服务端经 Netty TCP 打包下发到设备 `html/` 目录，App 直接 `file://` 加载。
>
> **✅ 已验证：原始优化版与 `ya_control-html/` 工作区副本逐文件 MD5 比对 139 个文件零差异，内容完全一致。**
> 即 `ya_control-html/` 就是 `亚中中控控制优化/` 的精确副本，可放心作为开发/部署用前端源。

### 5.0 与 App 内置 `assets/html` 的关系（重要）
- **`app/src/main/assets/html/` 是空目录**（仅占位）。App 源码 `Constant.WEB` 默认指向
  `file:///android_asset/html/index_android.html`，但该文件不存在于优化版中。
- **优化版真实入口是 `总控选择.html`**（楼层→房间导航页），`index.html`/`index-4.html` 实为某楼层控制页（title 写"5楼区域1"），并非总入口。
- **因此部署必须配套 `conf.ini`**：运维用 `中控上传程序.exe` 下发工程 zip（type 2）时，
  **必须同时用 type 4 下发 `conf.ini` 把 `web` 字段改为 `总控选择.html`**，否则 App 解压后
  仍按默认加载 `index_android.html` → 404 白屏。这正对应 README 4.4 的 `conf.ini` 运行时覆盖机制。
- 验证：优化版根目录**不含 `conf.ini`**，入口覆写在部署工具侧手动填写，不随工程包走。

### 5.1 文件清单
- **入口/导航**：`总控选择.html`（按楼层→房间两级跳转，`utils.GetQueryString("jmpurl")` 回跳）。
- **控制页**（49 个，按 `楼层+房间.html`）：如 `5楼总经理.html`、`4楼大会议室.html`、`1楼大厅.html`、`-1楼食堂.html`。
- **脚本**（核心）：
  - `js/utils.js`：全局 `utils`（ajax/isnull/GetQueryString/Datetime）+ `led.control`(灯带) + `face`(人脸)。**`ajax` 的 `host = http://meeting-test.scasia-core.com:8099`**——会议/服务呼叫走 HTTP，与 MQTT 分离。
  - `js/element.js`：组件库 `addEmn`(灯光) / `addHvac`(空调) / `addLink` / `addBottom`(场景/灯光/空调/新风切换) / `addHvacPop` / `addMeeting` / `addCall` / `addService` / `addBindMeeting`。
  - `js/index_10.js`：**10 寸屏**主逻辑（自锁/互锁/+−/拖动条/视频矩阵/会议室绑定）。
  - `js/index_4.js`：**4 寸屏**主逻辑（结构同 10 寸，差异在翻页每页 2 个、缩放 `align()`、无视频矩阵）。
  - `js/tooltip.js`（`tip` 气泡）、`js/alert.js`、`js/RangeSlider.js`（拖动条）、`js/date.min.js`、`js/jquery.min.js`。
- **样式**：`css/index_1280x800.css`(10寸) / `index_4.css`(4寸) / `slider_10.css` / `slider_4.css` / `alert.css`。
- **资源**：`img/`（图标、背景）、`css` 依赖的图片。

### 5.2 设备点号协议（关键）
所有控件用属性 `control="<点号>"` 和 `child="<点号1,点号2-点号3,...>"` 描述物理设备：
- **灯光**：`control`=开关点（如 `141299`），`child` 常含色温点 `35xxxx` + 亮度点 `25xxxx`；
  详细页用 `element.addEmn` 渲染：`cw_control`(色温) / `cw_child` / `ld_control`(亮度) / `ld_child`。
- **空调**：`control`=开关点（如 `4546023`），温度点 = `control` 第4位+3（如 `4549023`），
  风速点 = `control` 第4位+2；弹出 `addHvacPop` 用 `inter-lock="hvacmode"`/`hvacspeed` 组做模式/风速单选。
- **楼层总控**（仅 10 寸）：`index_10.js` 里 `floor-init`/`floor-cw1`/`floor-cw2`/`floor-mode1`/`floor-mode2`
  用 `101000+f*10000`、`250000+f*1000+i`、`350000+f*1000+i` 等批量点号，配合特殊标记 `999999999`(全开)/`888888888`(冷光)/`666666666`(暖光)/`777777777`(休息)/`555555555`(正常)。
- **视频矩阵**：`#video-in`/`#video-out` 选路 → 点号 `10001` 发送 ASCII 数组（见 `index_10.js:963`）。
- **child 展开**：`getChilds()` 支持 `a-b`(连续)、`a:b`(步长2)、单点三种写法（`index_10.js:1109`）。

### 5.3 上行/下行数据流
- **下发**：用户操作 → `index_*.js` 拼 `{control: "true"/数值, child:{子点:值}}` → `window.android.sendMqtt(json)` → App `JsInteration.sendMqtt` → MQTT `/jyc/control`。
- **上行**：MQTT `/jyc/control` `/jyc/feedback` → App 注入 `setData(json)` → `index_*.js` 的 `setData()` 按 `control` 匹配 DOM，自动切换 `self-lock-active`/`inter-lock-active` 并回填数值（亮度/温度/风速换算）。
- **互锁** `inter-lock`：同组互斥（模式按钮）；**自锁** `self-lock`：独立开关；`isAll`：全区域灯光联动。
- **会议/服务呼叫**：走 HTTP（`utils.ajax` → `/prod-api/dev/meeting/{sendMsg,addMeetingTime,finishMeeting,meetingRooms}`），
  需先在页面长按弹出框（`[pop]` 长按 3s）绑定会议室（`localStorage.bindMeeting`）。

### 5.4 控件与设备的覆盖现状
| 模块 | 状态 | 说明 |
|---|---|---|
| 灯光（开关/亮度/色温） | ✅ 完整 | `addEmn` + 拖动条，10/4 寸均支持 |
| 空调（开关/模式/风速/温度） | ✅ 完整 | `addHvac` + `addHvacPop` |
| 场景模式（会议/离开/夜间） | ⚠️ 部分 | 10 寸 `5楼总经理.html` 用 `inter-lock` 模式按钮；多数页模式按钮被注释 |
| 窗帘 | ⚠️ 占位 | `4楼大会议室.html` 等仅展示图标+Switch 图，**无 `control`/`self-lock`，不下发** |
| 新风 | ⚠️ 占位/注释 | `addBottom` 有"新风"入口但多数页 `--wind` 块为空；`5楼总经理.html` 新风块被注释 |
| 视频矩阵 | ✅(10寸) | `index_10.js` 的 `#video-in/out`，4 寸无 |
| 门牌灯带 | ⚠️ 契约不一致 | 见下 6.9 |
| 物理按键 | ❌ 未接 | App `SwitchReceiver` 未注册，H5 `control_jdq` 无入口 |

---

## 6. 已知问题与待优化（开发清单）

### App 端
| # | 问题 | 位置 | 建议 |
|---|---|---|---|
| 1 | `android:exported="true"` 写在 `<application>` 上无效；`MainActivity`/`JycService`/`MqttService` 被声明 `exported=true` | `AndroidManifest.xml` | 移除非必要的 exported，仅 `MainActivity` 设为 `exported=true`（含 LAUNCHER） |
| 2 | `SwitchReceiver` 类已实现完整逻辑，但**未在 `AndroidManifest.xml` 注册**（Manifest 仅有 `Self` 开机广播） | `SwitchReceiver.java` | 若物理按键需要生效：补 `<receiver>` 注册 + 监听 judian 按键广播；若不再需要：删除该类。注意其代码非空白——按键1/2→`control_jdq('1'/'2')`，按键3→`NettyClientHandler.send("opendoor")`（走门牌 TCP 通道，非 H5 的 `opendoor()`） |
| 3 | 媒体权限被拒直接 `killProcess` | `MainActivity:156` | 改为引导设置或降级运行，而非杀进程 |
| 4 | `Crc16Util` 无任何调用（疑似门牌 Modbus 预留未接） | `Crc16Util.java` | 接入门牌协议或删除 |
| 5 | 遗留调试代码：`//20212432`、`setting` 长按注释掉的设置入口 | `MainActivity:62,103` | 清理或实现设置页 |
| 6 | `conf.ini` 明文存 MQTT 密码；`http_net_config` 全局明文 | `Ini4jUtil` / `res/xml` | 评估加密/最小明文范围 |
| 7 | `web` 配置项加载 `android_asset` 但实际用外置 `html/`，两处 `Constant.WEB` 不一致 | `Constant.java:22,38` | 统一加载路径来源 |

### H5 ⇄ App 契约不一致（潜在 bug）
| # | 不一致 | 位置 | 影响 |
|---|---|---|---|
| 8 | H5 调 `window.android.updateZhyLightBarColor`（utils.js:117）但 App 暴露的是 `updateHopeLightBarColor` | `utils.js` vs `JsInteration.java` | 灯带控制必然 `catch` 静默失败，无实际效果 |
| 9 | H5 调 `window.android.opendoor()`（index_10.js:141）但 App `JsInteration` 无此方法 | `index_10.js` vs `JsInteration.java` | 开门按钮点击无效（抛异常被吞） |
| 10 | H5 调 `window.android.showFace()` / `pushCurrentMeetingOpenId()`（utils.js:127,134）但 App 未实现 | `utils.js` vs `JsInteration.java` | 人脸相关功能不可用 |
| 11 | App `SwitchReceiver`（未注册）回调 `control_jdq('1'|'2')`，但 H5 仅 `总控选择.html` 等部分页含 `control_jdq` 绑定；按键3 走门牌 TCP `opendoor` 而非 H5 | `SwitchReceiver.java` vs H5 | 物理按键 1/2 需前端页面实现 `control_jdq` 钩子才能响应 |
| 12 | 会议后端 `host` 为测试地址 `meeting-test.scasia-core.com:8099` 硬编码 | `utils.js:1` | 上线需切换生产域名；建议走配置或相对路径 |

---

## 7. 构建 / 调试

- 用 Android Studio 打开 `ya_control/`（AGP 7.4.0，compileSdk 33，minSdk 26）。
- 依赖含闭源 `libs/*.aar|jar`，需随仓库保留；`maven.aliyun` 镜像已配置。
- 真机需 root（灯带/重启走 `su`）；继电器依赖巨典(`judian`)系统广播。
- 默认 `versionCode` 用 `yyyyMMdd` 动态生成（`build.gradle` 的 `time()`）。

---

## 8. 关键文件速查

| 想改什么 | 改哪个文件 |
|---|---|
| MQTT 地址/账号 | `utils/Constant.java` 或 `conf.ini`（运行时覆盖） |
| 门牌 IP/端口 | `utils/Constant.java` |
| H5 与原生接口 | `api/JsInteration.java` |
| 接收服务端下发逻辑 | `netty/NettyServerHandler.java` |
| 心跳/重启策略 | `MainActivity.java` 的 `CronUtil.schedule` |
| 控制界面组件 | H5 工程 `js/element.js` + 各 `*.html` |
| 中控逻辑（设备协议转换） | `亚中.json`（Node-RED 流，部署在中控屏本机）

---

## 9. 中控逻辑流（Node-RED `亚中.json`）—— 设备协议转换中枢

> 工作区副本：`/Users/david/Developer/yzyl-0823/ya_control-html/` 之外，原始位于
> `00项目文档/00锦悦创/亚中/亚中.json`（136KB，Node-RED 导出流）。
> **中控屏本机运行一个 Node-RED 实例**，内含 `aedes broker`（MQTT 服务器，监听 39201），
> App 端 `Constant.MQTT_HOST=tcp://172.168.30.101:39201` 连的就是它。

### 9.1 两个 MQTT broker
| id | name | broker | port | 用途 |
|---|---|---|---|---|
| `dc88d6aece5eced4` | （本地） | `127.0.0.1` | 39201 | 处理 `/jyc/*` 全套（与 App/H5 对接） |
| `7e185ff0990b462c` | 云服务器 | `ibms.jinyuechuang.com` | 1883 | 处理 `/yzyl/control`（微信小程序远程控制） |

### 9.2 完整数据流（终于闭环）
```
[H5] 点击 → window.android.sendMqtt({control,child})
  → [App JsInteration.sendMqtt] → MQTT /jyc/control
    → [Node-RED mqtt in /jyc/control]  ── 4 路并行 ──
       ① 数据添加到内存(8ec6ed7f)：展开 child → global.save → 写 /home/cotodo/save.json
       ② 解析网络协议(非凡士/空调)(df48873f)：转设备私有协议 → 入 tcps/link_tcps 队列
       ③ 715b2eef(debug)  ④ 解析网络协议(联克)(d40733b24a7d1be3)：联克继电器 → 入 link_tcps 队列
       ── ②/④ 的结果分别经 tcp request(86c9cfe8) 下发到硬件 ──

[App 启动拉状态] MQTT /jyc/getData
  → 将内存中的数据发送(e72ac5fd) → 回 /jyc/control（注意：回的是 control，非 feedback）
  → App 端 setData() 收到后刷新 UI（App 同时订阅 /jyc/control 与 /jyc/feedback，兼容）

[微信小程序] /yzyl/control(云) → 接收小程序控制(2ae2e8a4, type==2 取 data)
  → 转发 /jyc/control + 入内存（与 H5 同一条路）

[App 心跳] /jyc/heartbeat → 直接 mqtt out /jyc/heartbeatback（App 据此判在线）
[远程重启] /jyc/reboot → 重启指令(bd2f1748)（后续动作在别处/未在本流实现）
[清空状态] /jyc/close → 将内存中的数据清除(b9e24923) → 写空 save.json
```

### 9.3 设备协议转换（核心 function `解析网络协议` = `df48873f`）
按**设备点号前缀**分流：
| 点号段 | 设备 | 转换结果 | 下发目标 |
|---|---|---|---|
| `100001–199999` | 非凡士灯光 | 按楼层 team 拼 `{floor,type:"setTeam",teamids,dim0/1,cw}` JSON；特殊点号 `999999999`全开/`888888888`冷光/`666666666`暖光/`777777777`休息/`555555555`正常 | TCP `172.17.63.202:23432`（非凡士网关） |
| `4000001–4999999` | 空调面板(老协议) | 开关/模式/风速/温度 → Modbus hex 帧 + `crc16Modbus` | 入 `tcps` 队列（按 `IP:port`） |
| `5000001–5999999` | 空调面板 | 同上，模式/风速编码不同 | 入 `tcps` 队列 |
| `6000001–6999999` | 董事长新风 | 开关/风速 → hex 帧 | 入 `tcps` 队列 |
| `700000001–799999999` | 多联机空调(网关) | `网关ID+类型+值+空调ID` + `makeCheckSum` 校验和 | 入 `tcps` 队列 |
| `8000001–8999999` | **联克继电器** | 编码 `8`+楼层(2)+设备ID(2)+通道(2)；帧 `AAAA0B`+区域id+设备id(hex)+`050142`+通道(hex)+(`64`开/`00`关)+`makeCheckSum` | 入 `link_tcps` 队列（每 0.5s 由 `继电器队列发送`(4553d8ad) 触发下发） |

**空调下发队列**：
- `空调编号`(699c9af8)：固化 1~5 楼 + -1 楼 的 `{IP:port → 面板ID[]}` 映射（如 `172.17.63.109:1030`=[2..27]）
- `队列解析`(8d348f4f，每 1s)：从 `tcps[IP:port]` 取队首 hex → `tcp request` 下发
- `定时查询空调`(d065f182，每 600s)：生成 Modbus 读命令 `num+"0300000004"+crc` 入 `querys` 队列
- `队列解析`(a18e1e92，每 0.7s)：`tcps` 空时发 `querys` 查询帧 → `查询反馈，调整状态`(bd7e1351，待完善)

**联克继电器下发队列**：
- `继电器编号`(8028443f)：当前**仅固化 -1 楼**（`172.17.63.168:1030` 设备[10,11]），其余楼层未配置（扩展需在此补 `links[f]`）
- `队列解析`(14f905b1，每 0.5s)：从 `link_tcps[IP:port]` 取队首 hex → `tcp request` 下发
- 注意：联克继电器与 App `JsInteration.relay` 广播的**巨典**继电器是**两套独立系统**（见 9.5）

### 9.4 持久化与开机恢复
- `save.json` 路径 `/home/cotodo/save.json`（中控屏本机 Linux，`cotodo` 为系统用户）
- 开机 inject `开机读取数据`(72f9de38) → `file in` 读 save.json → `将数据保存到内存`(8bfc8d0a)：
  点号 ≤370 的强制置 `"false"`（继电器类默认关），重建 `tcps/querys/link_tcps` 全局表

### 9.5 与 App 端的关系澄清（重要）
- **灯带/门牌**：`亚中.json` **不含**灯带、门牌、继电器(judian) 节点。它们由 **App 端 `HopeJs`/`JsInteration.relay`** 直接走 adb/巨典广播，绕开 Node-RED。
- **场景模式**（全开/冷光/暖光/休息/正常）：H5 在点击时写入特殊点号（`888888888` 等）→ Node-RED `解析网络协议` 内条件判断 → 非凡士灯光指令。场景逻辑在前端+Node-RED，不在 App。
- **继电器（两套独立）**：
  1. **联克继电器**（`8000001–8999999`）：由 Node-RED `解析网络协议(联克)` 转换，走 `link_tcps` 队列经 TCP 下发（见 9.3）。中控屏本机 Node-RED 直接控。
  2. **巨典继电器**：由 App 端 `JsInteration.relay()` 广播 `com.judian.broadcast.relay.control` 给巨典系统处理（绕开 Node-RED，App 端 HopeJs 同路走 adb）。
  → 注意区别：点号 `8000001+` 走 Node-RED，其他继电器类（点号≤370）的开关由 App 巨典广播处理。
- **CRC 校验**：Node-RED 用 `crc16Modbus`（空调）/`makeCheckSum`（多联机）；App 端 `Crc16Util` 是死代码（见 6#4），门牌 Modbus 未接入。

### 9.6 部署工具 `Debug/中控上传程序.exe`（PC 端 ↔ 中控屏）

> 位置：`00项目文档/00锦悦创/亚中/Debug/`（**Windows 二进制，不进 Android 工程**）。
> 这是你说的 **"下发/部署软件"**：运行在运维 PC 上，把工程/H5/配置/APK 推到中控屏。

- **技术栈**：.NET Framework 4.8 WinForms GUI；网络通信走 **DotNetty**（.NET 版 Netty，与 App 端 Java Netty 同源，故协议互通）。同时含 `startNettyServer` 与 `startNettyClient`，并支持 `UdpClient`/`getUDPrece`（UDP 发现/广播）。
- **协议特征**（与 `netty/NettyServerHandler.java` 对应）：定长报头 + 长度域解码（`FixLength`/`futureLen`/`length`/`type`），即 DotNetty `LengthFieldBasedFrameDecoder` ↔ App 端 `LengthFieldBasedFrameDecoder(1024,0,4,...)` 同一套帧格式。
- **UI 与功能**（从资源/字符串还原）：

  | 功能 | UI 文本 | 对应 App 端行为 |
  |---|---|---|
  | 连接中控屏 | `server_ip` / `server_port` / `连接设备` / `请先连接设备` | `NettyClient`/`NettyServerHandler` 建链 |
  | 下发工程(H5) | `请选择工程文件夹` → `文件夹已成功压缩为 ZIP 文件` → 发 `/update.zip` → `下发工程` | 收 ZIP → 解压覆盖 `html/` 目录 |
  | 下发配置 | `下发配置成功/失败`；字段：`mqtt地址`/`门牌IP`/`门牌端口`/`门禁地址`/`首页地址`/`客户端名称` | 写 `conf.ini`（运行时覆盖 MQTT/门牌等，见 `Ini4jUtil`） |
  | 下发 APK | `请选择更新安装包` / `apk文件 (*.apk)` | 收 APK → `installApk()` 静默升级 |
  | 设备发现 | `请选择读取的设备` / `udp` / `UdpGroup` | UDP 广播发现局域网中控屏 |

- **结论**：App 端 `netty` 包（TCP 8888 收工程包/APK/配置、UDP 门牌通信）的**对端**就是此工具；`NettyServerHandler` 里的 `type 1/2/3/4`（工程包 / APK / 配置 / 命令）即由该 exe 触发。开发新功能时，若改了 `NettyServerHandler` 的报文格式，需**同步更新此 exe** 才能联调。

> 注：`Debug.zip` 为同名打包；`Debug/` 目录本体是已解压可运行版。该工具无法在 macOS/Android 环境运行或编译，仅作协议参考。
