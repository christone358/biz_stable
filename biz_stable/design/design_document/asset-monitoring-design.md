# 资产监测页面设计文档

## 一、页面定位与目标

### 功能定位
资产监测页面（asset-monitoring）是为运维或开发单位提供的系统健康监控工具，帮助用户实时监测其责任范围内的资产运行状况。

### 目标用户
- 运维人员：监控系统运行状态，及时发现和处理问题
- 开发单位：了解系统健康状况，辅助系统维护决策

### 核心功能
- 多系统健康状态总览
- 关键指标监控
- 运行告警管理
- 脆弱性跟踪
- 资产组成分析
- 调用链可视化

---

## 二、创新设计理念

### 设计原则
1. **全景与细节并重**：一个屏幕同时呈现多系统概览和单系统详情
2. **渐进式信息展示**：通过悬浮交互实现从简到详的信息展示
3. **流畅的交互体验**：去除传统面包屑导航，采用hover自动展开机制
4. **视觉化健康状态**：通过颜色编码快速识别系统健康状况

### 核心创新点
- **双态视图设计**：简略视图（Brief View）+ 卡片视图（Card View）
- **悬浮自动展开**：鼠标移入自动展开详细信息，移出自动收起
- **无需导航切换**：所有系统在同一视图中切换，无需面包屑

---

## 三、界面布局设计

### 整体布局结构

```
┌───────────────────────────────────────────────────────────────────┐
│                        顶部：系统健康概览区域                        │
│                    （支持hover展开/收起，横向滚动）                  │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│                      下方：详细监控数据区域                         │
│                     （Tab切换不同监控维度数据）                     │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### 顶部区域：系统健康概览

#### 简略视图（默认状态）
```
┌────────┬────────┬────────┬────────┬────────┬────────┐
│ ● 系统A │ ● 系统B │ ● 系统C │ ● 系统D │ ● 系统E │ ● 系统F │ ... →
│  健康   │  健康   │  异常   │  健康   │  警告   │  健康   │
└────────┴────────┴────────┴────────┴────────┴────────┘
```

**视觉特征**：
- 高度：50px
- 宽度：每个卡片150px（系统多时可横向滚动）
- 背景：白色，选中系统带蓝色边框
- 内容：健康状态圆点 + 系统名称 + 健康度文字

**健康状态圆点颜色编码**：
- 🟢 绿色（#52c41a）：健康（分数 ≥ 90）
- 🟡 黄色（#faad14）：警告（70 ≤ 分数 < 90）
- 🔴 红色（#ff4d4f）：异常（分数 < 70）

#### 卡片视图（悬浮展开状态）
```
┌──────────────────────────────────────────────┐
│ 系统A - 一网通办门户              健康度: 95% │
│ ● 健康                                       │
│ ──────────────────────────────────────────── │
│ 📊 关键指标: 正常                             │
│ ⚠️ 运行告警: 2个                             │
│ 🔒 脆弱性: 3个                                │
│ 💾 资产数量: 45个                             │
│ 🕒 最近更新: 2分钟前                          │
└──────────────────────────────────────────────┘
```

**视觉特征**：
- 高度：140px
- 宽度：240px
- 背景：白色，带阴影（0 4px 12px rgba(0,0,0,0.15)）
- 内容：系统完整信息 + 快速统计 + 健康度百分比

**信息层级**：
1. 标题行：系统名称 + 健康度百分比
2. 状态行：健康状态圆点 + 状态文字
3. 统计区：关键指标、告警、脆弱性、资产数量（图标+文字）
4. 更新时间：最近数据更新时间

### 下方区域：详细监控数据

采用Tab标签页布局，包含以下Tab：

1. **关键指标**（默认Tab）
   - 显示：CPU、内存、磁盘、网络等关键性能指标
   - 可视化：趋势图表 + 实时数值

2. **运行告警**
   - 显示：当前系统的所有运行告警
   - 分类：紧急、重要、一般
   - 支持：快速处理和忽略操作

3. **脆弱性**
   - 显示：当前系统的脆弱性列表
   - 分类：高危、中危、低危
   - 支持：处理状态跟踪

4. **调用链**
   - 显示：系统间调用关系可视化
   - 展示：上游/下游系统依赖
   - 支持：点击跳转到关联系统

5. **资产组成**
   - 显示：当前系统包含的所有资产
   - 分类：云服务器、数据库、中间件、缓存等
   - 支持：资产详情查看

---

## 四、交互流程设计

### 流程1：页面初始加载

```
用户访问页面
    ↓
