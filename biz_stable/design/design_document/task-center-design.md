# 任务中心页面设计文档

## 页面概述

**页面名称**: 任务中心（Task Center）
**功能定位**: 业务协同管理系统 - 运维开发部任务管理中心
**访问路径**: `/collaboration/task-center`
**设计日期**: 2025-10-15

## 修订记录
- v1.1（当前）：
  - 个人视角默认落地“我的待办”（处置中：待处理/处理中/逾期）
  - 取消“任务类型”Tab，改为筛选条中的“任务类型（一级/二级）”层级多选
  - 二级类型作为筛选最小粒度；可多选；父子联动（选父=选全子；子部分选=父半选）
  - 不改动现有任务列表信息结构与详情信息结构

## 功能需求

任务中心是运维开发部的核心工作页面，负责管理三类主要任务：
1. **脆弱性处置**: 处理未修复的系统漏洞（高危/中危/低危）
2. **资产认领**: 认领并管理未分配的资产
3. **告警处置**: 处理系统运行异常告警（紧急/重要/一般）

## 页面结构

### 1. 页面头部（Page Header）

```
┌─────────────────────────────────────────────────────────────────┐
│  [图标] 运维开发部                     今日新增: 8  今日完成: 5  │
│         任务中心                                                  │
│         负责系统漏洞修复、资产维护及异常告警处理                 │
└─────────────────────────────────────────────────────────────────┘
```

**组件**: 自定义头部布局
**包含元素**:
- 部门图标 + 部门名称
- 页面标题 + 副标题
- 今日统计数据（新增任务数、完成任务数）

**样式特点**:
- 使用Flex布局，左右分栏
- 部门图标采用圆形背景，带阴影效果
- 统计数字突出显示，不同状态使用不同颜色

### 2. 顶层分类（个人工单工作台）

- 四个分类卡片（左→右）：我的待办｜我提交的｜我的已办｜全部工单
- 行为：点击切换工单“范围”
  - 我的待办：当前处理人为我，状态=处置中（待处理｜处理中｜逾期）
  - 我提交的：发起人=我；状态默认=全部
  - 我的已办：由我完成的工单（口径：status=completed 且我为当前处理人/责任人/发起人任一匹配）；状态默认=已完成
  - 全部工单：所有工单；状态默认=全部
- UI 风格：参考 docs/1.png
  - 卡片：圆角 14px；浅色渐变底；淡投影；悬浮上浮
  - 左侧图标：40×40 圆角矩形，纯色底+白色图标；不同分类使用不同主题色
  - 右侧：上为计数（22px/700）；下为标题（13px/次要色）
  - 右上角水印装饰（模糊圆形）
  - 选中态：边框高亮、投影加深
  - 响应式：≤1200px 两列排布

### 3. 状态统计卡片（已取消）
- 决策：不再展示“全部任务｜处置中｜已完成｜已作废”的状态统计卡片
- 替代：关键计数在筛选摘要行内轻量展示（如“处置中 X｜已完成 Y｜已作废 Z”），不再以卡片呈现

### 4. 过滤与列表（Filters + List）
统一使用列表视图（不按类型分卡片），筛选条置于列表上方：

```
┌──────────────────────────────────────────────────────────────┐
│ [搜索框] [任务类型(一级/二级多选)] [状态] [发起人] [单位] [时间] │
│  筛选摘要：chips（可关闭）      [重置筛选]                      │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                         任务列表（保持现有字段）              │
└──────────────────────────────────────────────────────────────┘
```

默认落地：我的待办（状态=处置中）。

任务类型层级字典：
- 一级｜二级（二级为筛选最小粒度）：
  - 告警处置：告警处置
  - 事件处置：事件处置
  - 芮错行处置：弱口令、主机漏洞、web漏洞、配置核查
  - 远程访问：远程访问
  - 网络准入：互联网准入、政务外网准入
  - 专项检查：专项检查、测评支持
  - 资源发布：系统上线、资源回收
  - 安全加固：安全加固、应急处置

筛选规则：
- 选中一级类型 → 等价于选中该一级下全部二级类型
- 可同时选择多个一级/二级；结果取“或”的并集
- 空选（未选择）等价“全部”

## 组件设计

### 3.1 脆弱性处置卡片（VulnerabilityCard）

**文件位置**: `src/pages/collaboration/task-center/components/VulnerabilityCard.tsx`

**Props接口**:
```typescript
interface VulnerabilityCardProps {
  data: Vulnerability[]       // 脆弱性数据列表
  onHandle: (id: string) => void  // 处理按钮回调
  onView: (id: string) => void    // 查看按钮回调
}
```

**功能特性**:
1. **状态筛选**: 全部/未处理/处理中/已完成
2. **风险等级统计**: 显示高危/中危/低危漏洞数量
3. **表格列**:
   - 漏洞名称 + CVE编号（30%）
   - 风险等级（12%，Tag显示）
   - 影响资产数（12%）
   - 发布时间（12%）
   - 状态（12%，Tag显示）
   - 操作（22%，处理/查看按钮）

