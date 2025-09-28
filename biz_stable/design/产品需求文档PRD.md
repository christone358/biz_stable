# 业务稳定性监控系统 - 产品需求文档 (PRD)

## 文档信息
- **产品名称**: 业务稳定性监控系统 (Business Stability Monitoring System)
- **版本**: v2.1.0
- **创建日期**: 2025-09-28
- **更新日期**: 2025-09-28
- **文档状态**: 已实现
- **目标受众**: 前端开发工程师、后端开发工程师、测试工程师、产品经理

## 📋 目录
1. [产品概述](#产品概述)
2. [用户分析](#用户分析)
3. [功能需求](#功能需求)
4. [技术需求](#技术需求)
5. [界面设计需求](#界面设计需求)
6. [性能需求](#性能需求)
7. [安全需求](#安全需求)
8. [开发规范](#开发规范)
9. [测试需求](#测试需求)
10. [部署需求](#部署需求)
11. [验收标准](#验收标准)

## 产品概述

### 1.1 产品背景
政府部门需要对各业务系统的IT基础设施进行统一监控和管理，确保业务连续性和数据安全。现有监控系统存在以下痛点：
- 数据分散，缺乏统一视图
- 告警信息混乱，无法快速定位问题
- 缺乏层次化的组织结构管理
- 界面复杂，操作效率低

### 1.2 产品定位
面向政府部门IT管理人员的一站式业务稳定性监控平台，提供：
- 四级层次化监控（根节点→部门→系统→资产）
- 实时健康状态可视化
- 智能告警分类和处理
- 直观的数据钻取和导航

### 1.3 产品价值
- **提升监控效率**: 统一界面展示所有监控数据，减少切换成本
- **快速故障定位**: 层次化导航和智能分类，快速锁定问题根源
- **降低运维成本**: 自动化告警处理流程，减少人工干预
- **增强决策支持**: 丰富的可视化图表和统计指标

### 1.4 成功指标
- 故障发现时间缩短50%
- 故障处理效率提升30%
- 用户操作步骤减少60%
- 系统可用性达到99.9%

## 用户分析

### 2.1 目标用户
| 用户角色 | 占比 | 主要职责 | 使用场景 |
|---------|------|---------|---------|
| **IT运维管理员** | 40% | 系统监控、故障处理 | 日常监控、故障响应、性能优化 |
| **部门IT负责人** | 30% | 部门系统管理、资源规划 | 部门系统概览、资源使用情况 |
| **安全管理员** | 20% | 安全监控、漏洞管理 | 安全事件处理、漏洞修复跟踪 |
| **领导决策层** | 10% | 整体态势掌握、决策支持 | 高层次统计数据、趋势分析 |

### 2.2 用户故事 (User Stories)

#### 2.2.1 IT运维管理员
```
作为一名IT运维管理员
我希望能够在一个界面看到所有系统的健康状态
以便快速识别和处理异常情况

验收标准：
- 能在30秒内完成全局系统状态检查
- 异常系统能在界面上明显标识
- 能一键钻取到具体异常资产
```

#### 2.2.2 部门IT负责人
```
作为一名部门IT负责人
我希望能够查看本部门的系统和资产状况
以便合理规划资源和预算

验收标准：
- 可按部门筛选查看相关系统
- 提供部门级别的统计数据
- 支持导出部门报告数据
```

#### 2.2.3 安全管理员
```
作为一名安全管理员
我希望能够监控所有安全相关的告警和漏洞
以便及时响应安全威胁

验收标准：
- 安全告警能够独立分类展示
- 漏洞信息包含详细的修复建议
- 支持告警确认和处理流程
```

### 2.3 用户需求优先级
| 需求类别 | 优先级 | 具体需求 |
|---------|--------|---------|
| **核心功能** | P0 | 组织架构展示、健康状态监控、告警管理 |
| **重要功能** | P1 | 数据钻取、面包屑导航、实时刷新 |
| **增强功能** | P2 | 趋势分析、导出报告、个性化配置 |
| **附加功能** | P3 | 移动端适配、暗黑模式、多语言支持 |

## 功能需求

### 3.1 功能架构图
```
业务稳定性监控系统
├── 组织架构管理
│   ├── 四级层次展示
│   ├── 动态加载子节点
│   └── 健康状态聚合
├── 数据可视化
│   ├── KPI指标卡片
│   ├── 健康矩阵图
│   └── 趋势图表
├── 系统详情展示
│   ├── 四种显示模式
│   ├── 视图切换
│   └── 面包屑导航
├── 告警监控
│   ├── 三类告警分类
│   ├── 动态筛选
│   └── 处理流程
└── 配置管理
    ├── Mock数据配置
    ├── 用户偏好设置
    └── 系统参数管理
```

### 3.2 详细功能需求

#### 3.2.1 组织架构管理 (P0)

**需求描述**: 提供四级层次的组织架构展示和交互

**功能点**:
1. **层次结构展示**
   - 支持根节点→部门→系统→资产四级结构
   - 每个节点显示名称、健康状态、统计数据
   - 支持节点展开/折叠状态管理

2. **交互行为**
   - 点击节点切换右侧详情面板显示内容
   - 展开图标点击动态加载子节点
   - 支持键盘导航（Tab、回车、方向键）

3. **状态管理**
   - 选中状态视觉反馈
   - 展开状态持久化
   - 健康状态实时更新

**开发要求**:
```typescript
// 核心数据结构
interface OrganizationNode {
  id: string
  name: string
  type: 'root' | 'department' | 'system' | 'asset'
  healthStatus: HealthStatus
  children?: OrganizationNode[]
  isExpanded?: boolean
  systemCount: number
  assetCount: number
}

// 关键组件方法
const handleNodeClick = (node: OrganizationNode) => {
  // 1. 更新选中状态
  dispatch(setSelectedOrganization(node))

  // 2. 根据节点类型加载相应数据
  switch (node.type) {
    case 'department':
      loadDepartmentSystems(node.id)
      break
    case 'system':
      loadSystemAssets(node.id)
      break
  }

  // 3. 清除不相关的选择状态
  dispatch(setSelectedAssetId(null))
}
```

**验收标准**:
- [ ] 支持4级层次结构展示
- [ ] 点击节点能正确切换右侧内容
- [ ] 展开状态在刷新后保持
- [ ] 健康状态颜色编码正确
- [ ] 性能：1000个节点渲染时间<200ms

#### 3.2.2 健康矩阵可视化 (P0)

**需求描述**: 使用D3.js实现交互式健康矩阵图和蜂窝图

**功能点**:
1. **矩阵图展示**
   - 按部门和重要性维度展示系统分布
   - 气泡大小表示资产数量
   - 颜色表示健康状态

2. **蜂窝图展示**
   - 系统级别时展示资产蜂窝图
   - 支持缩放和平移操作
   - 点击蜂窝进入资产详情

3. **交互功能**
   - 鼠标悬停显示详细信息
   - 点击气泡/蜂窝触发导航
   - 选中状态高亮显示

**开发要求**:
```typescript
// D3.js组件结构
const HealthMatrix: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const { filteredAssets, selectedAssetId } = useSelector(...)

  useEffect(() => {
    const svg = d3.select(svgRef.current)

    // 清除现有内容
    svg.selectAll('*').remove()

    // 根据数据类型选择渲染方式
    if (selectedOrganization?.type === 'system') {
      renderHoneycombChart(svg, filteredAssets)
    } else {
      renderMatrixChart(svg, systemData)
    }

    // 绑定交互事件
    svg.selectAll('.interactive-element')
      .on('click', handleElementClick)
      .on('mouseover', showTooltip)
      .on('mouseout', hideTooltip)

    // 清理函数
    return () => {
      svg.selectAll('*').remove()
    }
  }, [filteredAssets, selectedAssetId])
}

// 蜂窝图布局算法
const calculateHexagonPositions = (data: Asset[]) => {
  const hexRadius = 20
  const positions: Array<{x: number, y: number, data: Asset}> = []

  // 实现六边形紧密排列算法
  // ...布局计算逻辑

  return positions
}
```

**验收标准**:
- [ ] 矩阵图能正确展示系统分布
- [ ] 蜂窝图布局紧密无重叠
- [ ] 缩放平移操作流畅
- [ ] 选中状态视觉反馈明显
- [ ] 工具提示信息准确

#### 3.2.3 系统详情面板 (P0)

**需求描述**: 动态展示不同层级的详细信息

**功能点**:
1. **四种显示模式**
   - systemsList: 业务系统概览列表
   - departmentSystems: 部门系统（支持列表/卡片切换）
   - systemDetail: 系统详细信息
   - assetDetail: 资产详细信息

2. **视图切换**
   - 列表/卡片视图切换开关
   - 默认卡片视图展示更多信息
   - 响应式布局适配

3. **面包屑导航**
   - 显示当前位置路径
   - 支持点击返回上级
   - 自动清除相关选择状态

**开发要求**:
```typescript
// 显示内容计算逻辑
const displayContent = useMemo(() => {
  // 优先级1: 蜂窝图资产选择
  if (selectedAssetId && filteredAssets.length > 0) {
    const selectedAsset = filteredAssets.find(asset => asset.id === selectedAssetId)
    if (selectedAsset) {
      return { type: 'assetDetail', data: selectedAsset }
    }
  }

  // 优先级2: 组织节点选择
  if (!selectedOrganization) {
    return { type: 'empty', data: null }
  }

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

// 返回导航处理
const handleBackToSystem = () => {
  dispatch(setSelectedAssetId(null))
  // 保持系统级别的其他状态不变
}
```

**验收标准**:
- [ ] 四种显示模式切换正确
- [ ] 列表/卡片视图切换正常
- [ ] 面包屑导航功能完整
- [ ] 数据加载状态显示
- [ ] 空状态友好提示

#### 3.2.4 告警监控系统 (P0)

**需求描述**: 三类告警的分类展示和处理

**功能点**:
1. **告警分类**
   - 运行告警(RUNTIME): 系统运行异常
   - 脆弱性(VULNERABILITY): 安全漏洞
   - 安全事件(SECURITY): 安全威胁

2. **动态筛选**
   - 根据组织树选择自动筛选
   - 支持多维度过滤条件
   - 实时计数更新

3. **处理流程**
   - 告警确认、分派、解决
   - 状态变更记录
   - 处理时间统计

**开发要求**:
```typescript
// 告警数据处理
const AlertPanel: React.FC = () => {
  const [items, setItems] = useState<AlertPanelItem[]>([])
  const { selectedOrganization, filteredAssets } = useSelector(...)

  // 数据加载和筛选
  useEffect(() => {
    const loadData = async () => {
      const alerts = await generateMockAlerts()
      const vulnerabilities = await generateMockVulnerabilities()
      const securityEvents = await generateSecurityEvents()

      let allItems = [...alerts, ...vulnerabilities, ...securityEvents]

      // 根据选择范围筛选
      if (selectedOrganization && selectedOrganization.type !== 'root') {
        allItems = filterByOrganization(allItems, selectedOrganization)
      }

      setItems(allItems.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ))
    }

    loadData()
  }, [selectedOrganization, filteredAssets])

  // 按类型分组
  const groupedItems = useMemo(() => ({
    runtime: items.filter(item => item.type === 'RUNTIME'),
    vulnerability: items.filter(item => item.type === 'VULNERABILITY'),
    security: items.filter(item => item.type === 'SECURITY')
  }), [items])
}
```

**验收标准**:
- [ ] 三类告警正确分类显示
- [ ] 筛选逻辑准确无误
- [ ] 标签页计数实时更新
- [ ] 告警项展示信息完整
- [ ] 处理流程状态正确

### 3.3 非功能需求

#### 3.3.1 数据管理需求
1. **Mock数据系统**
   - 确定性随机算法保证数据一致性
   - 支持可视化配置界面
   - 数据关联关系完整

2. **状态管理**
   - Redux Toolkit统一状态管理
   - 状态持久化（可选）
   - 开发工具支持

#### 3.3.2 可扩展性需求
1. **组件化设计**
   - 可复用组件库
   - 插件化架构
   - 主题系统支持

2. **国际化支持**
   - 多语言切换
   - 时区处理
   - 数字格式化

## 技术需求

### 4.1 技术栈要求

#### 4.1.1 前端技术栈
```json
{
  "framework": "React 18.x",
  "language": "TypeScript 5.x",
  "buildTool": "Vite 5.x",
  "uiLibrary": "Ant Design 5.x",
  "stateManagement": "Redux Toolkit",
  "visualization": "D3.js 7.x",
  "routing": "React Router 6.x",
  "styling": "CSS Custom Properties + CSS Modules",
  "testing": "Jest + React Testing Library",
  "linting": "ESLint + Prettier"
}
```

#### 4.1.2 构建和部署
```json
{
  "nodeVersion": ">=18.0.0",
  "packageManager": "npm",
  "bundleAnalysis": "rollup-plugin-visualizer",
  "codeQuality": "SonarQube (可选)",
  "ci-cd": "GitHub Actions / Jenkins",
  "deployment": "Docker + Nginx"
}
```

### 4.2 代码质量要求

#### 4.2.1 代码规范
```typescript
// 1. TypeScript严格模式
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}

// 2. 组件定义规范
interface ComponentProps {
  // 必需属性
  data: DataType
  // 可选属性
  className?: string
  // 回调函数
  onItemClick?: (item: DataType) => void
}

const Component: React.FC<ComponentProps> = ({
  data,
  className,
  onItemClick
}) => {
  // 组件实现
}

// 3. 状态管理规范
interface StateSlice {
  // 数据状态
  data: DataType[]
  // UI状态
  loading: boolean
  error: string | null
  // 选择状态
  selectedItem: DataType | null
}
```

#### 4.2.2 性能要求
```typescript
// 1. 组件优化
const OptimizedComponent = React.memo(Component, (prev, next) => {
  return shallowEqual(prev, next)
})

// 2. 状态选择器优化
const useOptimizedSelector = () => {
  return useSelector(state => ({
    data: state.data,
    loading: state.loading
  }), shallowEqual)
}

// 3. 计算缓存
const expensiveCalculation = useMemo(() => {
  return computeHeavyData(data)
}, [data])

// 4. 回调缓存
const handleClick = useCallback((id: string) => {
  dispatch(selectItem(id))
}, [dispatch])
```

### 4.3 测试要求

#### 4.3.1 单元测试
```typescript
// 组件测试示例
describe('OrganizationTree', () => {
  test('renders tree nodes correctly', () => {
    const mockData = generateMockOrganizations()
    render(<OrganizationTree />, {
      preloadedState: { dashboard: { organizations: mockData } }
    })

    expect(screen.getByText('XX市大数据中心')).toBeInTheDocument()
  })

  test('handles node click', () => {
    const mockDispatch = jest.fn()
    // 测试逻辑
  })
})

// Redux测试示例
describe('dashboardSlice', () => {
  test('setSelectedOrganization updates state', () => {
    const initialState = { selectedOrganization: null }
    const action = setSelectedOrganization(mockNode)
    const newState = dashboardReducer(initialState, action)

    expect(newState.selectedOrganization).toEqual(mockNode)
  })
})
```

#### 4.3.2 集成测试
```typescript
// 端到端测试场景
describe('Navigation Flow', () => {
  test('complete navigation from root to asset', async () => {
    render(<Dashboard />)

    // 1. 点击部门节点
    fireEvent.click(screen.getByText('市公安局'))
    await waitFor(() => {
      expect(screen.getByText('部门系统')).toBeInTheDocument()
    })

    // 2. 点击系统卡片
    fireEvent.click(screen.getByText('公安执法系统'))
    await waitFor(() => {
      expect(screen.getByText('系统详情')).toBeInTheDocument()
    })

    // 3. 点击蜂窝图资产
    fireEvent.click(screen.getByTestId('asset-hexagon'))
    await waitFor(() => {
      expect(screen.getByText('资产详情')).toBeInTheDocument()
    })
  })
})
```

#### 4.3.3 测试覆盖率要求
- **行覆盖率**: ≥80%
- **分支覆盖率**: ≥70%
- **函数覆盖率**: ≥85%
- **语句覆盖率**: ≥80%

## 界面设计需求

### 5.1 视觉设计规范

#### 5.1.1 色彩规范
```css
/* 品牌色彩 */
:root {
  --primary-color: #1677ff;        /* 主色调 */
  --success-color: #52c41a;        /* 成功/健康 */
  --warning-color: #faad14;        /* 警告 */
  --error-color: #ff4d4f;          /* 错误/危险 */

  /* 健康状态色 */
  --status-healthy: #52c41a;       /* 健康 */
  --status-warning: #faad14;       /* 警告 */
  --status-critical: #ff4d4f;      /* 严重 */
  --status-unknown: #8c8c8c;       /* 未知 */
}
```

#### 5.1.2 字体规范
```css
/* 字体大小 */
:root {
  --font-size-h1: 32px;           /* 页面标题 */
  --font-size-h2: 24px;           /* 区域标题 */
  --font-size-h3: 20px;           /* 卡片标题 */
  --font-size-h4: 16px;           /* 组件标题 */
  --font-size-base: 14px;         /* 基础字体 */
  --font-size-small: 12px;        /* 小号字体 */
}
```

#### 5.1.3 布局规范
```css
/* 间距系统 - 8px基准 */
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-xxl: 48px;
}

/* 组件尺寸 */
:root {
  --sidebar-width: 200px;
  --header-height: 60px;
  --kpi-section-height: 120px;
  --alert-panel-height: 300px;
}
```

### 5.2 交互设计规范

#### 5.2.1 状态反馈
```css
/* 悬停状态 */
.interactive-element {
  transition: all 0.3s ease;
  cursor: pointer;
}

.interactive-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.15);
}

/* 选中状态 */
.selected {
  background-color: rgba(22, 119, 255, 0.1);
  border-left: 3px solid var(--primary-color);
}

/* 加载状态 */
.loading {
  position: relative;
  pointer-events: none;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

#### 5.2.2 动画规范
```css
/* 基础过渡 */
.smooth-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 进入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
```

### 5.3 响应式设计需求

#### 5.3.1 断点系统
```css
/* 断点定义 */
--breakpoint-sm: 576px;
--breakpoint-md: 768px;
--breakpoint-lg: 992px;
--breakpoint-xl: 1200px;
--breakpoint-xxl: 1600px;
```

#### 5.3.2 适配策略
```typescript
// 响应式适配要求
const responsiveConfig = {
  desktop: {
    minWidth: 1200,
    layout: 'three-panel',
    features: ['full-features']
  },
  tablet: {
    minWidth: 768,
    maxWidth: 1199,
    layout: 'two-panel',
    features: ['core-features']
  },
  mobile: {
    maxWidth: 767,
    layout: 'single-panel',
    features: ['essential-features']
  }
}
```

## 性能需求

### 6.1 页面性能指标

#### 6.1.1 核心性能指标
| 指标 | 目标值 | 测量方法 |
|------|--------|----------|
| **首屏加载时间** | <2s | FCP (First Contentful Paint) |
| **页面完全加载** | <3s | LCP (Largest Contentful Paint) |
| **交互响应时间** | <100ms | FID (First Input Delay) |
| **布局稳定性** | <0.1 | CLS (Cumulative Layout Shift) |
| **资源压缩率** | >70% | Gzip/Brotli压缩 |

#### 6.1.2 JavaScript性能
```typescript
// 性能监控实现
const PerformanceMonitor = {
  // 记录关键时间点
  markTiming: (name: string) => {
    performance.mark(name)
  },

  // 测量时间间隔
  measureDuration: (name: string, startMark: string, endMark: string) => {
    performance.measure(name, startMark, endMark)
    const measure = performance.getEntriesByName(name)[0]
    console.log(`${name}: ${measure.duration}ms`)
  },

  // 监控组件渲染性能
  monitorComponentRender: (componentName: string) => {
    return (WrappedComponent: React.ComponentType) => {
      return (props: any) => {
        const renderStart = performance.now()

        useEffect(() => {
          const renderEnd = performance.now()
          console.log(`${componentName} render time: ${renderEnd - renderStart}ms`)
        })

        return <WrappedComponent {...props} />
      }
    }
  }
}
```

### 6.2 数据处理性能

#### 6.2.1 大数据集处理
```typescript
// 虚拟化列表要求
interface VirtualListRequirements {
  maxItems: 10000          // 支持最大项目数
  visibleItems: 20         // 可见项目数
  itemHeight: 50           // 项目固定高度
  bufferSize: 5            // 缓冲区大小
  scrollThreshold: 100     // 滚动加载阈值
}

// 分页加载策略
const usePaginatedData = (pageSize: number = 20) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const newData = await fetchData(data.length, pageSize)
      setData(prev => [...prev, ...newData])
      setHasMore(newData.length === pageSize)
    } finally {
      setLoading(false)
    }
  }, [data.length, pageSize, loading, hasMore])

  return { data, loading, hasMore, loadMore }
}
```

#### 6.2.2 D3.js性能优化
```typescript
// Canvas渲染优化（当SVG性能不足时）
const useCanvasRenderer = (data: any[], width: number, height: number) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    // 设置高DPI支持
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // 使用requestAnimationFrame进行渲染
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // 批量绘制数据点
      data.forEach(item => {
        drawDataPoint(ctx, item)
      })
    }

    requestAnimationFrame(render)
  }, [data, width, height])

  return canvasRef
}
```

### 6.3 内存管理

#### 6.3.1 内存使用限制
- **JavaScript堆内存**: <100MB
- **DOM节点数量**: <5000
- **事件监听器**: 及时清理
- **定时器**: 避免内存泄漏

#### 6.3.2 内存优化策略
```typescript
// 组件清理规范
const ComponentWithCleanup: React.FC = () => {
  useEffect(() => {
    const subscription = dataService.subscribe(handleData)
    const intervalId = setInterval(refreshData, 30000)
    const eventListener = (e: Event) => handleEvent(e)

    window.addEventListener('resize', eventListener)

    // 清理函数
    return () => {
      subscription.unsubscribe()
      clearInterval(intervalId)
      window.removeEventListener('resize', eventListener)
    }
  }, [])

  return <div>Component content</div>
}

// 大对象引用清理
const useLargeDataSet = (dataId: string) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchLargeDataSet(dataId)
      setData(result)
    }

    loadData()

    // 组件卸载时清理大对象
    return () => {
      setData(null)
    }
  }, [dataId])

  return data
}
```

## 安全需求

### 7.1 前端安全

#### 7.1.1 XSS防护
```typescript
// 输入验证和清理
const sanitizeInput = (input: string): string => {
  // 移除潜在的XSS攻击向量
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

// 安全的HTML渲染
const SafeHTML: React.FC<{ content: string }> = ({ content }) => {
  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span'],
      ALLOWED_ATTR: ['class', 'style']
    })
  }, [content])

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
  )
}
```

#### 7.1.2 数据加密
```typescript
// 敏感数据加密存储
const SecureStorage = {
  set: (key: string, value: any) => {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      process.env.VITE_ENCRYPTION_KEY
    ).toString()
    localStorage.setItem(key, encrypted)
  },

  get: (key: string) => {
    const encrypted = localStorage.getItem(key)
    if (!encrypted) return null

    try {
      const decrypted = CryptoJS.AES.decrypt(
        encrypted,
        process.env.VITE_ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8)
      return JSON.parse(decrypted)
    } catch {
      return null
    }
  },

  remove: (key: string) => {
    localStorage.removeItem(key)
  }
}
```

### 7.2 网络安全

#### 7.2.1 API安全
```typescript
// 请求拦截器
const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 10000
})

