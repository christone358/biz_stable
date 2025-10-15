# 业务全景功能实现文档

## 文档说明
本文档记录业务全景页面的实际实现细节，包括布局设计、组件结构、交互逻辑和数据流转。

**最后更新时间**: 2025-10-15
**开发状态**: 已完成
**对应页面**: `/src/pages/business-panorama/`
**路由路径**: `/management/business-panorama`

---

## 1. 功能概述

业务全景是系统的首页和核心监控页面，提供组织业务的全局视图和实时监控能力。

### 1.1 核心功能

1. **组织架构导航**: 左侧树形结构展示业务板块和系统层级
2. **KPI指标展示**: 顶部卡片展示关键业务指标
3. **健康状态矩阵图**: D3.js可视化展示业务系统健康状态
4. **蜂窝图资产视图**: 点击系统后展示系统内部资产健康状态
5. **系统详情面板**: 右侧动态面板展示选中节点的详细信息
6. **告警监控面板**: 底部面板展示三类告警（运行、脆弱性、安全）

### 1.2 页面特点

- **三面板布局**: 左侧导航 + 中间内容 + 底部告警
- **四级层次结构**: 根节点 → 业务板块 → 业务系统 → 资产节点
- **双图表切换**: 矩阵图（系统级） ↔ 蜂窝图（资产级）
- **实时响应**: Redux状态管理，支持实时数据更新

---

## 2. 整体布局

### 2.1 布局结构

```
┌─────────────────────────────────────────────────────────────────┐
│                         顶部 KPI 指标卡片                          │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  │
│  │总资产│  │健康 │  │警告 │  │故障 │  │告警 │  │脆弱性│  │响应  │  │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  │
└─────────────────────────────────────────────────────────────────┘

┌──────────┬─────────────────────────────────────┬────────────────┐
│          │                                     │                │
│  业务    │                                     │    系统        │
│  板块    │       健康状态矩阵图 / 蜂窝图          │    详情        │
│  树      │                                     │    面板        │
│  (380px)│                                     │   (380px)      │
│          │                                     │                │
│  ┌─────┐│                                     │  [选中节点]   │
│  │根节点││         D3.js 可视化区域             │  • 系统信息   │
│  ├─────┤│                                     │  • 资产列表   │
│  │板块1 ││                                     │  • 统计数据   │
│  │├系统1││                                     │  • 告警脆弱性 │
│  │├系统2││                                     │                │
│  │板块2 ││                                     │                │
│  │...   ││                                     │                │
│  └─────┘│                                     │                │
│          │                                     │                │
└──────────┴─────────────────────────────────────┴────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       底部告警监控面板                              │
│  ┌────────────┬──────────────┬──────────────────┐                │
│  │ 运行告警   │  脆弱性      │   安全事件        │                │
│  └────────────┴──────────────┴──────────────────┘                │
│  [告警列表 - 根据左侧树选择自动筛选]                                │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 组件层级结构

```
BusinessPanorama/
├── OrganizationTree (左侧树)
│   ├── 根节点 (root)
│   ├── 业务板块节点 (department)
│   ├── 业务系统节点 (system)
│   └── 资产节点 (asset) [隐藏]
├── KPICards (顶部指标)
│   ├── 总资产数
│   ├── 健康系统数
│   ├── 警告系统数
│   ├── 故障系统数
│   ├── 未处理告警
│   ├── 高危脆弱性
│   └── 平均响应时间
├── HealthMatrix (中间矩阵图/蜂窝图)
│   ├── 矩阵图模式 (气泡图)
│   └── 蜂窝图模式 (六边形)
├── SystemDetail (右侧详情)
│   ├── 系统概览列表 (根节点)
│   ├── 板块系统列表 (板块节点)
│   ├── 系统详情 (系统节点)
│   └── 资产详情 (资产节点)
└── AlertPanel (底部告警)
    ├── 运行告警标签页
    ├── 脆弱性标签页
    └── 安全事件标签页
