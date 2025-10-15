# 双系统菜单架构设计文档

## 1. 设计概述

本文档描述了业务保障管理系统和业务协同管理系统的双系统菜单架构设计方案。两个系统共享相同的开发规范和技术栈，但拥有独立的功能模块和导航菜单。

**设计日期**: 2025-10-14
**版本**: v1.0.0
**设计目标**:
- 实现两个独立系统的清晰功能划分
- 支持通过环境变量灵活切换系统
- 确保已有页面顺利迁移到新架构
- 遵循Ant Design B2B UI/UX设计规范

---

## 2. 系统架构设计

### 2.1 系统划分

系统按照业务职能划分为两个独立的应用：

#### 系统一：业务保障管理系统
- **目标用户**: 业务管理部门
- **核心职能**: 全局业务资产管理、业务保障、协同任务管理
- **部署端口**: 5173（默认开发端口）
- **路径前缀**: `/management`
- **环境变量**: `VITE_SYSTEM_TYPE=management`

#### 系统二：业务协同管理系统
- **目标用户**: 运维&开发单位
- **核心职能**: 责任范围内资产监测、告警处理、任务协同
- **部署端口**: 5174
- **路径前缀**: `/collaboration`
- **环境变量**: `VITE_SYSTEM_TYPE=collaboration`

### 2.2 系统切换机制

通过环境变量 `VITE_SYSTEM_TYPE` 控制启动哪个系统：

```bash
# 启动系统一（业务保障管理系统）
VITE_SYSTEM_TYPE=management npm run dev

# 启动系统二（业务协同管理系统）
VITE_SYSTEM_TYPE=collaboration npm run dev
```

`App.tsx` 根据环境变量动态加载对应的布局组件和路由配置。

---

## 3. 菜单结构设计

### 3.1 系统一菜单结构

```
业务保障管理系统
├─ 业务全景
│  ├─ 业务健康概览 [/management/business-panorama] ✅
│  └─ 业务运行监测 [/management/business-monitoring] ⏸️
├─ 业务资产管理
│  ├─ 业务板块管理 [/management/business-management] ✅
│  └─ 资产管理 [/management/asset-management] ✅
├─ 业务保障管理
│  ├─ 资产告警监测 [/management/alert-monitoring] ⏸️
│  ├─ 资产运营 [/management/asset-operations] ⏸️
│  └─ 脆弱性管理 [/management/vulnerability] ⏸️
└─ 协同工作中心
   ├─ 协同任务管理 [/management/task-management] ⏸️
   └─ 任务执行记录 [/management/task-records] ⏸️
```

### 3.2 系统二菜单结构

```
业务协同管理系统
├─ 业务运行保障
│  ├─ 资产监测 [/collaboration/asset-monitoring] ⏸️
│  ├─ 运行告警 [/collaboration/runtime-alerts] ⏸️
│  └─ 脆弱性 [/collaboration/vulnerability] ⏸️
├─ 协同任务
│  ├─ 待办任务中心 [/collaboration/todo-center] ⏸️
│  └─ 任务处置记录 [/collaboration/task-records] ⏸️
└─ 资产管理
   ├─ 资产信息管理 [/collaboration/asset-info] ⏸️
   └─ 资产异常问题处置 [/collaboration/asset-issues] ⏸️
```

**图例**: ✅ 已完成 | ⏸️ 待开发

---

## 4. 技术实现方案

### 4.1 目录结构

```
src/
├── config/
│   ├── system.ts                    # 系统配置（系统类型、端口、路径前缀）
│   ├── menu-management.ts           # 系统一菜单配置
│   └── menu-collaboration.ts        # 系统二菜单配置
├── components/
│   └── layout/
│       ├── ManagementLayout.tsx     # 系统一布局组件
│       ├── ManagementLayout.css
│       ├── CollaborationLayout.tsx  # 系统二布局组件
│       └── CollaborationLayout.css
├── pages/
│   ├── business-panorama/           # 业务健康概览
│   ├── business-management/         # 业务板块管理
│   ├── asset-management/            # 资产管理
│   └── ... (其他页面)
└── App.tsx                          # 根据系统类型加载对应路由
```

### 4.2 核心模块设计

#### 4.2.1 系统配置模块 (`config/system.ts`)

```typescript
export enum SystemType {
  MANAGEMENT = 'management',
  COLLABORATION = 'collaboration'
}

export interface SystemConfig {
  type: SystemType
  name: string
  port: number
  routePrefix: string
}

export const getCurrentSystemType = (): SystemType
export const getCurrentSystemConfig = (): SystemConfig
```

**职责**:
- 定义系统类型枚举
- 管理系统配置信息
- 提供系统类型和配置的获取方法

#### 4.2.2 菜单配置模块 (`config/menu-*.ts`)