apiClient.interceptors.request.use(
  (config) => {
    // 添加认证头
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加CSRF Token
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken
    }

    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权访问
      redirectToLogin()
    }
    return Promise.reject(error)
  }
)
```

#### 7.2.2 内容安全策略
```html
<!-- CSP头部设置 -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               font-src 'self' https://fonts.gstatic.com;">
```

## 开发规范

### 8.1 代码组织规范

#### 8.1.1 目录结构
```
src/
├── components/                 # 通用组件
│   ├── common/                # 基础组件
│   └── dashboard/             # 业务组件
├── pages/                     # 页面组件
├── hooks/                     # 自定义Hooks
├── utils/                     # 工具函数
├── types/                     # 类型定义
├── store/                     # 状态管理
├── services/                  # API服务
├── constants/                 # 常量定义
├── styles/                    # 全局样式
└── tests/                     # 测试文件
```

#### 8.1.2 命名规范
```typescript
// 文件命名：kebab-case
organization-tree.tsx
health-matrix.component.tsx
api-client.service.ts

// 组件命名：PascalCase
const OrganizationTree: React.FC = () => {}
const HealthMatrixChart: React.FC = () => {}

// 函数命名：camelCase
const handleNodeClick = () => {}
const fetchSystemData = () => {}

// 常量命名：SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_ATTEMPTS = 3

