# 任务管理页面设计文档

## 1. 功能概述

**页面路径**: `/src/pages/management/task-management`

**功能定位**: 协同任务管理 - 面向管理者，提供统一的各类协同任务看板

**核心价值**:
- 统一管理运行告警处置、脆弱性处置、资产运营三类协同任务
- 清晰展示任务分类、责任单位、执行状态
- 提供执行异常提醒能力(逾期任务、即将逾期任务)
- 支持任务催办、升级等协同管理功能

## 2. 设计原则

### 2.1 任务分类清晰
- 三类任务Tab切换: 运行告警处置、脆弱性处置、资产运营
- 每类任务独立统计,一目了然
- 不同类型任务使用不同的颜色和图标标识

### 2.2 责任单位明确
- 每个任务显著标注责任单位和责任人
- 支持按责任单位筛选任务
- 责任单位用蓝色高亮显示,便于识别

### 2.3 执行状态清晰
- 五种状态可视化: 待处理、处理中、已完成、已逾期、已忽略
- 状态用颜色编码和图标区分
- 处理中任务显示进度条
- 时间线展示完整执行流程

### 2.4 执行异常提醒
- **逾期任务**: 红色背景高亮+红色边框+逾期天数显示
- **即将逾期**: 黄色背景预警(距离截止<24小时)
- **顶部统计**: 逾期任务数量红色Badge提醒
- **催办功能**: 向责任单位发送提醒
- **升级功能**: 逾期任务可升级处理

## 3. 界面布局设计