加载用户负责的所有系统列表
    ↓
顶部显示为简略视图（所有系统横向排列）
    ↓
默认选中第一个系统（蓝色边框高亮）
    ↓
下方加载第一个系统的详细监控数据（默认显示"关键指标"Tab）
```

### 流程2：悬浮展开交互

```
鼠标移入顶部概览区域
    ↓
触发展开动画（300ms ease-in-out）
    ↓
所有系统卡片同时从简略视图展开为卡片视图
    ↓
用户查看各系统的详细摘要信息
    ↓
鼠标移出顶部区域
    ↓
触发收起动画（300ms ease-in-out）
    ↓
所有卡片收起回到简略视图
```

### 流程3：切换系统

```
用户点击某个系统卡片（简略或卡片视图均可）
    ↓
该系统边框高亮为选中状态
    ↓
取消上一个选中系统的高亮
    ↓
下方详细数据区域显示加载动画
    ↓
加载新系统的监控数据
    ↓
Tab重置为"关键指标"（或保持当前Tab）
    ↓
数据加载完成，展示新系统的详细信息
```

### 流程4：Tab切换

```
用户点击某个Tab标签
    ↓
Tab标签切换为激活状态
    ↓
内容区域淡出当前数据（150ms fade-out）
    ↓
加载新Tab的数据
    ↓
内容区域淡入新数据（150ms fade-in）
```

---

## 五、数据结构设计

### 系统健康数据模型

```typescript
/**
 * 系统健康状态
 */
export type SystemHealthStatus = 'healthy' | 'warning' | 'critical'

/**
 * 系统概览信息（卡片视图使用）
 */
export interface SystemOverview {
  id: string                          // 系统ID
  name: string                        // 系统名称
  shortName?: string                  // 系统简称（简略视图显示）
  healthScore: number                 // 健康度分数（0-100）
  healthStatus: SystemHealthStatus    // 健康状态
  healthLabel: string                 // 健康状态文字
  healthColor: string                 // 健康状态颜色

  // 快速统计
  metricsStatus: 'normal' | 'abnormal'  // 关键指标状态
  alertCount: number                    // 告警数量
  vulnerabilityCount: number            // 脆弱性数量
  assetCount: number                    // 资产数量
  lastUpdateTime: string                // 最近更新时间
}

/**
 * 系统详细监控数据
 */
export interface SystemMonitoringData {
  systemId: string

  // 关键指标
  keyMetrics: {
    cpu: MetricData
    memory: MetricData
    disk: MetricData
    network: MetricData
  }

  // 运行告警
  alerts: Alert[]

  // 脆弱性
  vulnerabilities: Vulnerability[]

  // 调用链
  callChain: {
    upstream: SystemNode[]    // 上游系统
    downstream: SystemNode[]  // 下游系统
  }

  // 资产组成
  assets: Asset[]
}

/**
 * 指标数据
 */
export interface MetricData {
  name: string           // 指标名称
  value: number          // 当前值
  unit: string           // 单位
  threshold: number      // 阈值
  status: 'normal' | 'warning' | 'critical'
  trend: number[]        // 趋势数据（时间序列）
}

/**
 * 调用链节点
 */
export interface SystemNode {
  systemId: string
  systemName: string
  callCount: number      // 调用次数
  avgResponseTime: number // 平均响应时间
}
```

### 健康度计算规则

```typescript
/**
 * 健康度计算逻辑
 */