// 类型命名：PascalCase
interface OrganizationNode {}
type HealthStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL'
```

### 8.2 Git工作流规范

#### 8.2.1 分支管理
```bash
# 主分支
main                    # 生产环境分支
develop                 # 开发环境分支

# 功能分支
feature/org-tree        # 功能开发分支
feature/health-matrix   # 功能开发分支

# 修复分支
hotfix/critical-bug     # 紧急修复分支
bugfix/minor-issue      # 问题修复分支

# 发布分支
release/v2.1.0          # 版本发布分支
```

#### 8.2.2 提交消息规范
```bash
# 提交消息格式
<type>(<scope>): <subject>

<body>

<footer>

# 类型说明
feat:     新功能
fix:      修复bug
docs:     文档更新
style:    代码格式化
refactor: 重构代码
test:     测试相关
chore:    构建过程或辅助工具的变动

# 示例
feat(org-tree): add node expansion animation
fix(health-matrix): resolve hexagon positioning issue
docs(readme): update installation instructions
```

### 8.3 代码审查规范

#### 8.3.1 审查清单
- [ ] **功能正确性**: 代码实现是否符合需求
- [ ] **性能影响**: 是否存在性能问题
- [ ] **安全考虑**: 是否存在安全漏洞
- [ ] **代码质量**: 代码是否清晰易读
- [ ] **测试覆盖**: 是否包含充分的测试
- [ ] **文档完整**: 是否包含必要的注释和文档

#### 8.3.2 审查流程
1. **自审**: 开发者提交前自行审查
2. **同行审查**: 团队成员代码审查
3. **技术审查**: 技术负责人最终审查
4. **自动化检查**: CI/CD流水线自动检查

## 测试需求

### 9.1 测试策略

#### 9.1.1 测试金字塔
```
        E2E Tests (10%)
       ────────────────
      Integration Tests (20%)
     ──────────────────────────
    Unit Tests (70%)
   ────────────────────────────────