```

---

## 3. 左侧组织架构树实现

### 3.1 OrganizationTree 组件

**文件**: `src/components/dashboard/OrganizationTree/index.tsx`

**功能**: 展示四级业务层次结构，支持懒加载和交互选择

#### 3.1.1 Props接口

```typescript
interface OrganizationTreeProps {
  title?: string
  showHeader?: boolean  // 是否显示标题栏
  generateSystemsFunction?: (orgId?: string) => any[]
  generateSystemsForNodeFunction?: (nodeId: string) => OrganizationNode[]
  getAssetsForNodeFunction?: (nodeId: string) => any[]
  labelConfig?: {
    rootChildren?: string  // 根节点的子节点标签，如"部门"或"板块"
  }
}
```

#### 3.1.2 节点类型定义

```typescript
type OrganizationNodeType = 'root' | 'department' | 'system' | 'asset'

interface OrganizationNode {
  id: string
  name: string
  type: OrganizationNodeType
  healthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'UNKNOWN'
  systemCount?: number      // 包含的系统数量
  assetCount?: number       // 包含的资产数量
  children?: OrganizationNode[]
  isExpanded?: boolean
  parentId?: string
}
```

#### 3.1.3 四级层次交互逻辑

**根节点 (root) 点击:**
```typescript
if (node.type === 'root') {
  // 1. 生成全部系统数据
  const allSystems = generateSystemsFunction('ROOT')
  dispatch(setSystems(allSystems))

  // 2. 清空资产数据，显示矩阵图
  dispatch(setFilteredAssets([]))
  dispatch(setSelectedDepartmentId(null))
  dispatch(setSelectedAssetId(null))

  // 3. 右侧显示：所有系统概览列表
}
```

**板块节点 (department) 点击:**
```typescript
if (node.type === 'department') {
  // 1. 筛选该板块的系统
  const departmentSystems = generateSystemsFunction(node.id)
  dispatch(setSystems(departmentSystems))

  // 2. 清空资产数据，显示矩阵图
  dispatch(setFilteredAssets([]))
  dispatch(setSelectedDepartmentId(node.id))

  // 3. 右侧显示：板块系统列表（支持卡片/列表切换）
}
```

**系统节点 (system) 点击:**
```typescript
if (node.type === 'system') {
  // 1. 查找系统数据
  let currentSystem = systems.find(sys => sys.id === node.id)

  // 2. 获取系统资产
  const systemAssets = currentSystem?.assets || []
  dispatch(setFilteredAssets(systemAssets))

  // 3. 切换到蜂窝图，展示系统内部资产
  // 4. 右侧显示：系统详情信息
}
```

**资产节点 (asset) 点击:**
```typescript
if (node.type === 'asset') {
  // 1. 查找单个资产
  const singleAsset = getAllAssets().find(asset => asset.id === node.id)
  dispatch(setFilteredAssets(singleAsset ? [singleAsset] : []))

  // 2. 蜂窝图高亮该资产
  // 3. 右侧显示：资产详细信息（带面包屑）
}
```

#### 3.1.4 懒加载实现

**板块节点展开时懒加载系统列表:**
```typescript
const handleExpandClick = async (node: OrganizationNode, event: React.MouseEvent) => {
  event.stopPropagation()

  if (node.type === 'department' && !node.children) {
    // 第一次展开部门，只加载业务系统（不包含具体资产）
    const systemNodes = generateSystemsForNodeFunction(node.id).map(system => ({
      ...system,
      children: undefined // 不显示资产节点
    }))
    dispatch(expandOrganizationNode({ nodeId: node.id, children: systemNodes }))
  } else if (node.type === 'system') {
    // 系统节点不展开，点击直接筛选该系统的资产
    return
  } else {
    // 切换展开/折叠状态
    dispatch(toggleOrganizationExpand(node.id))
  }
}
```

#### 3.1.5 节点渲染逻辑

**根节点和板块节点**: 竖直布局，统计信息换行
```typescript
{(node.type === 'root' || node.type === 'department') && (
  <>
    <div className="node-main-row">
      <div className="node-left-section">
        <span className="expand-icon" onClick={(e) => handleExpandClick(node, e)}>
          {getExpandIcon(node)}
        </span>
        <span className="node-icon">{getNodeIcon(node)}</span>
        <div className={getHealthStatusClass(node.healthStatus)}></div>
        <span className="node-name">{node.name}</span>
      </div>
    </div>
    <div className="node-multiline-stats">
      <span className="stat-item">
        <span className="stat-label">系统:</span>
        <span className="stat-value">{node.systemCount}</span>
      </span>
      <span className="stat-item">
        <span className="stat-label">资产:</span>
        <span className="stat-value">{node.assetCount}</span>
      </span>
    </div>
  </>
)}
```

**系统和资产节点**: 水平布局，统计信息在右侧
```typescript
{(node.type === 'system' || node.type === 'asset') && (
  <>
    <span className="expand-icon" onClick={(e) => handleExpandClick(node, e)}>
      {getExpandIcon(node)}
    </span>
    <span className="node-icon">{getNodeIcon(node)}</span>
    <div className={getHealthStatusClass(node.healthStatus)}></div>
    <span className="node-name">{node.name}</span>
    <div className="node-stats">
      <span className="stat-item">
        <span className="stat-label">资产:</span>
        <span className="stat-value">{node.assetCount}</span>
      </span>
    </div>
  </>
)}
```

---

## 4. 中间健康状态矩阵图实现

### 4.1 HealthMatrix 组件

**文件**: `src/components/dashboard/HealthMatrix/index.tsx`

**功能**: 根据选择状态动态切换矩阵图或蜂窝图

#### 4.1.1 双模式渲染逻辑

```typescript
useEffect(() => {
  let cleanup: (() => void) | undefined

  // 根据选择的组织类型决定渲染哪种图表
  // 只有选择了具体系统(system类型),才显示蜂窝图(展示系统内部资产)
  // 其他情况(root/department)都显示矩阵图(展示应用系统)
  if (selectedOrganization?.type === 'system' && filteredAssets.length > 0) {
    console.log('✅ 渲染蜂窝图 - 展示系统内部资产')
    cleanup = renderHoneycombChart()
  } else {
    console.log('📊 渲染矩阵图 - 展示应用系统')
    cleanup = renderChart()
  }

  return () => {
    if (cleanup) cleanup()
  }
}, [systems, selectedOrganization, filteredAssets])
```

#### 4.1.2 矩阵图实现 (renderChart)

**矩阵图特点:**
- X轴: 委办单位（部门）
- Y轴: 重要性等级 (CRITICAL / HIGH / MEDIUM / LOW)
- 气泡大小: 代表资产数量
- 气泡颜色: 代表健康状态 (绿色/黄色/红色/灰色)

**关键代码:**
```typescript
const renderChart = () => {
  if (!systems.length || !svgRef.current) return

  const svg = d3.select(svgRef.current)
  svg.selectAll('*').remove()

  // 设置容器尺寸
  const containerWidth = svgRef.current.parentElement?.clientWidth || 800
  const containerHeight = 500
  const margin = { top: 60, right: 80, bottom: 80, left: 100 }
  const width = containerWidth - margin.left - margin.right
  const height = containerHeight - margin.bottom - margin.top

  // 创建比例尺
  const departments = Array.from(new Set(systems.map(s => s.department))).sort()
  const importanceOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

  const xScale = d3.scaleBand()
    .domain(departments)
    .range([0, width])
    .padding(0.1)

  const yScale = d3.scaleBand()
    .domain(importanceOrder)
    .range([height, 0])
    .padding(0.1)

  const radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(systems, d => d.assetCount) || 100])
    .range([8, 30])

  // 绘制气泡
  g.selectAll('.system-bubble')
    .data(bubbleData)
    .enter()
    .append('circle')
    .attr('class', 'system-bubble')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.radius)
    .style('fill', d => d.color)
    .style('cursor', 'pointer')
    .on('click', function(_, d) {
      // 点击气泡下钻到系统，显示蜂窝图
      const systemNode = {
        id: d.id,
        name: d.name,
        type: 'system' as const,
        parentId: selectedOrganization?.id,
        children: []
      }
      dispatch(setSelectedOrganization(systemNode))

      // 获取系统资产并切换到蜂窝图
      const systemAssets = getAllAssets().filter(asset => asset.systemId === d.id)
      dispatch(setFilteredAssets(systemAssets))
      dispatch(setSelectedAssetId(null))
    })
}
```

**重叠气泡处理:**
```typescript
// 按部门和重要性分组统计系统数量
const departmentImportanceGroups = new Map<string, any[]>()
systems.forEach(system => {
  const key = `${system.department}-${system.importance}`
  if (!departmentImportanceGroups.has(key)) {
    departmentImportanceGroups.set(key, [])
  }
  departmentImportanceGroups.get(key)!.push(system)
})