```
┌─────────────────────────────────────────────────────────────┐
│  📋 协同任务管理 - 任务看板                                   │
│  统一管理各类协同任务,跟踪处置进度                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  │全部  │ │待处理│ │处理中│ │已完成│ │已逾期│ │已忽略│    │
│  │ 156  │ │  42  │ │  28  │ │  86  │ │ 8⚠️ │ │  0   │    │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘    │
├─────────────────────────────────────────────────────────────┤
│  [全部任务(156)] [运行告警(42)] [脆弱性(28)] [资产运营(15)]   │
│  [重置]                                                      │
├─────────────────────────────────────────────────────────────┤
│  🔍 搜索  📊 状态  🚨 优先级  👤 责任单位  📅 创建时间         │
│  共筛选出 156 个任务  其中逾期任务 8 个                       │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │ [逾期] [紧急] CPU使用率超阈值告警处理 [运行告警][处理中]│  │
│  │ 政务服务平台Web服务器CPU使用率持续超过85%...          │  │
│  │ 任务编号: ALT-20251022-0001 | 责任单位: 运维开发部-张三│  │
│  │ 影响业务: 政务服务平台 | 创建时间: 2025-10-22 09:30   │  │
│  │ ⏰ 逾期 2 天                                            │  │
│  │ [进度条 60%]                                             │  │
│  │ [详情] [催办] [升级]                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ [紧急] [重要] Apache Struts2远程代码执行漏洞修复 [脆弱性]│  │
│  │ CVE-2023-50164高危漏洞,允许攻击者通过特制请求...      │  │
│  │ 任务编号: VUL-20251020-0001 | 责任单位: 运维开发部-张三│  │
│  │ CVE: CVE-2023-50164 | 风险等级: 高危                   │  │
│  │ ⏰ 剩余 8 小时                                           │  │
│  │ [进度条 30%]                                             │  │
│  │ [详情] [催办]                                            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 4. 核心功能模块

### 4.1 统计卡片 (TaskStatisticsCards)

**功能**: 顶部六个统计卡片展示任务概况

**卡片内容**:
1. **全部任务**: 总数统计
2. **待处理**: 黄色,待分配或待开始的任务
3. **处理中**: 蓝色+旋转图标,进行中的任务
4. **已完成**: 绿色,已完成的任务
5. **已逾期**: 红色+Badge,超过截止时间的任务
6. **已忽略**: 灰色,被忽略的任务

**交互**: 点击卡片可快速筛选对应状态的任务

### 4.2 任务类型Tab

**三类任务切换**:
- 全部任务 (156)
- 运行告警处置 (42)
- 脆弱性处置 (28)
- 资产运营 (15)

**功能**:
- 显示各类型任务数量
- 点击切换查看不同类型任务
- 右上角提供重置按钮

### 4.3 筛选工具栏

**筛选条件**:
1. **搜索框**: 支持任务编号、标题、描述、业务名称搜索
2. **状态筛选**: 全部/待处理/处理中/已完成/已逾期/已忽略
3. **优先级筛选**: 全部/紧急/重要/一般/低
4. **责任单位筛选**: 全部/运维开发部/安全管理部/网络管理部/系统管理部/数据管理部
5. **日期范围**: 按创建时间范围筛选

**统计显示**:
- 当前筛选结果数量
- 逾期任务数量红色警告

### 4.4 任务列表 (TaskList)

**列表项设计**:

**头部标签行**:
- 优先级标签: [紧急][重要][一般][低]
- 任务标题: 加粗显示
- 任务类型标签: [运行告警][脆弱性][资产运营]
- 任务状态标签: [待处理][处理中][已完成][已逾期][已忽略]

**描述区域**:
- 任务描述文本(最多2行,超出省略)
- 任务编号(可复制)
- 责任单位和责任人(单位蓝色高亮)
- 影响业务
- 创建时间(绝对时间+相对时间)
- 截止时间(根据状态不同颜色):
  - 已完成: 绿色
  - 已逾期: 红色+"逾期X天"
  - 即将逾期: 黄色+"剩余X小时"
  - 正常: 灰色

**进度条** (处理中状态):
- 显示百分比进度
- 根据状态动态颜色:
  - 逾期: 红色
  - 即将逾期: 黄色
  - 正常: 蓝色

**特定类型信息**:
- 告警任务: 显示告警级别、关联资产
- 脆弱性任务: 显示CVE编号、风险等级、受影响资产
- 资产任务: 显示资产类型、处置类型

**操作按钮**:
- 详情: 查看任务完整信息
- 催办: 向责任单位发送提醒(待处理/处理中状态)
- 升级: 升级处理逾期任务(仅逾期任务)

**视觉提醒**:
- 逾期任务: 红色背景(#fff1f0)+红色边框
- 即将逾期: 黄色背景(#fffbe6)+黄色边框
- 左侧Badge标识: "逾期"(红色) / "紧急"(黄色)

### 4.5 任务详情抽屉 (TaskDetailDrawer)

**抽屉宽度**: 65%

**两个Tab**:

**Tab 1: 基本信息**

1. **任务信息卡片**:
   - 任务编号(可复制)
   - 任务ID(可复制)
   - 任务标题
   - 任务描述
   - 优先级标签
   - 任务状态
   - 影响业务
   - 进度条

2. **责任信息卡片**:
   - 责任单位
   - 责任人(如未指派显示"待指派")

3. **时间信息卡片**:
   - 创建时间(绝对+相对)
   - 截止时间(颜色提醒逾期状态)
   - 开始处理时间(如有)
   - 完成时间(如有)

4. **特定类型信息卡片**:
   - **告警信息**: 告警ID、告警级别、关联资产
   - **脆弱性信息**: CVE编号、风险等级、受影响资产
   - **资产信息**: 资产ID、资产名称、资产类型、处置类型

**Tab 2: 执行记录**

1. **执行时间线**:
   - 任务创建 (蓝色)
   - 任务指派 (蓝色)
   - 开始处理 (蓝色)
   - 进度更新 (蓝色)
   - 任务完成 (绿色)
   - 验收通过 (绿色)
   - 任务逾期 (红色)

每条记录显示:
- 操作动作
- 操作时间
- 操作人
- 描述信息

2. **处理统计**:
   - 执行步骤数
   - 总耗时/已耗时
   - 人工操作次数

**抽屉头部**:
- 标题: "协同任务详情"
- 状态标签(待处理/处理中时显示)
- 右上角催办按钮(待处理/处理中时显示)

## 5. 数据结构设计

### 5.1 协同任务 (CollaborationTask)

```typescript
interface CollaborationTask {
  id: string                        // 任务ID
  taskNo: string                    // 任务编号 (ALT/VUL/AST-YYYYMMDD-XXXX)
  type: TaskType                    // 任务类型: alert | vulnerability | asset
  title: string                     // 任务标题
  description: string               // 任务描述
  status: TaskStatus                // 状态: pending | processing | completed | overdue | ignored
  priority: TaskPriority            // 优先级: urgent | high | medium | low
  responsibleUnit: ResponsibleUnit  // 责任单位
  responsiblePerson?: string        // 责任人
  affectedBusiness: string          // 影响业务
  createdAt: string                 // 创建时间
  deadline: string                  // 截止时间
  startedAt?: string                // 开始处理时间
  completedAt?: string              // 完成时间
  progress: number                  // 进度百分比 0-100