```

#### 9.1.2 测试分类
| 测试类型 | 覆盖范围 | 工具 | 目标覆盖率 |
|---------|---------|------|------------|
| **单元测试** | 组件、函数、工具类 | Jest + RTL | 80% |
| **集成测试** | 组件交互、Redux | Jest + RTL | 60% |
| **端到端测试** | 完整用户流程 | Cypress | 主流程覆盖 |
| **视觉回归测试** | UI一致性 | Percy/Chromatic | 关键页面 |

### 9.2 测试实现

#### 9.2.1 组件测试
```typescript
// OrganizationTree组件测试
describe('OrganizationTree', () => {
  const mockStore = configureMockStore([])
  const defaultState = {
    dashboard: {
      organizations: mockOrganizations,
      selectedOrganization: null
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders organization tree correctly', () => {
    const store = mockStore(defaultState)
    render(
      <Provider store={store}>
        <OrganizationTree />
      </Provider>
    )

    expect(screen.getByText('XX市大数据中心')).toBeInTheDocument()
    expect(screen.getByText('市公安局')).toBeInTheDocument()
  })

  test('handles node selection', async () => {
    const store = mockStore(defaultState)
    const user = userEvent.setup()

    render(
      <Provider store={store}>
        <OrganizationTree />
      </Provider>
    )

    await user.click(screen.getByText('市公安局'))

    const actions = store.getActions()
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: 'dashboard/setSelectedOrganization'
      })
    )
  })

  test('displays health status correctly', () => {
    const stateWithUnhealthyOrg = {
      ...defaultState,
      dashboard: {
        ...defaultState.dashboard,
        organizations: [{
          ...mockOrganizations[0],
          healthStatus: 'CRITICAL'
        }]
      }
    }

    const store = mockStore(stateWithUnhealthyOrg)
    render(
      <Provider store={store}>
        <OrganizationTree />
      </Provider>
    )

    expect(screen.getByTestId('health-indicator-critical')).toBeInTheDocument()
  })
})
```

#### 9.2.2 Redux测试
```typescript
// dashboardSlice测试
describe('dashboardSlice', () => {
  const initialState: DashboardState = {
    selectedOrganization: null,
    organizations: [],
    systems: [],
    filteredAssets: [],
    selectedDepartmentId: null,
    selectedAssetId: null,
    metrics: null,
    alerts: [],
    vulnerabilities: [],
    filters: {},
    loading: false,
    error: null
  }

  test('setSelectedOrganization', () => {
    const mockNode: OrganizationNode = {
      id: 'dept_001',
      name: '市公安局',
      type: 'department',
      healthStatus: 'HEALTHY',
      systemCount: 5,
      assetCount: 32
    }

    const action = setSelectedOrganization(mockNode)
    const newState = dashboardReducer(initialState, action)

    expect(newState.selectedOrganization).toEqual(mockNode)
  })

  test('setFilteredAssets filters correctly', () => {
    const mockAssets: Asset[] = [
      { id: 'asset_001', name: '服务器-01', systemId: 'sys_001' },
      { id: 'asset_002', name: '数据库-01', systemId: 'sys_001' }
    ]

    const action = setFilteredAssets(mockAssets)
    const newState = dashboardReducer(initialState, action)

    expect(newState.filteredAssets).toEqual(mockAssets)
    expect(newState.filteredAssets).toHaveLength(2)
  })
})
```

#### 9.2.3 端到端测试
```typescript
// Cypress E2E测试
describe('Dashboard Navigation Flow', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.intercept('GET', '/api/v1/organizations/tree', {
      fixture: 'organizations.json'
    })
  })

  it('completes full navigation flow', () => {
    // 1. 验证初始状态
    cy.contains('XX市大数据中心业务健康总览页').should('be.visible')
    cy.get('[data-testid="kpi-cards"]').should('be.visible')

    // 2. 点击部门节点
    cy.get('[data-testid="org-node-dept_001"]').click()
    cy.contains('市公安局 - 系统状态').should('be.visible')

    // 3. 切换到卡片视图
    cy.get('[data-testid="view-toggle"]').click()
    cy.get('[data-testid="system-card"]').should('be.visible')

    // 4. 点击系统卡片
    cy.get('[data-testid="system-card"]').first().click()
    cy.contains('系统详细信息').should('be.visible')

    // 5. 点击蜂窝图资产
    cy.get('[data-testid="asset-hexagon"]').first().click()
    cy.contains('资产详细信息').should('be.visible')

    // 6. 验证面包屑导航
    cy.get('[data-testid="breadcrumb-link"]').should('be.visible')
    cy.get('[data-testid="breadcrumb-link"]').click()
    cy.contains('系统详细信息').should('be.visible')
  })

  it('filters alerts correctly', () => {
    // 选择部门
    cy.get('[data-testid="org-node-dept_001"]').click()

    // 检查告警面板筛选
    cy.get('[data-testid="alert-panel"]').within(() => {
      cy.contains('运行告警').click()
      cy.get('[data-testid="alert-item"]').should('contain', '市公安局')
    })
  })
})
```

### 9.3 性能测试

#### 9.3.1 渲染性能测试
```typescript
// 组件渲染性能测试
describe('Performance Tests', () => {
  test('OrganizationTree renders large dataset efficiently', async () => {
    const largeDataset = generateMockOrganizations(1000) // 1000个节点
    const store = mockStore({
      dashboard: { organizations: largeDataset }
    })

    const startTime = performance.now()

    render(
      <Provider store={store}>
        <OrganizationTree />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('org-tree')).toBeInTheDocument()
    })

    const endTime = performance.now()
    const renderTime = endTime - startTime

    expect(renderTime).toBeLessThan(500) // 渲染时间应小于500ms
  })

  test('HealthMatrix handles 500 data points', async () => {
    const largeAssetData = generateMockAssets(500)

    const startTime = performance.now()
    render(<HealthMatrix data={largeAssetData} />)

    await waitFor(() => {
      expect(screen.getByTestId('health-matrix')).toBeInTheDocument()
    })

    const endTime = performance.now()
    expect(endTime - startTime).toBeLessThan(1000) // 1秒内完成渲染
  })
})
```

#### 9.3.2 内存泄漏测试
```typescript
// 内存泄漏检测
describe('Memory Leak Tests', () => {
  test('components cleanup properly on unmount', () => {
    const { unmount } = render(<Dashboard />)

    // 记录初始内存使用
    const initialMemory = (performance as any).memory?.usedJSHeapSize

    // 多次挂载和卸载组件
    for (let i = 0; i < 10; i++) {
      const { unmount: unmountInstance } = render(<Dashboard />)
      unmountInstance()
    }

    // 强制垃圾回收（仅在支持的环境中）
    if (global.gc) {
      global.gc()
    }

    const finalMemory = (performance as any).memory?.usedJSHeapSize

    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory - initialMemory
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024) // 内存增长<10MB
    }
  })
})
```

## 部署需求

### 10.1 构建配置

#### 10.1.1 Vite构建配置
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    // 打包分析
    bundleAnalyzer({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: true
    })
  ],
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: process.env.NODE_ENV === 'production' ? false : true,
    rollupOptions: {
      output: {
        // 代码分割
        manualChunks: {
          vendor: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          antd: ['antd', '@ant-design/icons'],
          d3: ['d3'],
          utils: ['dayjs', 'lodash']
        },
        // 文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    cors: true
  },
  preview: {
    port: 4173,
    host: true
  }
})
```

