# 任务中心页面设计文档

## 页面概述

**页面名称**: 任务中心（Task Center）
**功能定位**: 业务协同管理系统 - 运维开发部任务管理中心
**访问路径**: `/collaboration/task-center`
**设计日期**: 2025-10-15

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

### 2. 统计概览卡片（Statistics Overview）

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ [Bug Icon]   │  │ [DB Icon]    │  │ [Alert Icon] │
│ 脆弱性处置   │  │ 资产认领     │  │ 告警处置     │
│    6         │  │    5         │  │    5         │
└──────────────┘  └──────────────┘  └──────────────┘
```

**组件**: Ant Design `<Card>` + `<Statistic>`
**布局**: 响应式Grid布局（xs: 24, sm: 8）
**特点**:
- 每个统计卡片显示不同的图标和颜色
- 数字大小突出，便于快速浏览
- 颜色编码：
  - 脆弱性：红色 (#ff4d4f)
  - 资产认领：橙色 (#faad14)
  - 告警处置：蓝色 (#1890ff)

### 3. 任务卡片区域（Task Cards）

每个任务类型使用独立的卡片组件，结构一致：

```
┌─────────────────────────────────────────────────────────────────┐
│ [图标] 任务类型名称                    [筛选按钮组] [统计信息]  │
│       任务描述                                                   │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │                      任务列表表格                            ││
│ │ ┌─────┬─────┬─────┬─────┬─────┬─────┬─────────┐            ││
│ │ │列1  │列2  │列3  │列4  │列5  │状态 │ 操作     │            ││
│ │ ├─────┼─────┼─────┼─────┼─────┼─────┼─────────┤            ││
│ │ │...  │...  │...  │...  │...  │Tag  │ 按钮    │            ││
│ │ └─────┴─────┴─────┴─────┴─────┴─────┴─────────┘            ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

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
