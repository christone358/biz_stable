# 云主机管理 | 产品设计说明文档（PRD）

面向读者：产品经理、研发工程师（前端/后端/测试）

文档目的：明确云主机管理模块的业务目标、页面信息结构、关键展示与操作逻辑、业务规则、数据模型映射、输入输出约束，指导研发实现与自测。

---

## 1. 业务说明（Scope）
- 目标：为企业提供云主机台账的统一视图，支持资产概览、快捷检索、风险/防护态势洞察，以及详情页的静态与安全信息查阅。
- 不在本期范围：跨平台自动发现/同步配置、复杂工作流、API 细节规范（本 PRD 不包含接口定义）。

名词约定
- 业务板块/业务系统：与业务资产域一致（对应 Excel 的一级/二级系统）。
- 风险：由“未处理告警数、漏洞（高危）”聚合出的等级（正常/中/高）。
- 防护：EDR 安装与在线状态（未防护/离线/防护中）。
- 来源：云平台提供方（华为云、云轴、私有云）。

---

## 2. 页面信息结构设计

### 2.1 列表页（List）
- 顶部统计 Token（自适应宽度，不铺满一行）：
  - 云主机统计：总量N（大号） + 右侧并列细分（运行中/停止/未知）。
  - 主机风险：风险总数R（=高+中） + 右侧并列（高/中/正常）。
  - 防护覆盖率：左侧显示 P%（覆盖率），右侧“未安装 M”。
  - 右上角操作：新建云主机 / 导入台账 / 导出台账（仅此一处，不重复）。
- 列表标题行右上角工具：
  - CheckableTag 筛选组（互斥单选，可清空）：
    - 主机风险：正常 / 中 / 高
    - 主机运行状态：运行中 / 已停止 / 未知
    - 防护状态：防护中 / 离线 / 未防护
  - 一键式搜索框：支持“名称 / IP / 责任人 / 资产 / 标签”。
- 卡片栅格：6 列、min-height 160、gap 16；卡片信息结构：
  - 主信息：主机名称（省略号）
  - IP + 运行色点（绿=运行、灰=停止、橙=未知）
  - 结论栈：左侧“主机风险”三格进度（1红=高/2黄=中/3绿=正常），右侧“防护状态”图标（防护中/离线/未防护，hover 说明）。
  - 基本情况行：来源（华为云/云轴/私有云） · 规格（CPU/内存/磁盘）
  - 标签行（贴底）：必须包含二级系统名称；可附 label/type；超长省略。

### 2.2 详情页（Detail）
目标：一屏读完“这台主机是谁、当前是否安全、最近是否在线、是否需要动作”。不采用复杂 Tab，信息量大时使用折叠组。

信息结构（上→下，左→右）
- 顶部结论条（横向）：
  - 基本身份：hostName · ipAddress（超长省略，title 提示）
  - 运行：色点 = status（RUNNING=绿 / STOPPED=灰 / UNKNOWN=橙），旁显示最近在线/最后心跳（edrLastHeartbeat，若无则不显示）
  - 主机风险：三格进度（HIGH=1红 / MEDIUM=2黄 / OK=3绿），hover 显示“未处理告警/高危漏洞”解释
  - 防护状态：图标（未防护/离线/防护中），hover 显示解释
- 左侧：静态信息（分组卡片）
  1) 基础信息：hostName、ipAddress/ipAddresses、description、vendor（或 dataSource.provider）
  2) 硬件与 OS：cpu/cpuModel、memory/memoryType、disk/storage、osType/osVersion、gpu（可选）
  3) 组织与业务：department、systemOwner、businessBlock、businessSystem、businessAssetName
  4) 网络与位置：macAddresses、networkSegment、datacenter、nodeRoom、platformDetail
- 右侧：安全状态（分组卡片）
  1) 防护与心跳：edrInstalled + edrOnline + edrBrand/edrAgentVersion/edrVirusDbVersion、edrLastHeartbeat（按可用性展示）
  2) 风险概览：未处理告警数（pendingAlerts）、高危漏洞数（vulnerabilities），并映射风险等级
  3) 最近事件：按时间倒序展示最近 7~30 天安全/运维关键事件（若无则空态）

字段展示规则
- 缺失字段不占位：不展示标签/冒号/占位符；整组字段全缺时隐藏该组卡片
- 值格式：
  - 数量统一阿拉伯数字；容量单位：C/GB，存储列表按 `type sizeGB model` 拼接
  - IP/MAC/ID 列表最多展示 3 条，超出折叠“展开查看”
  - 时间使用本地时区 ISO 格式 + 相对时间（如“3 分钟前”），同时提供 title 为绝对时间
