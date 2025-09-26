# XXX中心业务保障系统Demo

基于React + TypeScript + Ant Design + D3.js构建的业务健康总览页面，提供全面的业务系统监控和Mock数据可视化配置功能。

## 🎯 项目特色

### 核心功能
- **四级组织树导航** - 支持根节点→部门→系统→资产的四级层次结构
- **动态数据筛选** - 点击组织节点实时筛选对应范围的统计数据
- **KPI指标卡** - 4个核心业务指标，支持按选择范围动态计算
- **业务健康状态矩阵图** - D3.js实现的交互式矩阵可视化，支持全屏横向扩展
- **核心业务系统状态列表** - 详细的系统状态表格
- **实时告警与漏洞摘要** - WebSocket推送的告警信息
- **Mock数据可视化配置** - 灵活的数据配置管理界面

### 技术亮点
- 🚀 **现代技术栈**: React 18 + TypeScript + Vite
- 🎨 **UI组件库**: Ant Design 5.x，符合政府系统设计规范
- 📊 **数据可视化**: D3.js自定义矩阵图，支持1000+业务系统
- 🔄 **状态管理**: Redux Toolkit实现高效状态管理
- 📱 **响应式设计**: 适配多种屏幕尺寸
- 🎭 **Mock数据**: 完整的数据生成和配置系统

## 🛠️ 技术架构

```
前端技术栈
├── 基础框架: React 18 + TypeScript
├── 构建工具: Vite
├── UI组件库: Ant Design 5.x
├── 状态管理: Redux Toolkit
├── 数据可视化: D3.js + 自定义图表
├── 路由管理: React Router v6
├── 样式方案: CSS Modules + CSS变量
└── 开发工具: ESLint + TypeScript

项目结构
src/
├── components/          # 公共组件
│   ├── dashboard/      # 仪表板组件
│   │   ├── OrganizationTree/    # 组织架构树
│   │   ├── KPICards/           # KPI指标卡
│   │   ├── HealthMatrix/       # 健康状态矩阵图
│   │   ├── SystemsList/        # 系统状态列表
│   │   └── AlertPanel/         # 告警面板
│   └── common/         # 通用组件
├── pages/              # 页面组件
│   ├── dashboard/      # 仪表板页面
│   └── mock-config/    # Mock配置页面
├── store/              # Redux状态管理
├── types/              # TypeScript类型定义
├── mock/               # Mock数据
├── utils/              # 工具函数
└── assets/             # 静态资源
```

## 🚀 快速开始

### 环境要求
- Node.js 18.x+
- npm 8.x+
- 现代浏览器 (Chrome 80+、Firefox 75+、Safari 13+、Edge 80+)

### 安装和运行

```bash
# 克隆项目
cd biz_stable

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run lint:fix
```

## 📱 功能演示

### 1. 业务健康总览仪表板
- **四级组织架构**: 根节点(全部资产) → 部门节点 → 系统节点 → 资产节点
- **动态数据筛选**: 点击不同层级节点，实时切换对应范围的数据视图
- **智能展开机制**: 部门节点点击展开显示业务系统，系统节点展开显示资产
- **KPI指标监控**:
  - 业务系统总数 + 资产总数
  - 异常系统统计 (警告/故障)
  - 未处理紧急告警 (P0/P1级别)
  - 异常资产统计 (新增)
- **矩阵图可视化**: 交互式D3.js矩阵图，支持悬停详情、全屏横向扩展
- **系统状态列表**: 支持搜索、筛选、排序的详细系统信息表格
- **实时告警面板**: 模拟WebSocket推送，实时显示告警和漏洞信息

### 2. Mock数据配置管理 🔧
#### 访问入口
- **主导航**: 仪表板页面右上角 "Mock配置" 按钮
- **直接访问**: 浏览器地址 `http://localhost:3001/mock-config`
- **返回方式**: 配置页面左上角 "返回仪表板" 按钮

#### 功能特点
- **可视化配置界面**: 直观的表格形式管理Mock数据
- **数据类型支持**: 组织架构、业务系统、KPI指标、告警、漏洞等5种类型
- **JSON编辑器**: 内置语法检查的JSON数据编辑功能 (计划升级为可视化表单)
- **数据预览**: 实时预览Mock数据内容，支持大数据集截断显示
- **启用/禁用控制**: 灵活控制Mock数据的启用状态
- **批量管理**: 支持创建、编辑、删除、预览多个配置