#### 10.1.2 环境配置
```bash
# .env.production
VITE_ENV=production
VITE_API_BASE_URL=https://api.production.com
VITE_ENABLE_MOCK=false
VITE_ENABLE_ANALYTICS=true

# .env.development
VITE_ENV=development
VITE_API_BASE_URL=https://api.dev.com
VITE_ENABLE_MOCK=true
VITE_ENABLE_ANALYTICS=false

# .env.test
VITE_ENV=test
VITE_API_BASE_URL=https://api.test.com
VITE_ENABLE_MOCK=true
VITE_ENABLE_ANALYTICS=false
```

### 10.2 Docker配置

#### 10.2.1 Dockerfile
```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产镜像
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 10.2.2 Nginx配置
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/javascript application/json
               application/xml+rss application/atom+xml;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;
    }

    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;

        # 安全头
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy strict-origin-when-cross-origin;
    }

    # API代理
    location /api/ {
        proxy_pass http://backend-service:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 健康检查端点
    location /health {
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
```

### 10.3 CI/CD流水线

#### 10.3.1 GitHub Actions配置
```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          VITE_ENV: production
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}

      - name: Build Docker image
        run: |
          docker build -t biz-stable:${{ github.sha }} .
          docker tag biz-stable:${{ github.sha }} biz-stable:latest

      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push biz-stable:${{ github.sha }}
          docker push biz-stable:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to production
        run: |
          # 部署到生产环境的脚本
          echo "Deploying to production..."
```

