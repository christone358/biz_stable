# XX市大数据中心业务健康总览页 - UI/UX设计文档

## 1. 设计理念

### 1.1 设计原则
- **信息清晰**：层次分明，关键信息突出，避免视觉噪音
- **操作高效**：减少用户操作步骤，提供直观的交互反馈
- **视觉一致**：统一的设计语言和交互模式
- **专业可信**：符合政务系统的专业性和可信度要求

### 1.2 设计目标
- 支持用户快速识别系统健康状态和安全风险
- 提供清晰的视觉层次，支持不同角色用户的信息获取需求
- 确保在大屏幕环境下的良好展示效果
- 保持政府系统的专业形象和安全感

## 2. 视觉设计规范

### 2.1 色彩系统

#### 2.1.1 主色调
```css
/* 主题色 */
--primary-color: #1677FF;      /* 蓝色 - 主要操作和强调 */
--primary-hover: #4096FF;      /* 蓝色悬停态 */
--primary-active: #0958D9;     /* 蓝色激活态 */

/* 状态色 */
--success-color: #52C41A;      /* 绿色 - 健康/正常状态 */
--warning-color: #FAAD14;      /* 橙色 - 警告状态 */
--error-color: #FF4D4F;        /* 红色 - 错误/危险状态 */
--info-color: #1677FF;         /* 蓝色 - 信息提示 */

/* 中性色 */
--text-primary: #262626;       /* 主要文本 */
--text-secondary: #595959;     /* 次要文本 */
--text-disabled: #BFBFBF;      /* 禁用文本 */
--border-color: #D9D9D9;       /* 边框颜色 */
--background-base: #FFFFFF;    /* 基础背景 */
--background-layout: #F5F5F5;  /* 布局背景 */
```

#### 2.1.2 健康状态色彩映射
```css
/* 系统健康状态色彩 */
.health-healthy { color: #52C41A; }    /* 健康 - 绿色 */
.health-warning { color: #FAAD14; }    /* 警告 - 橙色 */
.health-critical { color: #FF4D4F; }   /* 危险 - 红色 */
.health-unknown { color: #BFBFBF; }    /* 未知 - 灰色 */

/* 重要性等级色彩 */
.importance-critical { background: #FFE7E7; border: 2px solid #FF4D4F; }
.importance-high { background: #FFF7E6; border: 2px solid #FAAD14; }
.importance-medium { background: #F6FFED; border: 2px solid #52C41A; }
.importance-low { background: #F5F5F5; border: 1px solid #D9D9D9; }
```

### 2.2 字体系统

#### 2.2.1 字体规范
```css
/* 字体族 */
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
               'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
--font-family-code: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono',
                    Consolas, 'Courier New', monospace;

/* 字体大小 */
--font-size-xs: 12px;          /* 辅助信息 */
--font-size-sm: 14px;          /* 正文小号 */
--font-size-base: 16px;        /* 正文基础 */
--font-size-lg: 18px;          /* 小标题 */
--font-size-xl: 20px;          /* 大标题 */
--font-size-xxl: 24px;         /* 特大标题 */

/* 字体粗细 */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

#### 2.2.2 文字层级
- **页面标题**：24px, 粗体，深色
- **区块标题**：20px, 中粗，深色
- **数据标签**：16px, 常规，深色
- **数值显示**：18px, 中粗，状态色
- **辅助信息**：14px, 常规，浅色
- **说明文字**：12px, 常规，更浅色

### 2.3 间距系统

#### 2.3.1 基础间距
```css
/* 间距变量 */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-xxl: 48px;

/* 组件间距 */
--component-margin: 24px;      /* 组件间距 */
--section-margin: 48px;        /* 区块间距 */
--page-padding: 24px;          /* 页面内边距 */
```

#### 2.3.2 网格系统
- **基础网格**：24列网格系统
- **响应断点**：1920px, 1600px, 1366px, 1024px
- **容器宽度**：最大1920px，自适应

## 3. 布局设计

### 3.1 整体布局

#### 3.1.1 布局结构
```
┌─────────────────────────────────────────────────────────┐
│                    页面标题栏                              │ 60px
├─────────────────────────────────────────────────────────┤
│  组织树导航   │              主内容区域                      │
│     300px     │                                         │
│              │  ┌─────────────────────────────────────┐  │
│  ┌─────────┐  │  │         KPI指标卡区域            │  │ 120px
│  │ 市大数据  │  │  └─────────────────────────────────────┘  │
│  │  中心   │  │  ┌─────────────────────────────────────┐  │
│  │  (25)   │  │  │                                  │  │
│  └─────────┘  │  │      业务健康状态矩阵图             │  │ 600px
│              │  │                                  │  │
│  ┌─────────┐  │  │                                  │  │
│  │ 市公安局  │  │  └─────────────────────────────────────┘  │
│  │  (12)   │  │  ┌─────────────────────────────────────┐  │
│  └─────────┘  │  │      核心业务系统状态列表            │  │ 400px
│              │  │                                  │  │
│      ...     │  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### 3.1.2 响应式适配
```css
/* 桌面端（>= 1920px） */
.dashboard-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 60px 1fr;
  gap: 0;
  height: 100vh;
}

/* 中等屏幕（1366px - 1920px） */
@media (max-width: 1920px) {
  .dashboard-container {
    grid-template-columns: 280px 1fr;
  }
}

/* 小屏幕（<= 1366px） */
@media (max-width: 1366px) {
  .dashboard-container {
    grid-template-columns: 260px 1fr;
  }

  .matrix-chart {
    height: 500px; /* 减少高度 */
  }
}
```

