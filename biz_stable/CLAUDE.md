# 业务稳定性监控仪表板 - Claude Code 开发指南

## 项目概述
这是一个基于React的业务稳定性监控仪表板系统，提供对组织资产、系统和告警的实时监控，采用四级层次结构（根节点 → 部门 → 系统 → 资产）。

## 技术栈
- **前端框架**: React 18 + TypeScript + Vite
- **UI组件库**: Ant Design 5.x (Card, List, Table, Tabs, Descriptions, Tag, Badge等)
- **状态管理**: Redux Toolkit
- **数据可视化**: D3.js (自定义矩阵图和蜂窝图)
- **样式方案**: CSS自定义属性 + 组件级CSS文件
- **时间处理**: dayjs + relativeTime插件

## 开发命令
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 类型检查
npm run typecheck

# 代码检查
npm run lint
```

## 项目结构
```
src/
├── components/dashboard/
│   ├── AlertPanel/           # 底部横向告警监控面板（运行告警、脆弱性、安全事件）
│   ├── HealthMatrix/         # D3.js健康矩阵可视化（支持缩放平移和蜂窝图）
│   ├── OrganizationTree/     # 左侧组织架构树导航
│   ├── SystemDetail/         # 右侧详情面板（4种显示模式）
│   └── KPICards/            # 顶部KPI指标卡片
├── pages/Dashboard/          # 主仪表板布局（三面板设计）
├── store/slices/
│   └── dashboardSlice.ts    # Redux状态管理（17个action）
├── mock/data.ts             # 模拟数据生成器（确定性随机算法）
├── types/index.ts           # TypeScript类型定义
└── App.css                  # 全局CSS变量定义
```

## 核心架构模式

### 布局结构
仪表板采用三面板布局设计：
- **左侧面板**: 组织架构树导航（200px固定宽度）
- **中间区域**: 上下分割
  - **上部**: 健康矩阵图和系统详情面板并排显示
  - **下部**: 全宽度告警监控面板
- **顶部**: KPI指标卡片（横向撑满）

### 状态管理架构
使用Redux Toolkit，主要状态在`dashboardSlice.ts`中定义：
```typescript
interface DashboardState {
  selectedOrganization: OrganizationNode | null    // 当前选中的树节点
  selectedAssetId: string | null                   // 蜂窝图选中的资产ID
  selectedDepartmentId: string | null              // 选中的部门ID
  filteredAssets: Asset[]                          // 根据当前选择筛选的资产
  systems: BusinessSystem[]                        // 业务系统数据
  organizations: OrganizationNode[]                // 组织架构树数据
  metrics: DashboardMetrics | null                 // KPI指标数据
  // ...其他状态
}
```

### 四级层次结构
1. **根节点（Root）**: 显示所有业务系统概览列表
2. **部门节点（Department）**: 显示部门系统（支持列表/卡片视图切换）
3. **系统节点（System）**: 显示单个系统详细信息
4. **资产节点（Asset）**: 显示具体资产信息（带面包屑导航）

## 组件职责分工

### SystemDetail 组件（右侧详情面板）
基于选择状态的动态显示，支持4种显示模式：
```typescript
// 显示模式逻辑
const displayContent = useMemo(() => {
  if (selectedAssetId && filteredAssets.length > 0) {
    return { type: 'assetDetail', data: selectedAsset }           // 资产详情
  }
  if (selectedOrganization?.type === 'root') {
    return { type: 'systemsList', data: allSystems }              // 系统概览
  }
  if (selectedOrganization?.type === 'department') {
    return { type: 'departmentSystems', data: departmentSystems } // 部门系统
  }
  if (selectedOrganization?.type === 'system') {
    return { type: 'systemDetail', data: systemDetail }          // 系统详情
  }
}, [selectedOrganization, filteredAssets, selectedAssetId])
```

### HealthMatrix 组件（D3.js可视化）
特性和交互逻辑：
- **缩放平移**: 支持鼠标滚轮缩放和拖拽平移
- **蜂窝可视化**: 资产以蜂窝形状展示，支持选中状态
- **点击交互**: 矩阵气泡点击触发系统下钻
- **选择状态**: 蜂窝图支持视觉选中状态（边框高亮）
- **工具提示**: 悬停显示详细信息

### AlertPanel 组件（告警监控）
横向标签页界面设计：
- **三类告警**: 运行告警(RUNTIME)、脆弱性(VULNERABILITY)、安全事件(SECURITY)
- **动态筛选**: 根据左侧树选择自动过滤告警数据
- **实时更新**: 支持手动刷新和连接状态显示
- **响应式设计**: 移动端隐藏描述信息

### OrganizationTree 组件（组织架构）
交互特性：
- **懒加载**: 部门节点首次展开时动态加载系统列表
- **状态管理**: 支持节点展开/折叠状态持久化
- **选择反馈**: 选中节点高亮显示
- **健康状态**: 节点显示颜色编码的健康指示器

## 开发规范指南

### 新功能开发流程
1. **模式参考**: 检查现有组件的相似模式和实现方案
2. **组件一致性**: 使用Ant Design组件库保持界面风格统一
3. **状态管理**: 遵循Redux Toolkit的状态管理模式
4. **类型安全**: 实现完整的TypeScript类型定义
5. **响应式设计**: 确保在不同屏幕尺寸下的良好表现

### CSS编码规范
```css
/* 使用App.css中定义的CSS自定义属性 */
:root {
  --primary-color: #1677ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #ff4d4f;
  --text-primary: rgba(0, 0, 0, 0.88);
  --text-secondary: rgba(0, 0, 0, 0.65);
  --background-base: #ffffff;
  --space-lg: 24px;
  --border-color: #d9d9d9;
}