### 10.4 监控和日志

#### 10.4.1 性能监控
```typescript
// 前端监控配置
const initMonitoring = () => {
  // Web Vitals监控
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log)
    getFID(console.log)
    getFCP(console.log)
    getLCP(console.log)
    getTTFB(console.log)
  })

  // 错误监控
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    // 发送到监控服务
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    // 发送到监控服务
  })
}

// 用户行为监控
const trackUserAction = (action: string, data?: any) => {
  // 发送用户行为数据到分析服务
  console.log(`User action: ${action}`, data)
}
```

#### 10.4.2 日志配置
```typescript
// 日志服务
class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  info(message: string, data?: any) {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, data)
    }
    this.sendToLogService('info', message, data)
  }

  error(message: string, error?: any) {
    console.error(`[ERROR] ${message}`, error)
    this.sendToLogService('error', message, error)
  }

  warn(message: string, data?: any) {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, data)
    }
    this.sendToLogService('warn', message, data)
  }

  private sendToLogService(level: string, message: string, data?: any) {
    // 发送到日志服务
    if (!this.isDevelopment) {
      // 实际的日志服务调用
    }
  }
}

export const logger = new Logger()
```

## 验收标准

### 11.1 功能验收

#### 11.1.1 核心功能清单
| 功能模块 | 验收标准 | 测试方法 |
|---------|---------|---------|
| **组织架构树** | 四级层次正确展示，交互响应正常 | 手动测试 + 自动化测试 |
| **健康矩阵图** | D3.js渲染正确，交互流畅 | 视觉测试 + 性能测试 |
| **系统详情面板** | 四种模式切换正确，数据显示准确 | 功能测试 + 数据验证 |
| **告警监控** | 三类告警分类正确，筛选准确 | 功能测试 + 集成测试 |
| **面包屑导航** | 导航路径正确，返回功能正常 | 用户流程测试 |