// 如果有多个系统在同一位置，水平展开
if (totalSystems > 1) {
  const spreadWidth = Math.min(xScale.bandwidth() * 0.8, totalSystems * 40)
  const systemSpacing = spreadWidth / (totalSystems - 1)
  jitterX = (systemIndex - (totalSystems - 1) / 2) * systemSpacing
  jitterY = (Math.random() - 0.5) * 10
}
```

#### 4.1.3 蜂窝图实现 (renderHoneycombChart)

**蜂窝图特点:**
- 三列布局: 基础设施 | 中间件 | 应用服务
- 六边形形状: 更紧凑的空间利用
- 支持缩放平移: d3.zoom() 交互
- 选中高亮: 蓝色边框 + 阴影效果

**关键代码:**
```typescript
const renderHoneycombChart = () => {
  if (!filteredAssets.length || !svgRef.current) return

  const svg = d3.select(svgRef.current)
  svg.selectAll('*').remove()

  // 按资产类型分组
  const assetGroups = {
    infrastructure: filteredAssets.filter(asset =>
      ['服务器', '数据库', '网络设备', '存储设备', '安全设备'].includes(asset.type)
    ),
    middleware: filteredAssets.filter(asset => ['中间件'].includes(asset.type)),
    application: filteredAssets.filter(asset => ['应用服务'].includes(asset.type))
  }

  // 创建可缩放容器
  const zoomableContainer = svg
    .append('g')
    .attr('class', 'zoomable-honeycomb-container')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // 添加缩放功能
  const zoom = d3.zoom()
    .scaleExtent([0.5, 3])
    .on('zoom', (event) => {
      zoomableContainer.attr('transform',
        `translate(${margin.left},${margin.top}) ${event.transform}`)
    })

  svg.call(zoom as any)

  // 渲染六边形
  Object.entries(assetGroups).forEach(([_, assets], groupIndex) => {
    const baseX = sectionWidth * (groupIndex + 0.5)
    const cols = Math.ceil(Math.sqrt(assets.length))
    const rows = Math.ceil(assets.length / cols)

    assets.forEach((asset, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)

      // 计算六边形位置（蜂窝偏移）
      const x = baseX + (col - (cols - 1) / 2) * hexSpacing * 0.75
      const y = 40 + (row - (rows - 1) / 2) * hexSpacing + (col % 2) * hexSpacing * 0.5

      // 绘制六边形
      const hexagonPath = zoomableContainer.append('path')
        .attr('d', generateHexagon(x, y, hexRadius))
        .style('fill', colorScale[asset.healthStatus])
        .style('stroke', selectedAssetId === asset.id ? '#1677FF' : '#fff')
        .style('stroke-width', selectedAssetId === asset.id ? 4 : 2)
        .style('cursor', 'pointer')
        .on('click', function() {
          dispatch(setSelectedAssetId(asset.id))
        })
    })
  })
}
```

**六边形路径生成:**
```typescript
const generateHexagon = (x: number, y: number, radius: number) => {
  const points = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    const px = x + radius * Math.cos(angle)
    const py = y + radius * Math.sin(angle)
    points.push([px, py])
  }
  return `M${points.map(p => p.join(',')).join('L')}Z`
}
```

---

## 5. 右侧系统详情面板实现

### 5.1 SystemDetail 组件

**文件**: `src/components/dashboard/SystemDetail/index.tsx`

**功能**: 根据左侧选择动态显示4种不同内容

#### 5.1.1 动态内容判断逻辑

```typescript
const displayContent = useMemo(() => {
  // 优先检查蜂窝图资产选择
  if (selectedAssetId && filteredAssets.length > 0) {
    const selectedAsset = filteredAssets.find(asset => asset.id === selectedAssetId)
    if (selectedAsset) {
      return { type: 'assetDetail', data: selectedAsset }
    }
  }

  if (!selectedOrganization) {
    return { type: 'empty', data: null }
  }

  // 根据组织节点类型决定显示内容
  switch (selectedOrganization.type) {
    case 'root':
      return { type: 'systemsList', data: generateMockSystems() }
    case 'department':
      return { type: 'departmentSystems', data: departmentSystems }
    case 'system':
      return { type: 'systemDetail', data: systemDetail }
    default:
      return { type: 'empty', data: null }
  }
}, [selectedOrganization, filteredAssets, selectedAssetId])
```

#### 5.1.2 四种显示模式

**模式1: 系统概览列表 (root选择)**
```typescript
// 显示所有系统的列表，按健康状态分组
<List
  dataSource={allSystems}
  renderItem={(system) => (
    <List.Item onClick={() => handleSystemClick(system)}>
      <List.Item.Meta
        avatar={<Badge status={getStatusType(system.healthStatus)} />}
        title={system.name}
        description={`${system.department} | ${system.assetCount}个资产`}
      />
    </List.Item>
  )}