function calculateHealthScore(system: SystemMonitoringData): number {
  let score = 100

  // 1. 关键指标扣分（最多扣30分）
  const metrics = system.keyMetrics
  if (metrics.cpu.status === 'warning') score -= 5
  if (metrics.cpu.status === 'critical') score -= 10
  if (metrics.memory.status === 'warning') score -= 5
  if (metrics.memory.status === 'critical') score -= 10
  if (metrics.disk.status === 'warning') score -= 5
  if (metrics.disk.status === 'critical') score -= 10

  // 2. 告警扣分（最多扣40分）
  const criticalAlerts = system.alerts.filter(a => a.level === 'critical').length
  const importantAlerts = system.alerts.filter(a => a.level === 'important').length
  score -= criticalAlerts * 10
  score -= importantAlerts * 5

  // 3. 脆弱性扣分（最多扣30分）
  const highVulns = system.vulnerabilities.filter(v => v.riskLevel === 'high').length
  const mediumVulns = system.vulnerabilities.filter(v => v.riskLevel === 'medium').length
  score -= highVulns * 10
  score -= mediumVulns * 5

  return Math.max(0, Math.min(100, score))
}

/**
 * 根据分数确定健康状态
 */
function getHealthStatus(score: number): {
  status: SystemHealthStatus
  label: string
  color: string
} {
  if (score >= 90) {
    return { status: 'healthy', label: '健康', color: '#52c41a' }
  } else if (score >= 70) {
    return { status: 'warning', label: '警告', color: '#faad14' }
  } else {
    return { status: 'critical', label: '异常', color: '#ff4d4f' }
  }
}
```

---

## 六、组件设计方案

### 组件结构

```
src/pages/collaboration/asset-monitoring/
├── index.tsx                          # 主页面组件
├── index.css                          # 主页面样式
├── types.ts                           # 类型定义
├── components/
│   ├── SystemOverview/                # 系统概览区域
│   │   ├── index.tsx
│   │   ├── index.css
│   │   └── SystemCard.tsx             # 单个系统卡片
│   ├── MonitoringDetail/              # 详细监控区域
│   │   ├── index.tsx
│   │   ├── index.css
│   │   ├── KeyMetrics.tsx             # 关键指标Tab
│   │   ├── AlertsTab.tsx              # 运行告警Tab
│   │   ├── VulnerabilitiesTab.tsx     # 脆弱性Tab
│   │   ├── CallChainTab.tsx           # 调用链Tab
│   │   └── AssetsTab.tsx              # 资产组成Tab
│   └── HealthIndicator/               # 健康状态指示器（复用组件）
│       ├── index.tsx
│       └── index.css
└── mock/
    └── monitoring-data.ts             # 模拟数据
```

### 核心组件：SystemOverview

**职责**：管理顶部系统健康概览区域，处理简略/卡片视图切换和系统选择

```typescript
interface SystemOverviewProps {
  systems: SystemOverview[]              // 系统列表
  selectedSystemId: string | null        // 当前选中的系统ID
  onSystemSelect: (systemId: string) => void  // 系统选择回调
}