#### 11.1.2 交互验收
- [ ] 所有点击操作响应时间<100ms
- [ ] 状态变更视觉反馈明显
- [ ] 加载状态提示友好
- [ ] 错误状态处理得当
- [ ] 键盘导航支持完整

### 11.2 性能验收

#### 11.2.1 页面性能指标
| 指标 | 目标值 | 当前值 | 状态 |
|------|--------|--------|------|
| FCP | <2s | - | 待测试 |
| LCP | <3s | - | 待测试 |
| FID | <100ms | - | 待测试 |
| CLS | <0.1 | - | 待测试 |
| Bundle Size | <2MB | - | 待测试 |

#### 11.2.2 性能测试场景
```typescript
// 性能测试用例
const performanceTests = [
  {
    name: '大数据集渲染',
    scenario: '1000个组织节点',
    expectation: '渲染时间<500ms'
  },
  {
    name: '蜂窝图交互',
    scenario: '500个资产蜂窝',
    expectation: '缩放平移流畅60fps'
  },
  {
    name: '告警列表滚动',
    scenario: '1000条告警记录',
    expectation: '虚拟滚动流畅'
  },
  {
    name: '状态切换',
    scenario: '快速切换组织节点',
    expectation: '响应时间<50ms'
  }
]
```

### 11.3 兼容性验收