/>
```

**模式2: 板块系统列表 (department选择)**
```typescript
// 支持卡片/列表视图切换
<div className="view-switcher">
  <Button.Group>
    <Button
      type={viewMode === 'list' ? 'primary' : 'default'}
      icon={<UnorderedListOutlined />}
      onClick={() => setViewMode('list')}
    />
    <Button
      type={viewMode === 'card' ? 'primary' : 'default'}
      icon={<AppstoreOutlined />}
      onClick={() => setViewMode('card')}
    />
  </Button.Group>
</div>

{viewMode === 'card' ? (
  <Row gutter={[16, 16]}>
    {departmentSystems.map(system => (
      <Col span={24}>
        <Card onClick={() => handleSystemClick(system)}>
          {/* 系统卡片内容 */}
        </Card>
      </Col>
    ))}
  </Row>
) : (
  <List dataSource={departmentSystems} renderItem={...} />
)}
```

**模式3: 系统详情 (system选择)**
```typescript
// 显示系统详细信息和资产列表
<Descriptions title="系统信息" column={2} bordered>
  <Descriptions.Item label="系统名称">{systemDetail.name}</Descriptions.Item>
  <Descriptions.Item label="归属单位">{systemDetail.department}</Descriptions.Item>
  <Descriptions.Item label="重要性">{systemDetail.importance}</Descriptions.Item>
  <Descriptions.Item label="健康状态">
    <Tag color={getStatusColor(systemDetail.healthStatus)}>
      {systemDetail.healthStatus}
    </Tag>
  </Descriptions.Item>
  <Descriptions.Item label="资产数量">{systemDetail.assetCount}</Descriptions.Item>
  <Descriptions.Item label="告警数量">{systemDetail.alertCount}</Descriptions.Item>
