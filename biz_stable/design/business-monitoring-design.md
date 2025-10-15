# 应用监控详情页 - 设计思路文档

## 页面概述

**页面路径**: `/management/business-monitoring`

**页面名称**: 业务运行监测 / 应用监控详情页

**设计版本**: v1.0

**最后更新**: 2025-10-14

## 设计目标

面向业务管理单位，为每个业务应用建立运行监测画像页面。通过应用的关键指标（健康度、访问量、日志量、错误率、响应时间、SLA）、当前问题（运行告警、未处置脆弱性）、资产组成和关系、性能监控分析等信息，全面呈现业务应用的具体运行状态情况。

## 功能架构

### 核心功能模块

1. **应用信息头部** (ApplicationHeader)
   - 应用名称、状态徽章
   - 所属单位、负责人、监测时长
   - 时间范围选择器
   - 应用切换下拉框

2. **KPI指标卡片组** (KPICards)
   - 健康度评分（带趋势）
   - 访问量统计（带趋势）
   - 日志量统计（带趋势）
   - 错误率监控（带趋势）
   - 响应时间监控（带趋势）
   - SLA达成率（带趋势）

3. **脆弱性动态面板** (VulnerabilityPanel)
   - 严重/高危/中危/低危漏洞统计
   - 可展开/收起的详细漏洞列表
   - 支持查看漏洞详情

4. **待处置告警面板** (AlertPanel)
   - 紧急/警告/提醒告警统计
   - 可展开/收起的详细告警列表
   - 告警级别和状态可视化

5. **资产关系拓扑图** (AssetTopology)
   - D3.js力导向图展示
   - 四层资产结构：应用 → 服务 → 中间件 → 服务器
   - 支持拖拽、缩放
   - 节点显示健康状态和指标

6. **性能监控图表组** (PerformanceCharts)
   - CPU使用率时序图
   - 内存使用率时序图
   - 响应时间趋势图
   - 错误率柱状图
   - 吞吐量趋势图
   - 请求数统计图

## 技术实现

### 技术栈

- **前端框架**: React 18 + TypeScript
- **UI组件库**: Ant Design 5.x
- **数据可视化**:
  - D3.js v7 (资产拓扑图)
  - echarts-for-react (性能监控图表)
- **时间处理**: dayjs + relativeTime插件
- **样式方案**: CSS模块化 + 组件级CSS文件

### 组件结构

```
src/pages/management/business-monitoring/
├── index.tsx                      # 主页面组件
├── index.css                      # 页面样式
├── types.ts                       # TypeScript类型定义
└── components/
    ├── ApplicationHeader.tsx      # 应用信息头部
    ├── ApplicationHeader.css
    ├── KPICards.tsx              # KPI指标卡片组
    ├── KPICards.css
    ├── MetricCard.tsx            # 单个指标卡片
    ├── MetricCard.css
    ├── VulnerabilityPanel.tsx    # 脆弱性面板
    ├── VulnerabilityPanel.css
    ├── AlertPanel.tsx            # 告警面板
    ├── AlertPanel.css
    ├── AssetTopology.tsx         # 资产关系拓扑图
    ├── AssetTopology.css
    ├── PerformanceCharts.tsx     # 性能监控图表
    └── PerformanceCharts.css
```

### 数据流设计

#### Mock数据模块

**文件**: `src/mock/business-monitoring-data.ts`

主要导出：
- `mockApplicationInfo`: 应用基本信息
- `mockApplicationKPIs`: KPI指标数据
- `mockVulnerabilitySummary`: 脆弱性统计
- `mockVulnerabilityDetails`: 脆弱性详细列表
- `mockAlertSummary`: 告警统计
- `mockAlertDetails`: 告警详细列表
- `mockAssetTopology`: 资产拓扑数据
- `mockPerformanceMetrics`: 性能监控时序数据
- `mockApplicationMonitoringData`: 完整的应用监控数据

#### 类型定义

**文件**: `src/pages/management/business-monitoring/types.ts`

核心类型：
- `ApplicationInfo`: 应用基本信息
- `KPIMetric`: 单个KPI指标
- `ApplicationKPIs`: 应用KPI指标集合
- `VulnerabilitySummary`: 脆弱性统计
- `VulnerabilityDetail`: 脆弱性详细信息
- `AlertSummary`: 告警统计
- `AlertDetail`: 告警详细信息
- `AssetNode`: 资产节点
- `AssetTopologyData`: 资产拓扑数据
- `PerformanceDataPoint`: 性能数据点
- `PerformanceMetrics`: 性能监控指标
- `ApplicationMonitoringData`: 完整监控数据