#### 11.3.1 浏览器兼容性
| 浏览器 | 版本要求 | 测试状态 |
|--------|---------|---------|
| Chrome | ≥90 | ✅ |
| Firefox | ≥88 | ✅ |
| Safari | ≥14 | ✅ |
| Edge | ≥90 | ✅ |

#### 11.3.2 设备兼容性
| 设备类型 | 分辨率范围 | 测试状态 |
|---------|-----------|---------|
| 桌面端 | 1920×1080及以上 | ✅ |
| 笔记本 | 1366×768及以上 | ✅ |
| 平板 | 768×1024及以上 | ✅ |
| 手机 | 375×667及以上 | ✅ |

### 11.4 安全验收

#### 11.4.1 安全测试清单
- [ ] XSS攻击防护测试
- [ ] CSRF攻击防护测试
- [ ] 输入验证测试
- [ ] 敏感信息泄露检查
- [ ] 第三方依赖安全扫描

#### 11.4.2 安全配置验证
- [ ] CSP头部配置正确
- [ ] HTTPS强制重定向
- [ ] 安全Cookie设置
- [ ] X-Frame-Options配置
- [ ] 敏感文件访问限制

### 11.5 部署验收

#### 11.5.1 部署环境验证
- [ ] 生产环境部署成功
- [ ] 环境变量配置正确
- [ ] 服务健康检查通过
- [ ] 负载均衡配置正确
- [ ] 日志收集正常

#### 11.5.2 回滚验证
- [ ] 快速回滚机制
- [ ] 数据一致性保证
- [ ] 服务可用性监控
- [ ] 故障恢复流程

---

## 📚 相关文档链接
- [功能更新文档](./功能更新文档.md)
- [技术架构文档](./技术架构文档.md)
- [UI-UX设计规范](./UI-UX设计规范.md)
- [接口规范文档](./接口规范文档.md)
- [开发指南](../CLAUDE.md)

---

**文档维护**: 本PRD文档应随着产品功能的演进持续更新，确保开发团队始终按照最新需求进行开发。