## 🎨 设计规范

### 色彩系统
```css
/* 主题色 */
--primary-color: #1677FF;      /* 蓝色 - 主要操作和强调 */

/* 状态色 */
--success-color: #52C41A;      /* 绿色 - 健康/正常状态 */
--warning-color: #FAAD14;      /* 橙色 - 警告状态 */
--error-color: #FF4D4F;        /* 红色 - 错误/危险状态 */

/* 中性色 */
--text-primary: #262626;       /* 主要文本 */
--text-secondary: #595959;     /* 次要文本 */
--background-base: #FFFFFF;    /* 基础背景 */
--background-layout: #F5F5F5;  /* 布局背景 */
```

### 健康状态映射
- 🟢 **健康(HEALTHY)**: 系统运行正常，无告警
- 🟡 **警告(WARNING)**: 系统存在轻微问题，有低级别告警
- 🔴 **故障(CRITICAL)**: 系统存在严重问题，有高级别告警
- ⚫ **未知(UNKNOWN)**: 系统状态数据缺失或获取失败

## 📊 数据模型

### 核心类型定义
```typescript
// 业务系统
interface BusinessSystem {
  id: string
  name: string
  department: string
  importance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  healthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'UNKNOWN'
  assetCount: number
  vulnerabilityCount: number
  alertCount: number
  errorRate: number
  responseTime: number
  availability: number
}

// KPI指标
interface DashboardMetrics {
  totalSystems: number
  abnormalSystems: {
    count: number
    warningCount: number
    criticalCount: number
    rate: number
  }
  urgentAlerts: {
    total: number
    p0Count: number
    p1Count: number
  }
  criticalVulnerabilities: {
    count: number
    affectedSystems: number
    longestUnfixed: number
  }
}
```

## 🔧 开发指南

### 添加新的Mock数据类型

1. **定义类型接口**
```typescript
// src/types/index.ts
export interface NewDataType {
  id: string
  name: string
  // 其他字段...
}
```

2. **创建Mock数据生成器**
```typescript
// src/mock/data.ts
export const generateNewMockData = (): NewDataType[] => {
  // 生成逻辑...
}
```

3. **在Mock配置页面添加类型选项**
```typescript
// src/pages/mock-config/index.tsx
<Option value="newtype">新数据类型</Option>
```

### 自定义组件开发

1. **创建组件目录**
```bash
mkdir src/components/dashboard/NewComponent
```

2. **组件结构**
```
NewComponent/
├── index.tsx           # 组件主文件
├── index.css          # 组件样式
└── types.ts           # 组件类型定义 (可选)
```

3. **组件模板**
```typescript
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import './index.css'

const NewComponent: React.FC = () => {
  const { data } = useSelector((state: RootState) => state.dashboard)

  return (
    <div className="new-component">
      {/* 组件内容 */}
    </div>
  )
}

export default NewComponent
```

## 📈 性能优化

### 已实现的优化
- **虚拟滚动**: 大列表采用虚拟滚动减少DOM元素
- **Canvas渲染**: 矩阵图使用Canvas处理大量数据点
- **防抖处理**: 搜索和过滤操作防抖优化
- **代码分割**: 路由级别的懒加载
- **缓存策略**: Redux状态缓存和组件记忆化

### 性能指标
- 页面首次加载时间 < 3秒
- 矩阵图交互响应时间 < 500ms
- 支持1000+业务系统展示
- 实时数据更新间隔: 30秒

## 🔒 安全考虑

- **XSS防护**: 内容安全策略（CSP）
- **数据验证**: 前端输入验证和类型检查
- **敏感信息**: Mock数据不包含真实敏感信息
- **权限控制**: 组件级别的访问权限设计

## 📱 浏览器兼容性

| Browser | Version |
|---------|---------|
| Chrome  | 80+     |
| Firefox | 75+     |
| Safari  | 13+     |
| Edge    | 80+     |

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 使用 ESLint + Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 组件和函数添加适当的注释
- 提交信息使用语义化格式

## 📄 许可证

本项目为内部使用，未设置开源许可证。

## 📞 联系方式

如有问题或建议，请联系：
- 产品负责人：[联系方式]
- 技术负责人：[联系方式]
- 项目文档：[文档链接]

---

**注意**: 本项目为演示项目，所有数据均为Mock数据，不涉及真实业务信息。