## 组件详细设计

### 1. ApplicationHeader - 应用信息头部

**职责**:
- 显示应用基本信息（名称、状态、所属单位、负责人、监测时长）
- 提供时间范围选择功能
- 提供应用切换功能

**Props接口**:
```typescript
interface ApplicationHeaderProps {
  appInfo: ApplicationInfo
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
  onApplicationChange: (appId: string) => void
  availableApps: Array<{ id: string; name: string }>
}
```

**交互特性**:
- 状态徽章根据应用状态显示不同颜色
- 最后更新时间显示相对时间（如"3分钟前"）
- 时间范围支持1小时、6小时、24小时、7天、30天
- 应用切换支持搜索过滤

### 2. MetricCard - 单个指标卡片

**职责**:
- 显示单个KPI指标的数值、单位、趋势
- 展示迷你趋势图（echarts）
- 根据指标状态显示不同的边框颜色

**Props接口**:
```typescript
interface MetricCardProps {
  metric: KPIMetric
}
```

**视觉设计**:
- 顶部彩色边框（good: 绿色, warning: 橙色, danger: 红色）
- 大号数值显示（28px）
- 趋势图标和百分比变化
- 底部迷你折线图（80px高度）

### 3. KPICards - KPI指标卡片组

**职责**:
- 组织6个KPI指标卡片的布局
- 响应式网格布局（xl: 4列, lg: 8列, sm: 12列, xs: 24列）

**Props接口**:
```typescript
interface KPICardsProps {
  kpis: ApplicationKPIs
}
```

### 4. VulnerabilityPanel - 脆弱性面板

**职责**:
- 显示脆弱性统计（严重、高危、中危、低危）
- 提供展开/收起的详细漏洞列表
- 支持查看漏洞详情

**Props接口**:
```typescript
interface VulnerabilityPanelProps {
  summary: VulnerabilitySummary
  details: VulnerabilityDetail[]
}
```

**交互特性**:
- 默认收起状态，可展开查看详细列表
- 表格支持分页（每页5条）
- 漏洞严重程度用不同颜色标签表示
- CVSS评分高亮显示（>=9红色，>=7橙色）

### 5. AlertPanel - 告警面板

**职责**:
- 显示告警统计（紧急、警告、提醒）
- 提供展开/收起的详细告警列表
- 支持查看告警详情

**Props接口**:
```typescript
interface AlertPanelProps {
  summary: AlertSummary
  details: AlertDetail[]
}
```

**交互特性**:
- 默认收起状态，可展开查看详细列表
- 表格支持分页（每页5条）
- 告警行根据级别使用不同背景色
- 显示告警持续时长和相对时间

### 6. AssetTopology - 资产关系拓扑图

**职责**:
- 使用D3.js力导向图展示资产层级关系
- 支持节点拖拽、缩放、平移
- 显示资产健康状态和性能指标

**Props接口**:
```typescript
interface AssetTopologyProps {
  data: AssetTopologyData
}
```

**可视化设计**:
- **节点类型配置**:
  - 应用(application): 蓝色, 60px
  - 服务(service): 绿色, 50px
  - 中间件(middleware): 橙色, 45px
  - 服务器(server): 灰色, 40px

- **健康状态边框**:
  - HEALTHY: 绿色
  - WARNING: 橙色
  - CRITICAL: 红色
  - UNKNOWN: 灰色

- **连线类型**:
  - call: 蓝色实线（调用关系）
  - depend: 灰色虚线（依赖关系）

**交互特性**:
- 节点可拖拽
- 悬停显示详细信息（CPU、内存、响应时间）
- 力导向自动布局
- 右上角图例说明

### 7. PerformanceCharts - 性能监控图表

**职责**:
- 使用echarts展示6个性能监控指标的时序图表
- 支持数据缩放、工具提示

**Props接口**:
```typescript
interface PerformanceChartsProps {
  metrics: PerformanceMetrics
}
```

**图表配置**:

1. **CPU使用率**: 折线+面积图，蓝色，最大值100%，显示平均线
2. **内存使用率**: 折线+面积图，绿色，最大值100%，显示平均线
3. **响应时间**: 折线+面积图，橙色，显示平均线和阈值线（500ms）
4. **错误率**: 柱状图，根据数值动态着色（>1%红色，>0.5%橙色，其他绿色），显示告警阈值（1%）
5. **吞吐量**: 折线+面积图，紫色，单位req/s
6. **请求数**: 柱状图，青色

**响应式布局**:
- 桌面端：2列布局
- 移动端：单列布局
- 每个图表高度：300px

## 页面布局

### 整体布局结构