- 来源优先级：dataSource.provider > vendor；私有云不展示区域后缀
- 标签与描述：过长省略，title 展示全文

动态信息与刷新
- 风险等级计算：
  - HIGH：vulnerabilities > 0 或 pendingAlerts ≥ 3
  - MEDIUM：pendingAlerts ∈ [1,2] 且 vulnerabilities = 0
  - OK：其余
- 防护状态：
  - 未防护：edrInstalled = false
  - 离线：edrInstalled = true 且 edrOnline = false
  - 防护中：edrInstalled = true 且 edrOnline = true
- 在线/心跳：
  - status 直接映射运行色点；若 edrLastHeartbeat 存在，显示“心跳：相对时间”
  - 心跳超过阈值（可配置，默认 30 分钟）则在 hover 中提示“心跳超时”，但不改变色点逻辑
- 数据新鲜度：
  - 详情首次打开加载最新数据；离开页面后不保留轮询
  - 若后端提供 lastSyncTime，显示“同步：相对时间”，超过阈值（默认 24h）以弱警示色显示

告警/脆弱性展示逻辑
- 概览指标：
  - 告警：pendingAlerts（未处理）
  - 高危漏洞：vulnerabilities（≥1 视为高）
- 列表（可选实现，若数据量适中）：
  - 告警：按严重度（高→低）+ 时间（新→旧）排序，展示前 5 条，字段建议：时间、标题/规则、来源、状态；提供“查看全部告警”跳转链接
  - 漏洞：按严重度（高→低）+ CVE 分组，展示前 5 条，字段建议：CVE/标题、影响组件/版本、发现时间；提供“查看全部漏洞”跳转链接
- 去重与折叠：同一规则在短时间的重复触发合并为一条并计数；同一 CVE 多实例合并显示计数
- 空态：展示“无未处理告警/无高危漏洞”，不展示风险列表块

可访问性与性能
- 所有图标具备 aria-label，键盘可聚焦；卡片组支持键盘导航
- 限制首屏渲染字段与列表条数，保证可用性；更多内容通过“查看全部”跳转，不在本页面滚动加载

---

## 3. 关键展示与操作逻辑

展示逻辑
- 运行状态：映射为色点显示在 IP 右侧。
- 主机风险：以三格进度呈现（高=1红，中=2黄，正常=3绿），hover 展示“告警/高危漏洞”解释；无数据则不展示。
- 防护状态：以图标呈现（防护中=EDR 在线、离线=EDR 离线、未防护=未安装），hover 解释；字段缺失则不展示。
- 管控状态：本期取消与卡片外观的关联，不使用底色标识。

操作逻辑
- 列表统计右上角：新建云主机 / 导入 / 导出。
- 列表标题右上角：三组筛选 + 搜索；筛选为互斥单选（可清空），与搜索叠加。
- 卡片点击进入详情；键盘 Enter/Space 可触发，满足可访问性。

---

## 4. 业务逻辑说明

风险分级
- 高：高危漏洞数 > 0 或 未处理告警数 ≥ 3。
- 中：未处理告警数 ∈ [1,2] 且高危漏洞数 = 0。
- 正常：其余情况。

防护判定
- 未防护：edrInstalled = false。
- 离线：edrInstalled = true 且 edrOnline = false。
- 防护中：edrInstalled = true 且 edrOnline = true。

来源显示
- 优先 dataSource.provider；缺失时回退 vendor；取值限定为：华为云、云轴、私有云（私有云不带区域号）。

隐藏规则
- 缺失的实时状态（运行/风险/防护）不展示对应图元；卡片高度保持一致。

---

## 5. 数据模型映射说明

最小字段集合（用于列表与统计）
- 基本标识：id, hostName, ipAddress
- 运行：status ∈ {RUNNING, STOPPED, UNKNOWN}
- 防护：edrInstalled: boolean, edrOnline: boolean
- 风险：pendingAlerts: number, vulnerabilities: number
- 规格：cpu: number, memory: number, disk: number
- 来源：dataSource.provider 或 vendor
- 业务：businessSystem（用于标签）
- 责任人：systemOwner（基础情况行展示）

详情页补充字段（静态/安全）
- 网络：macAddresses, networkSegment
- OS：osType, osVersion
- 组织/业务：department, businessBlock, businessAssetName
- 安全：edrAgentVersion/Brand/Heartbeat 等（有则展示）