```typescript
export type MenuItem = Required<MenuProps>['items'][number]

export const managementMenuItems: MenuItem[]
export const collaborationMenuItems: MenuItem[]
```

**职责**:
- 定义各系统的菜单结构
- 使用Ant Design Menu组件的标准数据格式
- 支持多级菜单嵌套

#### 4.2.3 布局组件 (`components/layout/*Layout.tsx`)

```typescript
const ManagementLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const systemConfig = getCurrentSystemConfig()

  return (
    <Layout>
      <Header>
        <div className="logo">{systemConfig.name}</div>
        <Menu items={managementMenuItems} />
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  )
}
```

**职责**:
- 渲染顶部导航栏和系统名称
- 处理菜单项点击导航
- 根据当前路由高亮选中菜单项
- 提供子路由渲染容器（Outlet）

### 4.3 路由配置方案

App.tsx 根据系统类型条件渲染不同的路由树：

```typescript
function App() {
  const systemType = getCurrentSystemType()

  return (
    <Routes>
      {systemType === SystemType.MANAGEMENT ? (
        <Route element={<ManagementLayout />}>
          <Route path="/management/business-panorama" element={<BusinessPanorama />} />
          {/* ...其他系统一路由 */}
        </Route>
      ) : (
        <Route element={<CollaborationLayout />}>
          <Route path="/collaboration/asset-monitoring" element={<AssetMonitoring />} />
          {/* ...其他系统二路由 */}
        </Route>
      )}
    </Routes>
  )
}
```

**特点**:
- 单一真相源：环境变量决定系统类型
- 路由隔离：两个系统的路由互不干扰
- 向后兼容：旧路由自动重定向到新路径

---

## 5. UI/UX设计规范

### 5.1 顶部导航设计

遵循 `ant-design-b2b-uiux-spec.md` 规范：

**布局结构**:
```
┌────────────────────────────────────────────────────┐
│ [Logo] 系统名称 │ 一级菜单1 │ 一级菜单2 │ ...      │
│                   └─ 二级菜单项                      │
└────────────────────────────────────────────────────┘
```

**样式规范**:
- 高度: 64px（桌面）、56px（平板）、48px（移动）
- 背景: #FFFFFF
- 底部边框: 1px solid #f0f0f0
- Logo字体: 18px / 600 weight
- 菜单项: horizontal 模式，二级菜单悬停展开

### 5.2 响应式设计

```css
/* 桌面端 (≥992px) */
.header { padding: 0 24px; }
.logo { font-size: 18px; }

/* 平板端 (768px - 991px) */
@media (max-width: 768px) {
  .header { padding: 0 16px; }
  .logo { font-size: 16px; }
}

/* 移动端 (<768px) */
@media (max-width: 576px) {
  .header { padding: 0 12px; }
  .logo { font-size: 14px; }
}
```

### 5.3 主题配置

使用 Ant Design ConfigProvider 统一配置：

```typescript
<ConfigProvider
  theme={{
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890FF',
      colorSuccess: '#52C41A',
      colorWarning: '#FAAD14',
      colorError: '#FF4D4F',
      borderRadius: 4,
      fontSize: 14
    }
  }}
>
```

---

## 6. 数据流设计

### 6.1 菜单选中状态管理

```
用户点击菜单 → 触发navigate(path) → URL更新
      ↓
location.pathname变化 → getSelectedKeys()计算
      ↓
Menu组件selectedKeys更新 → 视觉反馈高亮
```

### 6.2 系统配置获取流程

```
应用启动 → import.meta.env.VITE_SYSTEM_TYPE
      ↓
getCurrentSystemType() → 返回系统类型枚举
      ↓
getCurrentSystemConfig() → 返回系统配置对象
      ↓
Layout组件使用配置渲染UI
```

---

## 7. 路由设计规范

### 7.1 命名规范

- **前缀规则**: 系统一使用 `/management`，系统二使用 `/collaboration`
- **命名风格**: kebab-case（小写+连字符）
- **语义化**: 路径名反映功能含义

### 7.2 路由映射示例

| 功能 | 旧路径 | 新路径 | 兼容性 |
|-----|--------|--------|--------|
| 业务健康概览 | `/business-panorama` | `/management/business-panorama` | 自动重定向 |
| 业务板块管理 | `/business-management` | `/management/business-management` | 自动重定向 |
| 资产管理 | `/asset-management` | `/management/asset-management` | 自动重定向 |

### 7.3 待开发页面占位

暂未实现的功能页面使用占位组件：

```tsx
<Route
  path="/management/business-monitoring"
  element={<div>业务运行监测（待开发）</div>}
/>
```

---

## 8. 关键设计决策

### 8.1 为什么选择环境变量切换？