```
┌─────────────────────────────────────────────────────┐
│ ApplicationHeader (应用信息头部)                        │
├─────────────────────────────────────────────────────┤
│ KPICards (6个KPI指标卡片，横向排列)                      │
├─────────────────────────────────────────────────────┤
│ VulnerabilityPanel (脆弱性动态，可展开/收起)              │
├─────────────────────────────────────────────────────┤
│ AlertPanel (待处置告警，可展开/收起)                      │
├─────────────────────────────────────────────────────┤
│ AssetTopology (资产关系拓扑图，D3.js)                    │
├─────────────────────────────────────────────────────┤
│ PerformanceCharts (6个性能监控图表，2列布局)              │
└─────────────────────────────────────────────────────┘
```

### 响应式设计

**断点设置**:
- xs: <576px (移动端)
- sm: ≥576px (小屏平板)
- md: ≥768px (平板)
- lg: ≥992px (桌面)
- xl: ≥1200px (大屏桌面)

**适配策略**:
- KPI卡片：xl(4列) → lg(3列) → md(2列) → sm(2列) → xs(1列)
- 性能图表：lg以上2列，lg以下单列
- 统计面板：md以上多列，md以下单列
- 拓扑图：移动端隐藏图例
- 表格：自动启用横向滚动

## UI/UX规范遵循

### 颜色系统
- Primary: #1890FF
- Success: #52C41A
- Warning: #FAAD14
- Error: #FF4D4F
- Border: #D9D9D9
- Background: #F0F2F5

### 字体排版
- H3标题: 20px, 600
- 正文: 14px, 400
- 辅助文本: 12px, 400
- 统计数值: 28-32px, 600

### 间距规范
- 页面padding: 24px (桌面), 16px (平板), 12px (移动)
- 卡片间距: 24px
- 组件内部间距: 16px
- 小间距: 8px

### 交互反馈
- 卡片悬停: 阴影加深 + 轻微上移(-2px)
- 按钮交互: 颜色渐变 + 禁用状态处理
- 加载状态: Spin组件 + 提示文字
- 空状态: Empty组件 + 友好提示

## 状态管理

### 本地状态
- `loading`: 页面加载状态
- `data`: 应用监控完整数据
- `timeRange`: 当前选择的时间范围
- `expandedPanel`: 面板展开/收起状态（脆弱性、告警）

### 数据更新策略
- 应用切换: 触发数据重新加载
- 时间范围变更: 触发性能数据刷新
- 手动刷新: 提供刷新按钮
- 自动刷新: 可配置定时刷新间隔

## 性能优化

### 渲染优化
- 使用useMemo缓存图表配置
- 使用React.memo包裹纯展示组件
- 懒加载性能图表（容器可见时再渲染）

### 数据优化
- 图表数据点限制（24个数据点）
- 表格分页加载（每页5-10条）
- 时序数据采样（降低数据密度）

### 交互优化
- D3图表使用SVG渲染器
- echarts图表使用Canvas渲染器
- 节流处理窗口resize事件

## 测试要点

### 功能测试
- [ ] 应用信息正确显示
- [ ] KPI指标计算准确
- [ ] 时间范围切换生效
- [ ] 应用切换加载数据
- [ ] 脆弱性面板展开/收起
- [ ] 告警面板展开/收起
- [ ] 拓扑图节点可拖拽
- [ ] 性能图表正确渲染
- [ ] 表格分页功能正常
- [ ] 响应式布局适配

### 视觉测试
- [ ] 颜色使用符合规范
- [ ] 字体大小层次清晰
- [ ] 间距统一协调
- [ ] 图标使用正确
- [ ] 状态标签颜色准确

### 性能测试
- [ ] 首屏加载时间<2s
- [ ] 图表渲染流畅（>30fps）
- [ ] 大数据量下不卡顿
- [ ] 内存使用合理

## 未来扩展

### 短期优化
- 添加数据导出功能（Excel、PDF）
- 添加告警订阅和通知
- 添加自定义时间范围选择
- 添加指标对比功能

### 长期规划
- 接入真实监控数据源
- 支持自定义KPI配置
- 添加AI异常检测
- 添加智能告警聚合
- 支持多应用对比分析

## 相关文档

- UI/UX规范: `/design/design_document/ant-design-b2b-uiux-spec.md`
- 产品设计文档: `/design/product_document/产品设计文档.md`
- 业务背景: `/biz_info/backgroud.md`

## 变更记录

| 版本 | 日期 | 变更内容 | 作者 |
|-----|------|---------|------|
| v1.0 | 2025-10-14 | 初始版本，完成应用监控详情页全部功能 | Claude |