</Descriptions>

<Divider />

<h4>资产列表</h4>
<List
  dataSource={systemDetail.assets}
  renderItem={(asset) => (
    <List.Item onClick={() => handleAssetClick(asset)}>
      {/* 资产项内容 */}
    </List.Item>
  )}
/>
```

**模式4: 资产详情 (asset选择)**
```typescript
// 显示资产详细信息，带面包屑导航
<Breadcrumb>
  <Breadcrumb.Item>
    <a onClick={handleBackToDepartment}>{department}</a>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <a onClick={handleBackToSystem}>{system}</a>
  </Breadcrumb.Item>
  <Breadcrumb.Item>{asset.name}</Breadcrumb.Item>
</Breadcrumb>

<Descriptions title="资产信息" column={2} bordered>
  <Descriptions.Item label="资产名称">{asset.name}</Descriptions.Item>
  <Descriptions.Item label="资产类型">{asset.type}</Descriptions.Item>
  <Descriptions.Item label="IP地址">{asset.ipAddress}</Descriptions.Item>
  <Descriptions.Item label="健康状态">
    <Badge status={getStatusType(asset.healthStatus)} text={asset.healthStatus} />
  </Descriptions.Item>
  <Descriptions.Item label="错误率">{asset.errorRate.toFixed(2)}%</Descriptions.Item>
  <Descriptions.Item label="响应时间">{asset.responseTime}ms</Descriptions.Item>
  <Descriptions.Item label="可用性">{asset.availability.toFixed(1)}%</Descriptions.Item>
  <Descriptions.Item label="CPU使用率">{asset.cpuUsage.toFixed(1)}%</Descriptions.Item>
  <Descriptions.Item label="内存使用率">{asset.memoryUsage.toFixed(1)}%</Descriptions.Item>