  // 特定类型附加字段
  alertInfo?: {
    alertId: string
    alertLevel: 'critical' | 'important' | 'normal'
    relatedAsset: string
  }
  vulnerabilityInfo?: {
    cveId: string
    riskLevel: 'high' | 'medium' | 'low'
    affectedAsset: string
  }
  assetInfo?: {
    assetId: string
    assetName: string
    assetType: string
    disposalType: 'claim' | 'compliance' | 'responsibility'
  }
}
```

### 5.2 任务统计 (TaskStatistics)

```typescript
interface TaskStatistics {
  total: number
  pending: number
  processing: number
  completed: number
  overdue: number
  ignored: number

  byType: {
    alert: number
    vulnerability: number
    asset: number
  }

  byUnit: Record<ResponsibleUnit, number>

  byPriority: {
    urgent: number
    high: number
    medium: number
    low: number
  }
}
```

## 6. 关键业务逻辑

### 6.1 逾期判断逻辑

```typescript
// 判断任务是否已逾期
const isOverdue = (task: CollaborationTask): boolean => {
  return task.status === 'overdue' || (
    task.status !== 'completed' &&
    task.status !== 'ignored' &&
    dayjs().isAfter(dayjs(task.deadline))
  )
}

// 判断任务是否即将逾期 (距离截止时间<24小时)
const isNearDeadline = (task: CollaborationTask): boolean => {
  if (task.status === 'completed' || task.status === 'overdue' || task.status === 'ignored') {
    return false
  }
  const hoursLeft = dayjs(task.deadline).diff(dayjs(), 'hour')
  return hoursLeft > 0 && hoursLeft < 24
}
```

### 6.2 截止时间显示逻辑

```typescript
const getDeadlineInfo = (task: CollaborationTask) => {
  if (task.status === 'completed') {
    return { text: `已完成 ${dayjs(task.completedAt).format('MM-DD HH:mm')}`, color: '#52c41a' }
  }

  if (isOverdue(task)) {
    const overdueDays = dayjs().diff(dayjs(task.deadline), 'day')
    return { text: `逾期 ${overdueDays} 天`, color: '#ff4d4f' }
  }

  if (isNearDeadline(task)) {
    const hoursLeft = dayjs(task.deadline).diff(dayjs(), 'hour')
    return { text: `剩余 ${hoursLeft} 小时`, color: '#faad14' }
  }

  return { text: `截止 ${dayjs(task.deadline).format('MM-DD HH:mm')}`, color: '#595959' }
}
```

### 6.3 任务筛选逻辑

```typescript
const filteredTasks = useMemo(() => {
  return allTasks.filter(task => {
    // 类型筛选 (Tab)
    if (selectedType !== 'all' && task.type !== selectedType) return false

    // 状态筛选
    if (filters.status !== 'all' && task.status !== filters.status) return false

    // 优先级筛选
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false

    // 责任单位筛选
    if (filters.responsibleUnit !== 'all' && task.responsibleUnit !== filters.responsibleUnit) return false

    // 搜索文本筛选
    if (filters.searchText) {
      const searchText = filters.searchText.toLowerCase()
      return (
        task.title.toLowerCase().includes(searchText) ||
        task.taskNo.toLowerCase().includes(searchText) ||
        task.description.toLowerCase().includes(searchText) ||
        task.affectedBusiness.toLowerCase().includes(searchText)
      )
    }

    // 日期范围筛选
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      const createdAt = dayjs(task.createdAt)
      return createdAt.isAfter(dayjs(filters.dateRange[0])) &&
             createdAt.isBefore(dayjs(filters.dateRange[1]))
    }

    return true
  })
}, [allTasks, selectedType, filters])
```

### 6.4 截止时间计算规则

根据任务类型和优先级自动计算截止时间:

**告警处置任务**:
- 紧急: 24小时
- 重要: 48小时
- 一般: 72小时

**脆弱性处置任务**:
- 高危: 24小时
- 中危: 72小时
- 低危: 168小时(7天)

**资产运营任务**:
- 重要: 48小时
- 一般: 120小时(5天)
- 低优先级: 240小时(10天)

## 7. 交互流程

### 7.1 查看任务详情流程

1. 用户在任务列表点击"详情"按钮
2. 系统打开任务详情抽屉(65%宽度)
3. 默认显示"基本信息"Tab
4. 用户可切换到"执行记录"Tab查看时间线
5. 用户点击关闭或抽屉外区域关闭抽屉

### 7.2 催办任务流程

1. 用户点击任务列表或详情抽屉的"催办"按钮
2. 系统显示成功提示: "已向XX单位发送催办提醒"
3. (实际场景)系统发送消息给责任单位

### 7.3 升级逾期任务流程

1. 用户点击逾期任务的"升级"按钮
2. 系统显示警告提示: "任务XXX已升级处理"
3. (实际场景)触发升级流程,通知上级领导

### 7.4 筛选任务流程

1. 用户可通过以下方式筛选:
   - 点击顶部统计卡片 → 按状态筛选
   - 点击类型Tab → 按类型筛选
   - 使用筛选工具栏 → 多条件组合筛选
2. 筛选结果实时更新
3. 底部显示筛选结果统计
4. 点击"重置"按钮清除所有筛选条件

## 8. Mock数据设计

### 8.1 数据生成策略

使用确定性随机算法(seededRandom)生成模拟数据,保证:
- 数据可重复
- 状态分布合理
- 时间关系正确(创建时间<开始时间<完成时间)

### 8.2 任务分布

**总任务数**: 约85个
- 告警处置任务: 42个
- 脆弱性处置任务: 28个
- 资产运营任务: 15个

**状态分布** (粗略):
- 待处理: 30%
- 处理中: 25%
- 已完成: 35%
- 已逾期: 8%
- 已忽略: 2%

**优先级分布**:
- 紧急: 15%
- 重要: 35%
- 一般: 40%
- 低: 10%

### 8.3 责任单位分布

- 运维开发部: 50% (主要负责告警和脆弱性)
- 安全管理部: 20% (脆弱性处置)
- 网络管理部: 15% (网络相关告警)
- 系统管理部: 10% (资产运营)
- 数据管理部: 5% (数据库相关)

## 9. 技术实现要点

### 9.1 组件结构

```
task-management/
├── index.tsx                 # 主页面,集成所有功能
├── index.css                 # 页面样式
├── types.ts                  # TypeScript类型定义
├── components/
│   ├── TaskStatisticsCards.tsx   # 统计卡片组件
│   ├── TaskList.tsx              # 任务列表组件
│   └── TaskDetailDrawer.tsx      # 任务详情抽屉组件
└── mock/
    └── task-data.ts          # Mock数据生成
