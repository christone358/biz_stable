# 业务稳定性监控系统 - UI/UX设计规范

## 文档信息
- 版本：v2.1.0
- 创建日期：2025-09-28
- 更新日期：2025-09-28
- 文档状态：最新

## 📋 目录
1. [设计理念](#设计理念)
2. [视觉系统](#视觉系统)
3. [布局规范](#布局规范)
4. [组件设计](#组件设计)
5. [交互规范](#交互规范)
6. [响应式设计](#响应式设计)
7. [可访问性](#可访问性)
8. [动效设计](#动效设计)

## 设计理念

### 核心原则
- **信息层次清晰**：通过视觉层次突出重要信息
- **操作直观高效**：减少用户学习成本，提高操作效率
- **数据可视化**：将复杂数据转化为直观的视觉呈现
- **一致性体验**：保持界面元素和交互的一致性

### 设计目标
- **监控效率**：快速识别异常状态和关键指标
- **导航便捷**：清晰的信息架构和导航路径
- **视觉舒适**：减少长时间使用的视觉疲劳
- **扩展性强**：设计系统支持功能扩展

## 视觉系统

### 色彩规范

#### 主色调
```css
:root {
  /* 品牌色 */
  --primary-color: #1677ff;           /* 主色调：蓝色，代表稳定和信任 */
  --primary-light: #69b1ff;          /* 主色调浅色 */
  --primary-dark: #0958d9;           /* 主色调深色 */

  /* 功能色 */
  --success-color: #52c41a;          /* 成功/健康：绿色 */
  --warning-color: #faad14;          /* 警告：橙色 */
  --error-color: #ff4d4f;           /* 错误/危险：红色 */
  --info-color: #1677ff;            /* 信息：蓝色 */

  /* 健康状态色 */
  --status-healthy: #52c41a;         /* 健康：绿色 */
  --status-warning: #faad14;         /* 警告：橙色 */
  --status-critical: #ff4d4f;       /* 严重：红色 */
  --status-unknown: #8c8c8c;        /* 未知：灰色 */
}
```

#### 中性色
```css
:root {
  /* 文本色 */
  --text-primary: rgba(0, 0, 0, 0.88);      /* 主要文本 */
  --text-secondary: rgba(0, 0, 0, 0.65);    /* 次要文本 */
  --text-disabled: rgba(0, 0, 0, 0.25);     /* 禁用文本 */
  --text-inverse: #ffffff;                   /* 反色文本 */

  /* 背景色 */
  --background-base: #ffffff;                /* 基础背景 */
  --background-layout: #f5f5f5;             /* 布局背景 */
  --background-container: #fafafa;          /* 容器背景 */
  --background-elevated: #ffffff;           /* 悬浮背景 */

  /* 边框色 */
  --border-color: #d9d9d9;                  /* 默认边框 */
  --border-light: #f0f0f0;                  /* 浅色边框 */
  --border-dark: #bfbfbf;                   /* 深色边框 */
}
```

### 字体规范

#### 字体族
```css
:root {
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
                'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
                'Noto Color Emoji';
  --font-family-mono: 'SFMono-Regular', Consolas, 'Liberation Mono',
                      Menlo, Courier, monospace;
}
```

#### 字体规模
```css
:root {
  /* 标题字体 */
  --font-size-h1: 32px;      /* 页面主标题 */
  --font-size-h2: 24px;      /* 区域标题 */
  --font-size-h3: 20px;      /* 卡片标题 */
  --font-size-h4: 16px;      /* 组件标题 */
  --font-size-h5: 14px;      /* 小标题 */

  /* 正文字体 */
  --font-size-base: 14px;    /* 基础字体 */
  --font-size-large: 16px;   /* 大号正文 */
  --font-size-small: 12px;   /* 小号正文 */
  --font-size-mini: 10px;    /* 微型字体 */

  /* 字重 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### 间距规范
```css
:root {
  /* 基础间距单位：8px */
  --space-xs: 4px;           /* 0.5 * 8px */
  --space-sm: 8px;           /* 1 * 8px */
  --space-md: 16px;          /* 2 * 8px */
  --space-lg: 24px;          /* 3 * 8px */
  --space-xl: 32px;          /* 4 * 8px */
  --space-xxl: 48px;         /* 6 * 8px */

  /* 组件内间距 */
  --padding-xs: 4px 8px;
  --padding-sm: 8px 12px;
  --padding-md: 12px 16px;
  --padding-lg: 16px 24px;
  --padding-xl: 20px 32px;
}
```

### 阴影规范
```css
:root {
  /* 阴影层级 */
  --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.03),
              0 1px 6px -1px rgba(0, 0, 0, 0.02),
              0 2px 4px rgba(0, 0, 0, 0.02);

  --shadow-2: 0 1px 2px rgba(0, 0, 0, 0.03),
              0 1px 6px -1px rgba(0, 0, 0, 0.02),
              0 2px 4px rgba(0, 0, 0, 0.02);

  --shadow-3: 0 4px 12px rgba(0, 0, 0, 0.15);

  --shadow-4: 0 6px 16px rgba(0, 0, 0, 0.08),
              0 3px 6px -4px rgba(0, 0, 0, 0.12),
              0 9px 28px 8px rgba(0, 0, 0, 0.05);
}
```

## 布局规范

### 整体布局
```
┌─────────────────────────────────────────────────────────┐
│                    页面头部 (60px)                       │
│  XX市大数据中心业务健康总览页        [Mock配置] [实时监控] │
├─────────────────────────────────────────────────────────┤
│                   KPI卡片区 (120px)                     │
│  [系统总数] [异常系统] [紧急告警] [异常资产]             │
├─────────┬─────────────────────┬─────────────────────────┤
│ 组织树  │     健康矩阵图      │     系统详情面板        │
│(200px)  │                     │                         │
│         │                     │                         │
│         │     (600px高)       │     (600px高)           │
│         │                     │                         │
├─────────┴─────────────────────┴─────────────────────────┤
│                  告警监控面板 (300px)                   │
│  [运行告警] [脆弱性] [安全事件]                          │
└─────────────────────────────────────────────────────────┘
```

### 栅格系统
```css
.dashboard-layout {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  grid-template-columns: 200px 1fr;
  height: 100vh;
  gap: 0;
}

.dashboard-header {
  grid-column: 1 / -1;
  height: 60px;
}

.kpi-section {
  grid-column: 1 / -1;
  height: 120px;
}

.main-content {
  grid-column: 2;
  display: grid;
  grid-template-rows: 1fr auto;
  gap: var(--space-lg);
}

.middle-section {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--space-lg);
}
```

## 组件设计

### 1. 组织架构树

#### 视觉层次
```css
.tree-node {
  /* 基础样式 */
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;

  /* 层级缩进 */
  &.level-0 { padding-left: 12px; }
  &.level-1 { padding-left: 32px; }
  &.level-2 { padding-left: 52px; }
  &.level-3 { padding-left: 72px; }
}

/* 选中状态 */
.tree-node.selected {
  background-color: rgba(22, 119, 255, 0.1);
  border-left: 3px solid var(--primary-color);
}

/* 悬停状态 */
.tree-node:hover {
  background-color: #f5f5f5;
}
```

#### 图标系统
```tsx
const getNodeIcon = (node: OrganizationNode) => {
  const iconMap = {
    root: <FolderOpenOutlined style={{ color: '#1677ff' }} />,
    department: <FolderOutlined style={{ color: '#52c41a' }} />,
    system: <DatabaseOutlined style={{ color: '#faad14' }} />,
    asset: <HddOutlined style={{ color: '#8c8c8c' }} />
  }
  return iconMap[node.type]
}
```

#### 健康状态指示器
```css
.health-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;

  &.healthy { background-color: var(--status-healthy); }
  &.warning { background-color: var(--status-warning); }
  &.critical {
    background-color: var(--status-critical);
    animation: pulse 2s infinite;
  }
  &.unknown { background-color: var(--status-unknown); }
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
```

### 2. KPI指标卡片

#### 卡片布局
```css
.kpi-card {
  background: var(--background-base);
  border-radius: 8px;
  padding: var(--space-lg);
  box-shadow: var(--shadow-2);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--shadow-3);
    transform: translateY(-2px);
  }
}

.kpi-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;

  &.primary { background-color: rgba(22, 119, 255, 0.1); color: var(--primary-color); }
  &.warning { background-color: rgba(250, 173, 20, 0.1); color: var(--warning-color); }
  &.error { background-color: rgba(255, 77, 79, 0.1); color: var(--error-color); }
  &.success { background-color: rgba(82, 196, 26, 0.1); color: var(--success-color); }
}

.kpi-value {
  font-size: 32px;
  font-weight: var(--font-weight-bold);
  line-height: 1;
  margin-bottom: 4px;
}

.kpi-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}
```

### 3. 健康矩阵图

#### SVG样式规范
```css
.matrix-svg {
  background: #fafafa;
  border: 1px solid var(--border-light);
  border-radius: 4px;
}

/* 矩阵气泡 */
.system-bubble {
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
    transform: scale(1.1);
  }
}

/* 蜂窝图形 */
.hexagon {
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    stroke-width: 2;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  &.selected {
    stroke: var(--primary-color);
    stroke-width: 3;
    filter: drop-shadow(0 0 8px rgba(22, 119, 255, 0.5));
  }
}

/* 工具提示 */
.matrix-tooltip {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  max-width: 250px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

### 4. 系统详情面板

#### 面板切换
```css
.system-detail-container {
  height: 100%;
  padding: var(--space-lg);
  background: var(--background-base);
  border-radius: 8px;
  box-shadow: var(--shadow-1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-color);
}
```

#### 视图切换控件
```css
.view-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  .ant-switch {
    &.ant-switch-checked {
      background-color: var(--primary-color);
    }
  }
}
```

#### 卡片视图
```css
.systems-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
  max-height: 450px;
  overflow-y: auto;
}

.system-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: var(--space-md);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(22, 119, 255, 0.15);
    transform: translateY(-2px);
  }
}
```

#### 面包屑导航
```css
.breadcrumb-link {
  color: var(--primary-color);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
  padding: 2px 6px;
  margin: -2px -6px;

  &:hover {
    background-color: rgba(22, 119, 255, 0.1);
    text-decoration: underline;
  }
}

.breadcrumb-separator {
  color: var(--text-secondary);
  font-weight: 400;
  margin: 0 8px;
}
```

### 5. 告警监控面板

#### 标签页设计
```css
.alert-panel-container {
  height: 300px;
  background: var(--background-base);
  border-radius: 8px;
  box-shadow: var(--shadow-1);

  .ant-tabs {
    height: 100%;

    .ant-tabs-tab {
      padding: 8px 12px;

      .ant-badge {
        margin-left: 4px;

        .ant-badge-count {
          background-color: var(--primary-color);
          font-size: 10px;
          min-width: 16px;
          height: 16px;
          line-height: 16px;
        }
      }
    }
  }
}
```

#### 告警项样式
```css
.alert-item {
  padding: var(--space-sm) 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(22, 119, 255, 0.02);
  }
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.alert-title {
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.alert-time {
  font-size: 12px;
  color: var(--text-secondary);
}
```

## 交互规范

### 点击反馈
```css
.clickable {
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}
```

### 选中状态
```css
.selectable {
  position: relative;

  &.selected::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: var(--primary-color);
    border-radius: 0 2px 2px 0;
  }
}
```

### 加载状态
```css
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;

  .ant-spin {
    .ant-spin-dot {
      .ant-spin-dot-item {
        background-color: var(--primary-color);
      }
    }
  }
}
```

### 悬停效果
```css
.hoverable {
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--shadow-3);
    transform: translateY(-2px);
  }
}
```

## 响应式设计

### 断点系统
```css
/* 断点定义 */
:root {
  --breakpoint-xs: 480px;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-xxl: 1600px;
}

/* 媒体查询 */
@media (max-width: 1200px) {
  .dashboard-layout {
    grid-template-columns: 200px 1fr;
  }

  .systems-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto 1fr;
  }

  .dashboard-sider {
    order: 3;
  }

  .middle-section {
    grid-template-columns: 1fr;
  }

  .alert-description {
    display: none;
  }
}

@media (max-width: 600px) {
  .kpi-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
  }

  .kpi-value {
    font-size: 24px;
  }

  .node-stats {
    display: none;
  }
}
```

### 移动端适配
```css
@media (max-width: 480px) {
  .dashboard-header {
    padding: var(--space-sm);

    h1 {
      font-size: 18px;
    }

    .header-actions {
      display: none;
    }
  }

  .kpi-cards {
    grid-template-columns: 1fr;
    gap: var(--space-xs);
  }

  .tree-node {
    padding: var(--space-xs) var(--space-sm);

    .node-stats {
      display: none;
    }
  }
}
```

## 可访问性

### 键盘导航
```css
.focusable {
  &:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 4px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
}
```

### ARIA标签
```tsx
// 组织树节点
<div
  role="treeitem"
  aria-expanded={node.isExpanded}
  aria-selected={isSelected}
  aria-label={`${node.name}, ${node.type}, 健康状态: ${node.healthStatus}`}
  tabIndex={0}
>

// 健康状态指示器
<div
  className="health-indicator"
  aria-label={`健康状态: ${healthStatus}`}
  role="status"
>

// 告警计数
<Badge
  count={alertCount}
  aria-label={`${alertCount}个告警`}
>
```

### 颜色对比度
```css
/* 确保文本对比度达到WCAG AA标准 */
.high-contrast {
  --text-primary: #000000;
  --text-secondary: #333333;
  --border-color: #666666;
}

/* 色盲友好的状态色 */
.colorblind-friendly {
  --status-healthy: #2ecc71;    /* 绿色 + 形状标识 */
  --status-warning: #f39c12;    /* 橙色 + 三角形 */
  --status-critical: #e74c3c;   /* 红色 + X标识 */
  --status-unknown: #95a5a6;    /* 灰色 + ?标识 */
}
```

## 动效设计

### 过渡效果
```css
/* 基础过渡 */
.smooth-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 弹性过渡 */
.elastic-transition {
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 缓入缓出 */
.ease-in-out {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 进入动画
```css
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

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}
```

### 交互动画
```css
/* 点击波纹效果 */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.ripple-effect {
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(22, 119, 255, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  }
}

/* 加载骨架屏 */
@keyframes skeleton-loading {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
  background-size: 200px 100%;
  animation: skeleton-loading 1.5s infinite;
}
```

---

## 📚 相关文档
- [功能更新文档](./功能更新文档.md)
- [技术架构文档](./技术架构文档.md)
- [接口规范文档](./接口规范文档.md)
- [产品需求文档PRD](./产品需求文档PRD.md)
- [开发指南](../CLAUDE.md)

---

**设计原则**: 所有UI/UX设计应遵循本规范，确保用户体验的一致性和专业性