</Descriptions>
```

---

## 6. Redux状态管理

### 6.1 状态定义

**文件**: `src/store/slices/dashboardSlice.ts`

```typescript
interface DashboardState {
  organizations: OrganizationNode[]        // 组织架构树数据
  selectedOrganization: OrganizationNode | null  // 当前选中的树节点
  selectedAssetId: string | null           // 蜂窝图选中的资产ID
  selectedDepartmentId: string | null      // 选中的部门ID
  filteredAssets: Asset[]                  // 根据当前选择筛选的资产
  systems: BusinessSystem[]                // 业务系统数据
  metrics: DashboardMetrics | null         // KPI指标数据
  loading: boolean
}
```

### 6.2 核心Actions

```typescript
// 设置组织架构数据
setOrganizations(state, action: PayloadAction<OrganizationNode[]>)

// 设置选中的组织节点
setSelectedOrganization(state, action: PayloadAction<OrganizationNode | null>)

// 设置系统数据
setSystems(state, action: PayloadAction<BusinessSystem[]>)

// 设置筛选后的资产数据
setFilteredAssets(state, action: PayloadAction<Asset[]>)

// 设置选中的资产ID
setSelectedAssetId(state, action: PayloadAction<string | null>)

// 设置选中的部门ID
setSelectedDepartmentId(state, action: PayloadAction<string | null>)

// 展开组织节点（懒加载）
expandOrganizationNode(state, action: PayloadAction<{
  nodeId: string
  children: OrganizationNode[]
}>)

// 切换节点展开状态
toggleOrganizationExpand(state, action: PayloadAction<string>)

// 设置KPI指标
setMetrics(state, action: PayloadAction<DashboardMetrics>)
```

### 6.3 数据流转

```
用户交互
    ↓
树节点点击 → dispatch(setSelectedOrganization)
    ↓
根据节点类型:
  • root: setSystems(全部) + setFilteredAssets([])
  • department: setSystems(部门) + setFilteredAssets([])
  • system: setFilteredAssets(系统资产)
  • asset: setSelectedAssetId(资产ID)
    ↓
组件响应 useSelector 监听:
  • HealthMatrix: 重新渲染图表
  • SystemDetail: 切换显示内容
  • AlertPanel: 筛选告警数据
    ↓
界面更新
```

---

## 7. 样式实现

### 7.1 主布局样式

**文件**: `src/pages/business-panorama/index.css`

```css
.dashboard-layout {
  height: 100vh;
  background: var(--background-layout);
  display: flex;
  flex-direction: column;
}