### 3.2 组件布局

#### 3.2.1 KPI指标卡布局
```css
.kpi-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 24px;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.kpi-card {
  padding: 24px;
  background: linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%);
  border-radius: 8px;
  border: 1px solid #F0F0F0;
  position: relative;
  overflow: hidden;
}
```

#### 3.2.2 矩阵图布局
```css
.matrix-container {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 24px;
  margin: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  height: 600px;
  position: relative;
}

.matrix-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
```

## 4. 组件设计规范

### 4.1 组织树组件

#### 4.1.1 视觉设计
```css
.org-tree {
  background: #FAFAFA;
  border-right: 1px solid #E8E8E8;
  padding: 16px 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.org-node {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #FFFFFF;
  border: 1px solid #F0F0F0;
}

.org-node:hover {
  background: #F6FFED;
  border-color: #52C41A;
  transform: translateX(4px);
}

.org-node.selected {
  background: #E6F7FF;
  border-color: #1677FF;
  box-shadow: 0 2px 4px rgba(22, 119, 255, 0.1);
}
```

#### 4.1.2 状态指示器
```css
.health-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}

.health-indicator.healthy { background-color: #52C41A; }
.health-indicator.warning { background-color: #FAAD14; }
.health-indicator.critical { background-color: #FF4D4F; }
.health-indicator.unknown { background-color: #BFBFBF; }

.system-count {
  color: #8C8C8C;
  font-size: 12px;
  margin-left: auto;
  background: #F5F5F5;
  padding: 2px 6px;
  border-radius: 10px;
}
```

### 4.2 KPI指标卡组件

#### 4.2.1 基础样式
```css
.kpi-card {
  position: relative;
  padding: 24px;
  background: #FFFFFF;
  border-radius: 8px;
  border-left: 4px solid var(--indicator-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.kpi-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--indicator-color);
  margin: 8px 0;
  font-variant-numeric: tabular-nums;
}

.kpi-label {
  font-size: 14px;
  color: #8C8C8C;
  margin-bottom: 4px;
}

.kpi-trend {
  font-size: 12px;
  color: #52C41A;
  display: flex;
  align-items: center;
}
```

#### 4.2.2 特殊样式（高危漏洞卡）
```css
.kpi-card.critical-vulnerabilities {
  background: linear-gradient(135deg, #FFF2F0 0%, #FFFFFF 100%);
  border-left-color: #FF4D4F;
  position: relative;
}

.kpi-card.critical-vulnerabilities::before {
  content: '';
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #FF4D4F;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}
```

### 4.3 矩阵图组件

#### 4.3.1 SVG样式设计
```css
.matrix-svg {
  background: #FAFAFA;
  border: 1px solid #F0F0F0;
  border-radius: 4px;
}

/* 坐标轴样式 */
.axis text {
  font-size: 12px;
  fill: #595959;
  font-family: var(--font-family);
}

.axis .domain {
  stroke: #D9D9D9;
  stroke-width: 1;
}

.axis .tick line {
  stroke: #F0F0F0;
  stroke-width: 1;
}

/* 网格线样式 */
.grid-line {
  stroke: #F5F5F5;
  stroke-width: 1;
  stroke-dasharray: 2,2;
}

/* 气泡样式 */
.system-bubble {
  cursor: pointer;
  transition: all 0.2s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.system-bubble:hover {
  stroke-width: 3;
  stroke: #1677FF;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.system-bubble.selected {
  stroke-width: 3;
  stroke: #1677FF;
  animation: selection-pulse 1s ease-in-out;
}
```

#### 4.3.2 工具提示样式
```css
.tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: #FFFFFF;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  max-width: 250px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.9) transparent transparent transparent;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
}

.tooltip-label {
  color: #BFBFBF;
}

.tooltip-value {
  color: #FFFFFF;
  font-weight: 500;
}
```

### 4.4 数据列表组件

#### 4.4.1 表格样式
```css
.systems-table {
  background: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.ant-table-thead > tr > th {
  background: #FAFAFA;
  color: #262626;
  font-weight: 600;
  border-bottom: 1px solid #F0F0F0;
  padding: 16px;
}

.ant-table-tbody > tr > td {
  padding: 16px;
  border-bottom: 1px solid #F5F5F5;
}

.ant-table-tbody > tr:hover > td {
  background: #F6FFED;
}

/* 高危行突出显示 */
.ant-table-tbody > tr.critical-row {
  background: #FFF2F0;
}

.ant-table-tbody > tr.critical-row > td {
  border-bottom: 1px solid #FFCCC7;
}
```