**交互逻辑**:
- 点击"处理"按钮 → 触发 `onHandle(id)`
- 处理中的任务显示"继续处理"按钮
- 点击"查看"按钮 → 触发 `onView(id)`
- Radio按钮切换筛选状态，表格实时更新

**数据流**:
```
父组件 → VulnerabilityCard → Table → 用户操作 → 回调函数 → 父组件
```

### 3.2 资产认领卡片（AssetClaimCard）

**文件位置**: `src/pages/collaboration/task-center/components/AssetClaimCard.tsx`

**Props接口**:
```typescript
interface AssetClaimCardProps {
  data: Asset[]                   // 资产数据列表
  onClaim: (id: string) => void   // 认领按钮回调
  onReject: (id: string) => void  // 拒绝按钮回调
  onView: (id: string) => void    // 查看按钮回调
}
```

**功能特性**:
1. **状态筛选**: 全部/未认领/已认领/已拒绝
2. **资产统计**: 显示未认领/已认领数量
3. **表格列**:
   - 资产名称（20%）
   - IP地址（15%）
   - 资产类型（12%）
   - 操作系统/版本（18%）
   - 发现时间（12%）
   - 状态（10%，Tag显示）
   - 操作（13%，认领/拒绝/查看按钮）

**交互逻辑**:
- 未认领状态：显示"认领"和"拒绝"两个按钮
- 已认领状态：仅显示"查看"按钮
- 已拒绝状态：不显示操作按钮

### 3.3 告警处置卡片（AlertHandleCard）

**文件位置**: `src/pages/collaboration/task-center/components/AlertHandleCard.tsx`

**Props接口**:
```typescript
interface AlertHandleCardProps {
  data: Alert[]                     // 告警数据列表
  onHandle: (id: string) => void    // 处理按钮回调
  onIgnore: (id: string) => void    // 忽略按钮回调
  onView: (id: string) => void      // 查看按钮回调
}
```

**功能特性**:
1. **状态筛选**: 全部/未处理/处理中/已解决/已忽略
2. **等级统计**: 显示紧急/重要/一般告警数量
3. **表格列**:
   - 告警名称（25%）
   - 关联资产（22%，显示资产名称+IP）
   - 告警等级（10%，Tag显示）
   - 持续时间（10%）
   - 发生时间（11%）
   - 状态（10%，Tag显示）
   - 操作（12%，处理/忽略/查看按钮）

**交互逻辑**:
- 未处理状态：显示"处理"和"忽略"按钮
- 处理中状态：显示"继续处理"按钮
- 已解决/已忽略状态：显示"查看"按钮

## 数据结构

### Vulnerability（脆弱性）
```typescript
interface Vulnerability {
  id: string                  // 唯一标识
  name: string                // 漏洞名称
  cveId: string               // CVE编号
  riskLevel: 'high' | 'medium' | 'low'  // 风险等级
  affectedAssets: number      // 影响资产数量
  publishTime: string         // 发布时间
  status: 'unhandled' | 'processing' | 'completed'  // 处理状态
  description?: string        // 详细描述
}
```

### Asset（资产）
```typescript
interface Asset {
  id: string                  // 唯一标识
  name: string                // 资产名称
  ipAddress: string           // IP地址
  type: string                // 资产类型
  os: string                  // 操作系统
  discoveryTime: string       // 发现时间
  status: 'unclaimed' | 'claimed' | 'rejected'  // 认领状态
  location?: string           // 物理位置
}
```

### Alert（告警）
```typescript
interface Alert {
  id: string                  // 唯一标识
  name: string                // 告警名称
  relatedAsset: {             // 关联资产
    name: string
    ipAddress: string
  }
  level: 'critical' | 'important' | 'normal'  // 告警等级
  duration: string            // 持续时间
  occurTime: string           // 发生时间
  status: 'unhandled' | 'processing' | 'resolved' | 'ignored'  // 处理状态
}
```

## 技术实现

### 状态管理
- 使用React Hooks（useState, useMemo）进行本地状态管理
- 筛选状态独立管理，不影响原始数据
- 统计数据通过useMemo计算，避免重复计算

### 性能优化
1. **useMemo优化**:
   - 筛选后的数据列表
   - 统计数据计算
2. **表格分页**: 默认每页10条，减少DOM渲染
3. **条件渲染**: 操作按钮根据状态动态显示

### 样式设计

**颜色方案**:
- 主色调遵循Ant Design规范
- 状态颜色:
  - 高危/紧急/错误: #ff4d4f（红色）
  - 中危/重要/警告: #faad14（橙色）
  - 低危/一般/默认: #8c8c8c（灰色）
  - 成功/已完成: #52c41a（绿色）
  - 处理中: #1890ff（蓝色）