.dashboard-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.dashboard-sider {
  width: 380px;
  background: #fafafa;
  border-right: 1px solid var(--border-color);
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  padding: var(--space-lg);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.middle-section {
  display: flex;
  gap: var(--space-lg);
  flex: 1;
  margin-bottom: var(--space-lg);
}

.matrix-section {
  flex: 1;
  background: var(--background-base);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.detail-panel {
  width: 380px;
  background: var(--background-base);
  flex-shrink: 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
```

### 7.2 响应式设计

```css
@media (max-width: 1400px) {
  .dashboard-sider {
    width: 340px;
  }
}

@media (max-width: 1200px) {
  .dashboard-sider {
    width: 320px;
  }

  .detail-panel {
    width: 320px;
  }
}

@media (max-width: 900px) {
  .dashboard-body {
    flex-direction: column;
  }

  .dashboard-sider {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .middle-section {
    flex-direction: column;
  }

  .detail-panel {
    width: 100%;
  }
}
```

---

## 8. 交互流程

### 8.1 系统下钻流程

```
1. 用户点击左侧树根节点
   ↓
2. 矩阵图显示所有系统气泡
   ↓
3. 用户点击气泡（某个系统）
   ↓
4. 切换到蜂窝图模式
   ↓
5. 显示该系统的所有资产（按类型分三列）
   ↓
6. 右侧详情面板显示系统信息
   ↓
7. 用户点击六边形资产
   ↓
8. 右侧切换为资产详情（带面包屑）
```

### 8.2 面包屑导航返回流程

```
资产详情 → 点击面包屑"系统名"
    ↓
dispatch(setSelectedAssetId(null))
    ↓
保持蜂窝图，右侧回到系统详情
    ↓
点击面包屑"部门名"
    ↓
dispatch(setFilteredAssets([]))
dispatch(setSelectedOrganization(部门节点))
    ↓
矩阵图显示部门系统，右侧显示部门列表
```

---

## 9. 数据Mock策略

### 9.1 数据生成函数

**文件**: `src/mock/data.ts`

**核心函数:**
```typescript
// 生成业务板块数据
export const mockBusinessDomains: OrganizationNode[]

// 生成板块下的业务系统
export const generateSystemsForBusinessDomain = (domainId: string): OrganizationNode[]

// 生成业务系统列表（用于矩阵图）
export const generateBusinessDomainSystems = (): BusinessSystem[]

// 获取板块的资产数据
export const getAssetsForBusinessDomain = (domainId: string): Asset[]

// 生成KPI指标数据
export const mockMetrics: DashboardMetrics
```

### 9.2 数据结构示例

**业务板块树:**
```typescript
const mockBusinessDomains = [
  {
    id: 'root',
    name: '上海市"一网通办"',
    type: 'root',
    healthStatus: 'WARNING',
    systemCount: 42,
    assetCount: 356,
    children: [],
    isExpanded: true
  }
]
```

**业务系统数据:**
```typescript
interface BusinessSystem {
  id: string
  name: string
  department: string          // 归属部门
  importance: ImportanceLevel // 重要性: CRITICAL/HIGH/MEDIUM/LOW
  healthStatus: HealthStatus  // 健康状态: HEALTHY/WARNING/CRITICAL/UNKNOWN
  assetCount: number
  errorRate: number
  responseTime: number
  availability: number
  alertCount: number
  vulnerabilityCount: number
  assets: Asset[]
}
```

---

## 10. 性能优化

### 10.1 React优化

```typescript
// 使用 useMemo 缓存计算结果
const displayContent = useMemo(() => {
  // 复杂的内容判断逻辑
}, [selectedOrganization, filteredAssets, selectedAssetId])

// 使用 useCallback 缓存事件处理函数
const handleNodeClick = useCallback((node: OrganizationNode, event: React.MouseEvent) => {
  // 节点点击逻辑
}, [dispatch])

// 使用 React.memo 防止不必要的重新渲染
export default React.memo(HealthMatrix)
```

### 10.2 D3.js优化

```typescript
// 清理旧的SVG元素，避免内存泄漏
useEffect(() => {
  const cleanup = renderChart()

  return () => {
    // 清理工具提示和事件监听器
    d3.selectAll('.matrix-tooltip').remove()
    if (cleanup) cleanup()
  }
}, [dependencies])

// 窗口大小变化防抖
const handleResize = debounce(() => {
  if (selectedOrganization?.type === 'system') {
    renderHoneycombChart()
  } else {
    renderChart()
  }
}, 100)

window.addEventListener('resize', handleResize)
```

### 10.3 懒加载优化

- 树节点只在展开时加载子节点
- 系统资产数据只在点击系统时加载
- 告警数据按需筛选，不预加载全量数据

---

## 11. 关键技术决策

### 11.1 为什么使用双图表模式？

**决策**: 矩阵图（系统级） + 蜂窝图（资产级）

**原因**:
1. **信息层次清晰**: 矩阵图适合显示大量系统的分布，蜂窝图适合显示密集资产
2. **空间利用率**: 六边形蜂窝结构比圆形更紧凑，可以展示更多资产
3. **视觉区分**: 不同的可视化形式帮助用户理解当前所在的层级

### 11.2 为什么使用四级层次结构？

**决策**: 根 → 板块 → 系统 → 资产

**原因**:
1. **业务对齐**: 符合"一网通办"实际的组织架构
2. **粒度控制**: 支持不同层级的监控和下钻分析
3. **性能平衡**: 懒加载策略避免一次性加载过多数据

### 11.3 为什么右侧面板动态切换内容？

**决策**: 一个面板支持4种显示模式

**原因**:
1. **空间效率**: 避免多个面板同时占用空间
2. **上下文保持**: 始终显示与当前选择相关的信息
3. **开发维护**: 统一的容器，易于扩展和维护

---

## 12. 测试检查清单

### 12.1 功能测试

- [x] 树节点点击正确触发状态变化
- [x] 根节点显示所有系统矩阵图
- [x] 板块节点显示部门系统矩阵图
- [x] 系统节点切换到蜂窝图
- [x] 蜂窝图资产点击高亮选中
- [x] 右侧面板4种模式正确切换
- [x] 面包屑导航返回功能正常
- [x] 矩阵图气泡点击下钻到蜂窝图
- [x] 蜂窝图支持缩放和平移
- [x] KPI指标卡片数据正确

### 12.2 交互测试

- [x] 树节点懒加载正常
- [x] 树节点展开/折叠动画流畅
- [x] 矩阵图气泡悬停工具提示显示
- [x] 蜂窝图六边形悬停效果正常
- [x] 选中状态视觉反馈明显
- [x] 告警面板根据选择自动筛选
- [x] 卡片/列表视图切换正常

### 12.3 性能测试

- [x] 大量系统（100+）矩阵图渲染流畅
- [x] 大量资产（200+）蜂窝图渲染流畅
- [x] 窗口缩放响应及时
- [x] 内存泄漏检查（D3元素清理）
- [x] Redux状态更新不卡顿

---

## 13. 文件清单

### 13.1 页面文件

```
src/pages/business-panorama/
├── index.tsx          # 主页面组件
└── index.css          # 页面样式
```

### 13.2 组件文件

```
src/components/dashboard/
├── OrganizationTree/
│   ├── index.tsx      # 组织架构树组件
│   └── index.css      # 树样式
├── KPICards/
│   ├── index.tsx      # KPI指标卡片
│   └── index.css
├── HealthMatrix/
│   ├── index.tsx      # 健康矩阵图组件（含蜂窝图）
│   └── index.css
├── SystemDetail/
│   ├── index.tsx      # 系统详情面板
│   └── index.css
└── AlertPanel/
    ├── index.tsx      # 告警面板
    └── index.css
```

### 13.3 状态管理文件

```
src/store/slices/
└── dashboardSlice.ts  # Dashboard Redux状态
```

### 13.4 Mock数据文件

```
src/mock/
└── data.ts            # 业务全景Mock数据生成器
```

---

## 14. 后续优化方向

### 14.1 功能增强

1. **实时数据更新**: WebSocket推送实时健康状态变化
2. **历史趋势分析**: 时间轴展示健康状态变化趋势
3. **自定义仪表板**: 用户自定义KPI指标和布局
4. **告警联动**: 点击气泡直接跳转到相关告警

### 14.2 性能优化

1. **虚拟滚动**: 树节点和列表使用虚拟滚动
2. **Web Worker**: 大量数据计算移到Worker线程
3. **Canvas渲染**: 超大规模数据使用Canvas替代SVG
4. **数据分页**: 矩阵图数据分页加载

### 14.3 用户体验

1. **引导教程**: 首次使用时的交互引导
2. **快捷键**: 支持键盘快捷导航
3. **主题切换**: 支持深色模式
4. **导出报告**: 一键导出健康状态报告

---

## 15. 注意事项

### 15.1 开发注意事项

1. **状态清理**: 切换节点类型时必须清除无关状态（selectedAssetId等）
2. **D3清理**: 组件卸载时必须清理D3创建的DOM元素和事件监听器
3. **懒加载时机**: 板块节点首次展开时才加载系统列表
4. **类型安全**: 所有组件必须定义完整的TypeScript类型

### 15.2 维护注意事项

1. **数据结构一致性**: Mock数据结构必须与TypeScript类型定义一致
2. **Redux状态同步**: 确保所有组件通过Redux通信，不使用props传递复杂状态
3. **样式命名规范**: 遵循BEM命名约定，保持样式可维护性
4. **文档同步**: 功能变更后及时更新本文档

---

**文档版本**: v1.0
**最后更新**: 2025-10-15
**维护者**: Claude Code Assistant