#### 4.4.2 状态标签样式
```css
.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

.status-tag::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
}

.status-tag.healthy {
  background: #F6FFED;
  color: #389E0D;
  border: 1px solid #D9F7BE;
}

.status-tag.healthy::before { background: #52C41A; }

.status-tag.warning {
  background: #FFFBE6;
  color: #D46B08;
  border: 1px solid #FFE58F;
}

.status-tag.warning::before { background: #FAAD14; }

.status-tag.critical {
  background: #FFF2F0;
  color: #CF1322;
  border: 1px solid #FFCCC7;
}

.status-tag.critical::before { background: #FF4D4F; }
```

## 5. 交互设计

### 5.1 交互原则
- **即时反馈**：所有交互操作提供即时视觉反馈
- **状态清晰**：明确显示当前选中状态和系统状态
- **操作可见**：重要操作按钮始终可见
- **错误处理**：友好的错误提示和恢复建议

### 5.2 关键交互流程

#### 5.2.1 组织选择流程
```
1. 用户点击组织节点
   ↓
2. 节点高亮显示选中状态
   ↓
3. 右侧内容区域显示加载状态
   ↓
4. 数据加载完成，更新显示内容
   ↓
5. 矩阵图和表格同步更新
```

#### 5.2.2 矩阵图交互流程
```
1. 用户悬停在气泡上
   ↓
2. 气泡放大，显示工具提示
   ↓
3. 工具提示显示详细信息
   ↓
4. 用户点击气泡
   ↓
5. 跳转到系统详情页面
```

### 5.3 动画效果

#### 5.3.1 基础动画
```css
/* 通用过渡动画 */
.smooth-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 悬停放大效果 */
.hover-scale:hover {
  transform: scale(1.05);
}

/* 淡入动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* 加载旋转动画 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}
```

#### 5.3.2 特殊动画效果
```css
/* 数据更新闪烁效果 */
@keyframes dataUpdate {
  0% { background-color: #E6F7FF; }
  50% { background-color: #BAE7FF; }
  100% { background-color: transparent; }
}

.data-updated {
  animation: dataUpdate 1s ease-in-out;
}

/* 告警闪烁效果 */
@keyframes alertBlink {
  0%, 50% { background-color: #FF4D4F; }
  25%, 75% { background-color: #FFCCC7; }
}

.alert-blink {
  animation: alertBlink 2s infinite;
}
```

## 6. 响应式设计

### 6.1 断点设计
```css
/* 超大屏幕 (>= 1920px) */
@media (min-width: 1920px) {
  .dashboard-container {
    max-width: 1920px;
    margin: 0 auto;
  }
}

/* 大屏幕 (1600px - 1919px) */
@media (max-width: 1919px) and (min-width: 1600px) {
  .kpi-cards {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .matrix-container {
    height: 550px;
  }
}

/* 中等屏幕 (1366px - 1599px) */
@media (max-width: 1599px) and (min-width: 1366px) {
  .kpi-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .matrix-container {
    height: 500px;
  }
}

/* 小屏幕 (< 1366px) */
@media (max-width: 1365px) {
  .dashboard-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
  }

  .org-tree {
    height: 60px;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .kpi-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### 6.2 自适应策略
- **文字缩放**：根据屏幕尺寸自动调整字体大小
- **组件重排**：小屏幕下组件重新排列
- **交互优化**：适配触摸操作和鼠标操作

## 7. 可访问性设计

### 7.1 无障碍设计
```css
/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  :root {
    --text-primary: #000000;
    --text-secondary: #1D1D1D;
    --border-color: #000000;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 焦点可见性 */
.focusable:focus {
  outline: 2px solid #1677FF;
  outline-offset: 2px;
}
```

### 7.2 语义化标记
```html
<!-- ARIA 标签示例 -->
<div role="region" aria-label="业务系统健康状态概览">
  <h2 id="matrix-title">业务健康状态矩阵图</h2>
  <div role="img" aria-labelledby="matrix-title"
       aria-describedby="matrix-description">
    <!-- 矩阵图内容 -->
  </div>
  <p id="matrix-description">
    该图表展示各业务系统的重要性和健康状态分布
  </p>
</div>
```

## 8. 性能优化

### 8.1 渲染优化
- **虚拟滚动**：长列表采用虚拟滚动减少DOM元素
- **懒加载**：图表组件按需加载
- **防抖处理**：搜索和过滤操作防抖优化

### 8.2 视觉优化
```css
/* GPU加速 */
.gpu-optimized {
  transform: translateZ(0);
  will-change: transform;
}

/* 减少重绘 */
.no-repaint {
  contain: layout style paint;
}
```

## 9. 设计交付物

### 9.1 设计规范文件
- Figma设计文件
- 组件库规范文档
- 交互原型演示
- 视觉走查清单

### 9.2 开发支持
- CSS样式库
- 图标资源包
- 设计Token配置
- 组件开发指南

## 10. 设计验证

### 10.1 可用性测试
- 用户任务完成率测试
- 界面易用性评估
- 跨浏览器兼容性测试
- 响应式设计验证

### 10.2 视觉质量检查
- 设计一致性检查
- 色彩对比度检测
- 字体渲染质量验证
- 交互动画流畅性测试