const SystemOverview: React.FC<SystemOverviewProps> = ({
  systems,
  selectedSystemId,
  onSystemSelect
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleMouseEnter = () => setIsExpanded(true)
  const handleMouseLeave = () => setIsExpanded(false)

  return (
    <div
      className="system-overview-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="system-cards-wrapper">
        {systems.map(system => (
          <SystemCard
            key={system.id}
            system={system}
            isExpanded={isExpanded}
            isSelected={system.id === selectedSystemId}
            onClick={() => onSystemSelect(system.id)}
          />
        ))}
      </div>
    </div>
  )
}
```

### 核心组件：SystemCard

**职责**：渲染单个系统卡片，支持简略/卡片双态视图

```typescript
interface SystemCardProps {
  system: SystemOverview
  isExpanded: boolean                    // 是否展开为卡片视图
  isSelected: boolean                    // 是否被选中
  onClick: () => void
}

const SystemCard: React.FC<SystemCardProps> = ({
  system,
  isExpanded,
  isSelected,
  onClick
}) => {
  const cardClass = classNames('system-card', {
    'expanded': isExpanded,
    'brief': !isExpanded,
    'selected': isSelected
  })

  return (
    <div className={cardClass} onClick={onClick}>
      {isExpanded ? (
        // 卡片视图
        <div className="card-view">
          <div className="card-header">
            <span className="system-name">{system.name}</span>
            <span className="health-score">{system.healthScore}%</span>
          </div>
          <div className="health-status">
            <span
              className="status-dot"
              style={{ backgroundColor: system.healthColor }}
            />
            <span className="status-label">{system.healthLabel}</span>
          </div>
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-icon">📊</span>
              <span>关键指标: {system.metricsStatus === 'normal' ? '正常' : '异常'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⚠️</span>
              <span>运行告警: {system.alertCount}个</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🔒</span>
              <span>脆弱性: {system.vulnerabilityCount}个</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">💾</span>
              <span>资产: {system.assetCount}个</span>
            </div>
          </div>
          <div className="update-time">
            🕒 最近更新: {system.lastUpdateTime}
          </div>
        </div>
      ) : (
        // 简略视图
        <div className="brief-view">
          <span
            className="status-dot"
            style={{ backgroundColor: system.healthColor }}
          />
          <span className="system-name">
            {system.shortName || system.name}
          </span>
          <span className="status-label">{system.healthLabel}</span>
        </div>
      )}
    </div>
  )
}
```

### 核心组件：MonitoringDetail

**职责**：管理下方详细监控区域，处理Tab切换和数据加载

```typescript
interface MonitoringDetailProps {
  systemId: string | null                // 当前选中的系统ID
  monitoringData: SystemMonitoringData | null
}

const MonitoringDetail: React.FC<MonitoringDetailProps> = ({
  systemId,
  monitoringData
}) => {
  const [activeTab, setActiveTab] = useState('keyMetrics')

  if (!systemId || !monitoringData) {
    return (
      <div className="monitoring-detail-empty">
        请选择一个系统查看详细监控数据
      </div>
    )
  }

  return (
    <div className="monitoring-detail-container">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'keyMetrics',
            label: '关键指标',
            children: <KeyMetrics data={monitoringData.keyMetrics} />
          },
          {
            key: 'alerts',
            label: `运行告警 (${monitoringData.alerts.length})`,
            children: <AlertsTab alerts={monitoringData.alerts} />
          },
          {
            key: 'vulnerabilities',
            label: `脆弱性 (${monitoringData.vulnerabilities.length})`,
            children: <VulnerabilitiesTab vulnerabilities={monitoringData.vulnerabilities} />
          },
          {
            key: 'callChain',
            label: '调用链',
            children: <CallChainTab data={monitoringData.callChain} />
          },
          {
            key: 'assets',
            label: `资产组成 (${monitoringData.assets.length})`,
            children: <AssetsTab assets={monitoringData.assets} />
          }
        ]}
      />
    </div>
  )
}
```

---

## 七、样式设计规范

### CSS自定义属性

```css
/* 在 App.css 中定义 */
:root {
  /* 健康状态颜色 */
  --health-healthy: #52c41a;
  --health-warning: #faad14;
  --health-critical: #ff4d4f;

  /* 过渡动画时长 */
  --transition-duration: 300ms;
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);

  /* 卡片尺寸 */
  --card-brief-height: 50px;
  --card-brief-width: 150px;
  --card-expanded-height: 140px;
  --card-expanded-width: 240px;

  /* 间距 */
  --overview-gap: 12px;
}
```

### 核心样式实现

```css
/* SystemOverview 容器 */
.system-overview-container {
  padding: 16px;
  background-color: #f5f5f5;
  overflow-x: auto;
  overflow-y: visible;
  transition: all var(--transition-duration) var(--transition-timing);
}

.system-cards-wrapper {
  display: flex;
  gap: var(--overview-gap);
  min-width: fit-content;
}