**响应式设计**:
- 断点: 768px
- 小屏幕下：
  - 卡片头部垂直排列
  - 筛选按钮撑满宽度
  - 统计信息均匀分布

### 组件复用模式

三个卡片组件采用相同的结构模式：
```typescript
const TaskCard: React.FC<Props> = ({ data, callbacks }) => {
  // 1. 状态定义
  const [filter, setFilter] = useState<FilterStatus>('all')

  // 2. 数据计算（useMemo）
  const filteredData = useMemo(() => {...}, [data, filter])
  const stats = useMemo(() => {...}, [data])

  // 3. 表格配置
  const columns: ColumnsType = [...]

  // 4. UI渲染
  return (
    <Card>
      <div className="card-header">
        {/* 左侧：标题+描述 */}
        {/* 右侧：筛选+统计 */}
      </div>
      <Table columns={columns} dataSource={filteredData} />
    </Card>
  )
}
```

## Mock数据

**文件位置**: `src/pages/collaboration/task-center/mock/task-data.ts`

**生成函数**:
- `generateVulnerabilities()`: 生成6条脆弱性数据
- `generateAssets()`: 生成5条资产数据
- `generateAlerts()`: 生成5条告警数据
- `generateTaskStatistics()`: 生成任务统计数据
- `generateTodayStatistics()`: 生成今日统计数据

**数据特点**:
- 真实场景模拟（如CVE漏洞、真实资产名称）
- 多种状态分布，便于测试筛选功能
- 相对时间表示（如"2小时前"、"1天前"）

## 交互流程

### 脆弱性处置流程
```
1. 用户查看脆弱性列表
2. 使用筛选按钮过滤（如：仅显示"未处理"）
3. 点击"处理"按钮 → 触发onHandle
4. （未来）打开处理模态框，填写处理信息
5. 提交后更新状态为"处理中"或"已完成"
```

### 资产认领流程
```
1. 用户查看未认领资产列表
2. 点击"认领"按钮 → 触发onClaim
3. （未来）确认认领 → 更新状态为"已认领"
4. 或点击"拒绝"按钮 → 触发onReject
5. （未来）填写拒绝原因 → 更新状态为"已拒绝"
```

### 告警处置流程
```
1. 用户查看告警列表
2. 根据等级和状态筛选
3. 点击"处理"按钮 → 触发onHandle
4. （未来）打开处理模态框，记录处理过程
5. 提交后更新状态为"已解决"
6. 或点击"忽略"按钮 → 触发onIgnore
7. （未来）填写忽略原因 → 更新状态为"已忽略"
```

## 待实现功能

1. **模态框组件**（下一阶段）:
   - 脆弱性处理模态框
   - 资产认领确认模态框
   - 资产拒绝原因模态框
   - 告警处理模态框
   - 告警忽略原因模态框
   - 详情查看模态框
   - 成功反馈页面

2. **后端集成**:
   - 替换Mock数据为真实API调用
   - 实现数据的增删改查
   - 状态更新的持久化

3. **高级功能**:
   - 批量操作（批量处理、批量认领）
   - 导出功能（导出任务列表）
   - 任务通知提醒
   - 任务历史记录

## 文件清单

```
src/pages/collaboration/task-center/
├── index.tsx                           # 主页面组件
├── index.css                           # 主页面样式
├── types.ts                            # TypeScript类型定义
├── mock/
│   └── task-data.ts                   # Mock数据生成器
└── components/
    ├── VulnerabilityCard.tsx          # 脆弱性处置卡片
    ├── VulnerabilityCard.css          # 脆弱性卡片样式
    ├── AssetClaimCard.tsx             # 资产认领卡片
    ├── AssetClaimCard.css             # 资产认领样式
    ├── AlertHandleCard.tsx            # 告警处置卡片
    └── AlertHandleCard.css            # 告警处置样式
```

## 测试要点

1. **功能测试**:
   - 筛选按钮切换，表格正确过滤
   - 统计数字与实际数据一致
   - 按钮点击触发正确的回调函数

2. **UI测试**:
   - 响应式布局在不同屏幕尺寸下正常
   - 颜色编码清晰，符合设计规范
   - Tag状态显示正确

3. **性能测试**:
   - 大量数据时表格渲染流畅
   - 筛选切换无明显延迟

## 设计决策说明

1. **为什么使用三个独立的卡片组件而非通用卡片？**
   - 各任务类型的数据结构和操作逻辑差异较大
   - 独立组件便于维护和扩展
   - 类型安全性更好

2. **为什么统计数据使用useMemo？**
   - 避免每次渲染都重新计算
   - 统计逻辑涉及数组遍历，有一定性能开销

3. **为什么暂时使用message.info而非打开模态框？**
   - 分阶段实现，先完成基础UI
   - 便于测试交互流程
   - 后续可统一替换为模态框组件

## 更新日志

- **2025-10-15**: 初始版本，完成三个任务卡片组件的开发和集成