**优点**:
- ✅ 构建时确定系统类型，无运行时开销
- ✅ 代码分离清晰，便于独立部署
- ✅ 支持不同端口运行，避免冲突
- ✅ 易于CI/CD集成

**缺点**:
- ❌ 需要构建两次才能得到两个系统
- ❌ 无法在运行时动态切换

**权衡**: 根据产品需求，两个系统面向不同用户角色，独立部署更符合实际使用场景。

### 8.2 为什么采用顶部水平菜单？

**原因**:
- 符合Ant Design B2B规范推荐
- 适合功能模块较少的系统（3-4个一级菜单）
- 屏幕空间利用率高
- 视觉清爽，符合现代设计趋势

### 8.3 为什么保留旧路由兼容？

**原因**:
- 避免用户书签失效
- 平滑过渡，降低迁移风险
- 给予充足的适应期
- 便于渐进式重构

---

## 9. 开发指南

### 9.1 新增菜单项流程

1. 在对应的菜单配置文件中添加菜单项
2. 在 `App.tsx` 中添加路由配置
3. 创建页面组件
4. 更新 `design/release_document/menu-and-route-mapping.md`

### 9.2 新增功能页面流程

```bash
# 1. 创建页面目录和组件
mkdir -p src/pages/management/new-feature
touch src/pages/management/new-feature/index.tsx

# 2. 添加路由（在App.tsx中）
<Route path="/management/new-feature" element={<NewFeature />} />

# 3. 添加菜单项（在config/menu-management.ts中）
{ key: '/management/new-feature', label: '新功能' }

# 4. 更新文档
# 编辑 design/release_document/menu-and-route-mapping.md
```

### 9.3 启动不同系统

```bash
# 启动系统一（默认）
npm run dev

# 启动系统二
VITE_SYSTEM_TYPE=collaboration npm run dev --port 5174
```

---

## 10. 测试检查清单

### 10.1 功能测试

- [ ] 系统一：各菜单项点击导航正常
- [ ] 系统一：已完成页面渲染正常（业务健康概览、业务板块管理、资产管理）
- [ ] 系统一：菜单选中状态高亮正确
- [ ] 系统一：旧路由重定向生效
- [ ] 系统二：各菜单项点击导航正常
- [ ] 系统二：占位页面显示正常
- [ ] 系统二：菜单选中状态高亮正确
- [ ] 环境变量切换系统生效

### 10.2 UI/UX测试

- [ ] 顶部导航栏布局符合设计规范
- [ ] 系统名称显示正确
- [ ] 菜单悬停交互流畅
- [ ] 响应式布局适配（桌面/平板/移动）
- [ ] 主题色应用正确
- [ ] 字体、间距符合规范

### 10.3 兼容性测试

- [ ] 浏览器兼容（Chrome、Firefox、Safari、Edge）
- [ ] URL手动输入访问正常
- [ ] 页面刷新后状态保持
- [ ] 浏览器前进后退功能正常

---

## 11. 后续优化计划

### 11.1 短期计划（1-2周）

1. 完成系统一待开发页面：业务运行监测
2. 完善已有页面在新架构下的路由集成测试
3. 优化菜单悬停动画效果

### 11.2 中期计划（1-2个月）

1. 开发系统二全部功能页面
2. 添加面包屑导航
3. 实现菜单权限控制
4. 添加用户信息和退出功能

### 11.3 长期计划（3-6个月）

1. 支持菜单个性化配置
2. 添加最近访问和收藏功能
3. 实现跨系统页面跳转
4. 菜单搜索和快捷键支持

---

## 12. 附录

### 12.1 关键文件清单

| 文件路径 | 作用 |
|---------|------|
| `src/config/system.ts` | 系统配置管理 |
| `src/config/menu-management.ts` | 系统一菜单配置 |
| `src/config/menu-collaboration.ts` | 系统二菜单配置 |
| `src/components/layout/ManagementLayout.tsx` | 系统一布局组件 |
| `src/components/layout/CollaborationLayout.tsx` | 系统二布局组件 |
| `src/App.tsx` | 路由总配置 |
| `design/release_document/menu-and-route-mapping.md` | 菜单路由映射表 |

### 12.2 相关文档

- [产品设计文档](../product_document/产品设计文档.md)
- [UI/UX设计规范](../design_document/ant-design-b2b-uiux-spec.md)
- [菜单和路由映射表](../release_document/menu-and-route-mapping.md)
- [Claude Code开发指南](../../CLAUDE.md)

---

## 变更日志

| 日期 | 版本 | 变更内容 | 作者 |
|------|------|---------|------|
| 2025-10-14 | v1.0.0 | 初始版本，完成双系统菜单架构设计 | Claude |

---

**文档维护**: 本文档应在架构发生重大变更时及时更新。
**反馈渠道**: 如有问题或建议，请在项目Issue中提出。