/* SystemCard 卡片 */
.system-card {
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition-duration) var(--transition-timing);
  position: relative;
}

/* 简略视图状态 */
.system-card.brief {
  height: var(--card-brief-height);
  width: var(--card-brief-width);
  padding: 8px 12px;
  border: 2px solid transparent;
}

.system-card.brief:hover {
  background-color: #fafafa;
}

/* 卡片视图状态 */
.system-card.expanded {
  height: var(--card-expanded-height);
  width: var(--card-expanded-width);
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid transparent;
}

/* 选中状态 */
.system-card.selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.1);
}

/* 简略视图内容 */
.brief-view {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.brief-view .status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.brief-view .system-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.brief-view .status-label {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 卡片视图内容 */
.card-view {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header .system-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-header .health-score {
  font-size: 18px;
  font-weight: bold;
  color: var(--primary-color);
}

.health-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.health-status .status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.health-status .status-label {
  font-size: 14px;
  font-weight: 500;
}

.quick-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.stat-icon {
  font-size: 14px;
}

.update-time {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: auto;
  padding-top: 4px;
  border-top: 1px solid #f0f0f0;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .system-card.brief {
    width: 100%;
  }

  .system-card.expanded {
    width: 100%;
  }

  .system-cards-wrapper {
    flex-direction: column;
  }
}
```

---

## 八、响应式设计

### 桌面端（宽度 > 1200px）
- 顶部概览区域：系统卡片横向排列，支持横向滚动
- 简略视图：150px宽度
- 卡片视图：240px宽度
- 下方详细区域：全宽度展示

### 平板端（768px < 宽度 ≤ 1200px）
- 顶部概览区域：系统卡片横向排列，卡片宽度稍小
- 简略视图：120px宽度
- 卡片视图：200px宽度
- 下方详细区域：全宽度展示

### 移动端（宽度 ≤ 768px）
- 顶部概览区域：系统卡片纵向堆叠
- 简略视图：全宽度，高度40px
- 卡片视图：全宽度，高度自适应
- 下方详细区域：Tab标签缩小，图表简化

---

## 九、性能优化策略

### 1. 虚拟滚动
当系统数量超过20个时，使用虚拟滚动技术只渲染可见区域的卡片

### 2. 数据缓存
- 已加载过的系统监控数据缓存在本地状态
- 切换回已查看过的系统时直接使用缓存数据
- 设置5分钟缓存过期时间

### 3. 懒加载Tab内容
- Tab内容仅在首次激活时加载
- 已加载的Tab内容保持在内存中

### 4. 防抖与节流
- 悬浮展开/收起动画使用防抖，避免频繁触发
- 健康度数据轮询使用节流，限制请求频率

### 5. 按需加载图表库
- 使用动态import加载ECharts等图表库
- 仅在"关键指标"Tab激活时加载

---

## 十、开发任务清单

### 阶段一：基础框架搭建
- [ ] 创建页面组件目录结构
- [ ] 定义TypeScript类型（types.ts）
- [ ] 创建模拟数据（mock/monitoring-data.ts）
- [ ] 搭建主页面布局（index.tsx）
- [ ] 实现基础样式（index.css）

### 阶段二：系统概览区域
- [ ] 实现SystemOverview组件
- [ ] 实现SystemCard组件（双态视图）
- [ ] 实现悬浮展开/收起动画
- [ ] 实现系统选择交互
- [ ] 实现横向滚动
- [ ] 实现健康状态计算逻辑

### 阶段三：详细监控区域
- [ ] 实现MonitoringDetail组件
- [ ] 实现KeyMetrics Tab（关键指标）
- [ ] 实现AlertsTab（运行告警）
- [ ] 实现VulnerabilitiesTab（脆弱性）
- [ ] 实现CallChainTab（调用链）
- [ ] 实现AssetsTab（资产组成）

### 阶段四：交互优化
- [ ] 实现Tab切换动画
- [ ] 实现数据加载状态
- [ ] 实现错误处理
- [ ] 实现响应式适配

### 阶段五：性能优化
- [ ] 实现数据缓存机制
- [ ] 实现虚拟滚动（如需要）
- [ ] 优化动画性能
- [ ] 优化图表渲染

### 阶段六：测试与发布
- [ ] 单元测试
- [ ] 集成测试
- [ ] 浏览器兼容性测试
- [ ] 性能测试
- [ ] 用户验收测试

---

## 十一、技术难点与解决方案

### 难点1：如何实现流畅的双态视图切换？

**问题**：简略视图和卡片视图之间的切换需要同时改变高度、宽度、内容，容易产生卡顿。

**解决方案**：
1. 使用CSS transition而非JavaScript动画
2. 使用GPU加速属性（transform、opacity）
3. 内容切换使用opacity渐变，避免重排
4. 使用will-change提示浏览器优化

```css
.system-card {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: width, height, box-shadow;
}
```

### 难点2：如何处理大量系统时的性能问题？

**问题**：当用户负责几十个系统时，渲染所有卡片会影响性能。

**解决方案**：
1. 使用虚拟滚动库（react-window或react-virtualized）
2. 仅渲染可视区域内的卡片
3. 卡片内容使用React.memo优化

```typescript
import { FixedSizeList } from 'react-window'

const VirtualizedSystemList = () => {
  return (
    <FixedSizeList
      height={200}
      itemCount={systems.length}
      itemSize={isExpanded ? 140 : 50}
      width="100%"
      layout="horizontal"
    >
      {({ index, style }) => (
        <div style={style}>
          <SystemCard system={systems[index]} />
        </div>
      )}
    </FixedSizeList>
  )
}
```

### 难点3：如何实现高效的健康度计算？

**问题**：每个系统的健康度计算涉及多个指标，频繁计算影响性能。

**解决方案**：
1. 使用useMemo缓存计算结果
2. 仅在相关数据变化时重新计算
3. 服务端预计算健康度，前端仅展示

```typescript
const healthData = useMemo(() => {
  return systems.map(system => ({
    ...system,
    healthScore: calculateHealthScore(system),
    healthStatus: getHealthStatus(system)
  }))
}, [systems])
```

---

## 十二、未来扩展方向

### 1. 实时数据推送
- 使用WebSocket实现健康度实时更新
- 新告警实时推送通知
- 脆弱性实时同步

### 2. 自定义视图
- 用户可自定义卡片视图显示的指标
- 支持拖拽排序系统卡片
- 支持折叠/隐藏不关注的系统

### 3. 对比分析
- 支持选择多个系统进行对比
- 健康度趋势对比图表
- 关键指标并排对比

### 4. 智能告警
- 基于历史数据的异常检测
- 告警聚合与关联分析
- 智能告警降噪

### 5. 移动端APP
- 开发原生移动端应用
- 支持推送通知
- 支持离线查看

---

## 附录：设计决策记录

### 决策1：为什么去掉面包屑导航？
**原因**：
- 所有系统在同一视图中切换，无需层级导航
- 减少界面复杂度，提升空间利用率
- 简略视图已提供足够的导航信息

### 决策2：为什么采用悬浮展开而非点击展开？
**原因**：
- 降低操作成本，鼠标移入即可查看详情
- 点击用于系统选择，悬浮用于信息预览，职责清晰
- 符合"渐进式信息展示"的设计原则

### 决策3：为什么健康度采用0-100分制？
**原因**：
- 直观易懂，用户熟悉百分制评分
- 便于量化各类问题的影响程度
- 支持细粒度的健康状态区分

### 决策4：为什么选择横向滚动而非分页？
**原因**：
- 保持所有系统在同一视图中，便于对比
- 横向滚动操作更自然（鼠标滚轮+Shift）
- 避免分页带来的系统查找成本

---

**文档版本**：v1.0
**创建时间**：2025-10-16
**最后更新**：2025-10-16
**设计者**：Claude Code
**审核状态**：待用户确认