字段来源：以 src/types/cloud-host.ts 为准。

---

## 6. 输入/输出与约束

输入（UI 层）
- 搜索：自由文本（匹配 hostName/ipAddress/systemOwner/businessAssetName，大小写不敏感）。
- 筛选：主机风险（OK/MEDIUM/HIGH）/ 主机运行状态（RUNNING/STOPPED/UNKNOWN）/ 防护状态（ONLINE/OFFLINE/UNINSTALLED）。

输出（UI 层）
- 顶部统计：按当前数据集实时计算（总量/运行细分/风险细分/覆盖率与未安装）。
- 列表：按筛选+搜索后的卡片集合，6 列栅格；点击进入详情。

约束与边界
- 超长文本采用省略号并提供 title 提示；缺失字段不占位不报错。
- 颜色与 icon 一致映射；避免同屏重复解释性文本。
- 性能建议：分页或按需加载（PRD 不限定实现方式）。

---

## 7. 验收标准（DoD）
- 统计 Token 三项正确计算且布局为“左大数字 + 右并列细分/备注”。
- 三组筛选+搜索同排不换行；筛选 CheckableTag 未选中态可读性良好（浅底+描边）。
- 卡片 6 列、min-height 160、标签贴底；风险/防护图元缺失即隐藏；点击卡片可达详情。
- 详情页：左静态/右安全；结论条展示运行色点、风险进度格、防护图标；hover 说明完整。

---

## 8. 逻辑数据模型（LDM）与字段映射

说明：以下字段命名与项目类型定义保持一致（参见 src/types/cloud-host.ts）。UI 仅使用其中的最小集合；未在 UI 呈现的字段可用于详情补充或后续扩展。字段分组与本 PRD 的页面分区一致，确保逻辑统一。

8.1 基础信息
- id: string（系统ID）
- hostName: string（主机名称）
- ipAddress: string（主IP）
- ipAddresses?: string[]（历史/辅IP）
- macAddresses?: string[]
- vendor?: string（厂商/云平台）
- description?: string
- type: 'STANDARD' | 'TRUSTED_CREATION'
- department: string

8.2 规格信息
- cpu: number（C）
- memory: number（GB）
- disk: number（GB）
- osType: string
- osVersion?: string
- cpuModel?: string
- memoryType?: string
- storage?: { type: string; sizeGB: number; model?: string }[]
- gpu?: { model: string; count: number }

8.3 业务关联与责任
- businessBlock: string（一级/业务板块）
- businessSystem: string（二级/业务系统）
- businessAssetName?: string
- businessBlockId?: string
- businessSystemId?: string
- businessAssetId?: string
- businessVersionId?: string
- systemOwner?: string（责任人）
- owner?: { name: string; phone?: string; email?: string; organization?: string }

8.4 运行与来源
- status: 'RUNNING' | 'STOPPED' | 'UNKNOWN'
- dataSource: { source: 'CLOUD_PLATFORM' | 'MANUAL'; provider?: string; lastSyncTime?: string; syncStatus?: 'SUCCESS' | 'FAILED' | 'PENDING' }
- networkSegment?: string
- datacenter?: string
- nodeRoom?: string
- platformDetail?: string

8.5 安全与风险（用于主机风险、防护状态）
- edrInstalled: boolean
- edrOnline: boolean
- edrBrand?: string
- edrAgentVersion?: string
- edrVirusDbVersion?: string
- edrLastHeartbeat?: string
- pendingAlerts: number
- vulnerabilities: number

8.6 其他与暂不用于UI表达但保留的字段
- blocked: boolean（UI 不再以底色或卡片样式表达，仅可用于详情文字说明）
- blockedReason?: string
- blockedAt?: string
- admissionStatus: 'ALLOWED' | 'DENIED' | 'UNKNOWN'（同上，仅可用于详情说明，不驱动列表外观）
- region?: string; model?: string

8.7 UI 字段映射要点
- 运行色点：status
- 主机风险（进度格）：pendingAlerts、vulnerabilities（高=漏洞>0 或 告警>=3；中=告警1-2；正常=其余）
- 防护状态（图标）：edrInstalled + edrOnline（未防护/离线/防护中）
- 来源：dataSource.provider || vendor（‘华为云/云轴/私有云’）
- 规格行：cpu、memory、disk（缺失不占位）
- 标签行：businessSystem（必须展示），可附 label/type 等简短词