```

### 9.2 状态管理

使用React Hooks管理本地状态:
- `useState`: 任务数据、筛选条件、选中任务、抽屉可见性
- `useMemo`: 筛选后的任务列表、统计数据计算

### 9.3 性能优化

1. **useMemo缓存**: 筛选和统计计算使用useMemo缓存
2. **分页加载**: 列表默认每页10条,支持10/20/50/100切换
3. **虚拟滚动**: 如任务量极大,可考虑使用虚拟列表

### 9.4 响应式设计

- 移动端: 卡片垂直堆叠,筛选条件换行
- 平板端: 统计卡片2列布局
- 桌面端: 统计卡片6列布局

## 10. 与产品需求映射

根据产品文档"协同任务管理"功能需求:

✅ **统一的各类协同任务看板**: 三类任务统一展示
✅ **运行告警处置任务**: 完整支持
✅ **脆弱性处置任务**: 完整支持
✅ **资产运营任务**: 完整支持
✅ **查看全部任务清单**: 列表+分页
✅ **查看处置详情**: 详情抽屉
✅ **催办功能**: 催办按钮+提醒
✅ **任务状态跟踪**: 状态可视化+时间线

## 11. 后续扩展

### 11.1 可能的功能增强

1. **批量操作**: 支持批量催办、批量指派
2. **导出功能**: 导出任务列表Excel
3. **统计报表**: 按单位、按类型的趋势分析
4. **消息通知**: 集成实时消息推送
5. **权限控制**: 不同角色看到不同任务

### 11.2 数据对接

实际场景需要对接:
- 告警系统API
- 脆弱性扫描系统API
- 资产管理系统API
- 消息通知系统API
- 用户权限系统API

## 12. 设计优势总结

1. **任务分类清晰**: 三类任务Tab切换,类型一目了然
2. **责任单位明确**: 蓝色高亮显示,支持按单位筛选
3. **执行状态清晰**: 五种状态颜色编码,进度条可视化
4. **执行异常提醒**: 逾期红色,即将逾期黄色,催办升级功能
5. **信息完整性**: 详情抽屉展示所有相关信息和执行历史
6. **操作便捷性**: 一键催办,快速筛选,多维度查询
7. **专业性**: 遵循Ant Design B2B规范,界面清晰专业