/* 组件样式命名约定 */
.component-name-container { /* 组件根容器 */ }
.component-name-header { /* 组件头部 */ }
.component-name-content { /* 组件内容区 */ }
```

### 状态更新最佳实践
所有状态变更必须通过Redux actions进行：
```typescript
// 正确的状态更新方式
dispatch(setSelectedOrganization(node))
dispatch(setFilteredAssets(assets))
dispatch(setSelectedAssetId(assetId))

// 清除相关状态（重要！）
dispatch(setSelectedAssetId(null)) // 切换组织级别时清除资产选择
```

### 数据流转机制
1. **选择触发**: 树节点点击 → Redux状态更新
2. **组件响应**: 各组件通过useSelector监听状态变化
3. **界面更新**: 矩阵图和详情面板根据新状态重新渲染
4. **数据筛选**: 告警面板根据选择范围过滤显示数据

## 常用开发模式

### 条件渲染模式
```typescript
// SystemDetail组件的动态内容渲染
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

### 交互导航模式
```typescript
// 系统下钻导航
const handleSystemClick = (system: any) => {
  const systemNode = {
    id: system.id,
    name: system.name,
    type: 'system' as const,
    parentId: selectedOrganization?.id,
    children: []
  }
  dispatch(setSelectedOrganization(systemNode))

  // 获取并设置系统资产
  const systemAssets = getAllAssets().filter(asset => asset.systemId === system.id)
  dispatch(setFilteredAssets(systemAssets))
}

// 面包屑返回导航
const handleBackToSystem = () => {
  dispatch(setSelectedAssetId(null)) // 清除资产选择状态
}
```

## 关键开发注意事项

### 状态管理要点
- **资产选择清除**: 切换组织级别时必须清除`selectedAssetId`
- **选择状态一致性**: 确保视觉选择状态与Redux状态同步
- **数据筛选逻辑**: 告警和资产数据必须根据当前选择正确筛选

### D3.js组件开发
```typescript
// 正确的D3组件cleanup模式
useEffect(() => {
  // D3初始化代码

  return () => {
    // 清理事件监听器和DOM元素
    d3.select(svgRef.current).selectAll('*').remove()
  }
}, [dependencies])
```

### 响应式设计原则
- **断点设置**: 1200px、900px关键断点
- **布局适配**: 小屏幕下调整面板高度和布局方向
- **内容优化**: 移动端隐藏次要信息

## 测试检查清单
- [ ] 树导航流程（根→部门→系统→资产）
- [ ] 矩阵图交互（缩放、平移、点击）
- [ ] 告警筛选准确性（三类告警分别测试）
- [ ] 面包屑导航返回功能
- [ ] 蜂窝图选择状态高亮
- [ ] 卡片/列表视图切换
- [ ] 响应式布局适配

## 常见问题排查

### 页面空白问题
```bash
# 检查CSS变量定义
# 确保App.css中包含所有必需的CSS自定义属性
:root {
  --primary-color: #1677ff;
  --background-base: #ffffff;
  --space-lg: 24px;
  /* ... 其他变量 */
}
```

### 图标导入错误
```typescript
// 正确的图标导入方式
import {
  SecurityScanOutlined,  // 使用这个替代ShieldOutlined
  AlertOutlined,
  BugOutlined
} from '@ant-design/icons'
```

### Redux状态问题
- 使用Redux DevTools监控状态变化
- 检查action派发顺序和依赖关系
- 确认组件useSelector使用正确的状态路径

### D3渲染问题
- 确保SVG元素正确清理
- 检查数据格式和D3版本兼容性
- 验证事件监听器的正确绑定和解绑



# 开发要求

## 需求理解要求

在biz_stable/design/product_document目录下，有产品需求文档：产品设计文档.md，这个文件由我来维护，你不要进行编辑和修改。你在工作时，需要读取并充分理解文档中的角色定义、系统结构和功能结构。

另外，项目启动时，你还应该读取biz_stable/biz_info文件夹下的业务背景介绍内容：backgroud.md，确保理解相关背景信息。还应该读取已经完成开发的代码，理解之前已经设计开发的内容。



## 设计思路反馈要求

我需求你对每个功能页面的设计反馈设计思路，包括但不限于用功能框图或草图、功能描述等方式进行表达，由我来进行确认。当我确认你的设计后，需要你对每个页面生成一个设计思路文件，放置在biz_stable/design文件夹下，每个页面一个独立文件进行保存。

当对已完成的页面进行修改、重构后，都需要你更新这个页面的设计思路文档。

## 开发要求
前端的ui和ux要求，我已经写在biz_stable/design/design_document/ant-design-b2b-uiux-spec.md文件中，前端开发中，要严格遵守

