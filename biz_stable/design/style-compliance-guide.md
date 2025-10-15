# 样式规范统一化指南

## 文档信息
- **版本**: 1.0.0
- **创建日期**: 2025-10-15
- **最后更新**: 2025-10-15
- **适用范围**: 业务稳定性监控仪表板系统所有页面和组件

## 一、规范概述

本指南基于 `ant-design-b2b-uiux-spec.md` UI/UX规范，对系统所有页面样式进行了统一化处理，确保视觉一致性和用户体验的连贯性。

### 核心原则
1. **全局CSS变量优先**：所有样式值使用CSS变量，避免硬编码
2. **颜色系统统一**：严格遵循设计规范定义的颜色系统
3. **间距标准化**：基于4px网格系统，使用标准间距值
4. **响应式一致**：统一使用Ant Design断点规范
5. **阴影和圆角规范**：统一使用预定义的阴影和圆角值

## 二、全局CSS变量定义

### 2.1 颜色系统 (App.css)

```css
:root {
  /* 主题色 */
  --colorPrimary: #1890FF;      /* 品牌主操作、激活状态 */
  --colorSuccess: #52C41A;      /* 正向反馈、成功提示 */
  --colorWarning: #FAAD14;      /* 注意提示、待处理状态 */
  --colorError: #FF4D4F;        /* 严重告警、破坏性操作 */
  --colorInfo: #1890FF;         /* 中性信息提示 */

  /* 背景色 */
  --colorBgBase: #FFFFFF;       /* 主背景 */
  --colorBgLayout: #F5F5F5;     /* 全局铺底背景 */
  --colorBgContainer: #FFFFFF;  /* 卡片、表格、弹窗容器 */

  /* 文字颜色 */
  --colorText: #1F1F1F;         /* 主文本 */
  --colorTextSecondary: #595959;/* 次级文本、标签 */
  --colorDisabled: #BFBFBF;     /* 禁用态 */

  /* 边框颜色 */
  --colorBorder: #D9D9D9;       /* 分割线、输入边框 */
  --colorSplit: #F0F0F0;        /* 细分割线 */
  --colorLink: #1890FF;         /* 文本链接 */
}
```

### 2.2 间距系统

```css
:root {
  /* 基础间距 - 基于4px网格 */
  --space-0: 0;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 20px;
  --space-xxl: 24px;
  --space-xxxl: 32px;
  --space-xxxxl: 40px;
  --space-xxxxxl: 48px;

  /* 语义化间距 */
  --section-gap-primary: 24px;    /* 主模块间距 */
  --section-gap-secondary: 16px;  /* 次级元素间距 */

  /* 响应式留白 */
  --gutter-desktop: 24px;
  --gutter-tablet: 16px;
  --gutter-mobile: 12px;
}
```

### 2.3 字体系统

```css
:root {
  /* 字体族 */
  --fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                'Helvetica Neue', Arial, 'Noto Sans', sans-serif;

  /* 字号 */
  --fontSize: 14px;           /* 默认文本 */
  --fontSizeSM: 12px;         /* 高密表格、脚注 */
  --fontSizeHeading1: 32px;   /* 页面主标题 */
  --fontSizeHeading2: 24px;   /* 模块标题 */
  --fontSizeHeading3: 20px;   /* 子模块标题 */
}
```

### 2.4 圆角和阴影

```css
:root {
  /* 圆角 */
  --borderRadius: 4px;        /* 基础圆角 */
  --borderRadiusLG: 8px;      /* 大容器圆角 */

  /* 阴影 */
  --shadow1: 0 2px 8px rgba(0, 0, 0, 0.15);   /* 卡片、下拉菜单 */
  --shadow2: 0 6px 16px rgba(0, 0, 0, 0.15);  /* 弹窗、抽屉 */
}
```

## 三、页面级样式规范

### 3.1 统一的页面结构模式

所有页面遵循统一的结构模式：

```css
/* 页面容器 */
.page-container {
  padding: var(--gutter-desktop);
  background: var(--colorBgLayout);
  min-height: calc(100vh - 64px);
}

/* 页面头部 */
.page-header {
  background: var(--colorBgContainer);
  padding: var(--space-lg) var(--gutter-desktop);
  box-shadow: var(--shadow1);
  margin-bottom: var(--section-gap-primary);
}

/* 内容区域 */
.page-content {
  padding: var(--gutter-desktop);
  background: var(--colorBgLayout);
}

/* 卡片容器 */
.card-container {
  background: var(--colorBgContainer);
  border-radius: var(--borderRadiusLG);
  padding: var(--gutter-desktop);
  box-shadow: var(--shadow1);
  margin-bottom: var(--section-gap-primary);
}
```

### 3.2 已统一的页面列表

以下页面已完成样式统一化改造：

1. **告警监控页面** (`src/pages/management/alert-monitoring/`)
   - 统一背景色为 `var(--colorBgLayout)`
   - 统一间距使用标准变量
   - 统一响应式断点

2. **脆弱性管理页面** (`src/pages/management/vulnerability/`)
   - 移除硬编码颜色值
   - 统一圆角为 `var(--borderRadiusLG)`
   - 统一阴影样式

3. **业务监测页面** (`src/pages/management/business-monitoring/`)
   - 统一背景色系统
   - 统一间距规范
   - 优化响应式布局

4. **资产运营页面** (`src/pages/management/asset-operations/`)
   - 移除 `--ant-color-*` 变量，统一使用标准变量
   - 统一间距和圆角

5. **脆弱性处置页面** (`src/pages/collaboration/vulnerability/`)
   - 统一颜色系统
   - 统一字体和间距

6. **资产全景页面** (`src/pages/asset-management/AssetPanorama.css`)
   - 统一状态颜色使用CSS变量
   - 优化响应式布局

## 四、组件级样式规范

### 4.1 KPI卡片组件

```css
.kpi-card {
  border-top-width: 4px;
  border-top-style: solid;
  transition: all 0.3s;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow2);
}

/* 状态颜色 */
.kpi-card-primary { border-top-color: var(--colorPrimary); }
.kpi-card-warning { border-top-color: var(--colorWarning); }
.kpi-card-danger { border-top-color: var(--colorError); }
.kpi-card-purple { border-top-color: #722ed1; }
```

### 4.2 表格组件

```css
.table-card .ant-table-thead > tr > th {
  background-color: var(--colorBgLayout);
  font-weight: 500;
}

.table-card .ant-table-tbody > tr:hover > td {
  background-color: var(--colorBgLayout);
}
```

### 4.3 告警组件

```css
.alert-table-card {
  box-shadow: var(--shadow1);
}

.alert-table-card .ant-card-head {
  border-bottom: 1px solid var(--colorSplit);
}

.alert-table-card .ant-card-head-title {
  font-size: var(--fontSizeHeading3);
  font-weight: 600;
}
```

## 五、响应式设计规范

### 5.1 断点定义（遵循Ant Design规范）

- **xs**: < 576px（移动设备）
- **sm**: ≥ 576px（小平板）
- **md**: ≥ 768px（平板）
- **lg**: ≥ 992px（桌面）
- **xl**: ≥ 1200px（大桌面）
- **xxl**: ≥ 1600px（超大桌面）

### 5.2 统一的响应式模式

```css
/* 平板和桌面 - lg 以下 */
@media (max-width: 991px) {
  .page-header {
    padding: var(--space-lg) var(--gutter-tablet);
  }

  .page-content {
    padding: var(--gutter-tablet);
  }
}

/* 移动设备 - sm 以下 */
@media (max-width: 575px) {
  .page-header {
    padding: var(--space-md) var(--gutter-mobile);
  }

  .page-content {
    padding: var(--gutter-mobile);
  }
}
```

## 六、开发指南

### 6.1 新页面开发清单

开发新页面时，请遵循以下清单：

- [ ] 使用CSS变量定义所有颜色值
- [ ] 使用标准间距变量（`--space-*`, `--gutter-*`）
- [ ] 使用统一的圆角变量（`--borderRadius`, `--borderRadiusLG`）
- [ ] 使用统一的阴影变量（`--shadow1`, `--shadow2`）
- [ ] 使用统一的字体变量
- [ ] 实现标准的响应式断点
- [ ] 避免硬编码任何样式值

### 6.2 代码示例

**正确示例** ✅

```css
.my-component {
  background: var(--colorBgContainer);
  padding: var(--gutter-desktop);
  border-radius: var(--borderRadiusLG);
  box-shadow: var(--shadow1);
  margin-bottom: var(--section-gap-primary);
}

.my-component-title {
  font-size: var(--fontSizeHeading3);
  color: var(--colorText);
}
```

**错误示例** ❌

```css
.my-component {
  background: #ffffff;           /* 不要硬编码颜色 */
  padding: 24px;                 /* 不要硬编码间距 */
  border-radius: 8px;            /* 使用变量 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);  /* 使用变量 */
  margin-bottom: 20px;           /* 使用标准间距 */
}

.my-component-title {
  font-size: 16px;               /* 使用字体变量 */
  color: #1f1f1f;               /* 使用颜色变量 */
}
```

## 七、样式审查检查表

### 7.1 页面级审查

- [ ] 页面背景色使用 `var(--colorBgLayout)`
- [ ] 卡片背景色使用 `var(--colorBgContainer)`
- [ ] 页面间距使用 `var(--gutter-desktop/tablet/mobile)`
- [ ] 模块间距使用 `var(--section-gap-primary/secondary)`
- [ ] 所有阴影使用CSS变量
- [ ] 所有圆角使用CSS变量

### 7.2 组件级审查

- [ ] 文字颜色使用 `var(--colorText)` 或 `var(--colorTextSecondary)`
- [ ] 边框颜色使用 `var(--colorBorder)` 或 `var(--colorSplit)`
- [ ] 状态颜色使用语义变量（success/warning/error）
- [ ] 字体大小使用字体变量
- [ ] hover状态使用统一的过渡效果（`transition: all 0.3s`）

### 7.3 响应式审查

- [ ] 使用Ant Design标准断点（991px、575px等）
- [ ] 移动端使用 `var(--gutter-mobile)`
- [ ] 平板端使用 `var(--gutter-tablet)`
- [ ] 桌面端使用 `var(--gutter-desktop)`
- [ ] 注释标注 "符合 Ant Design 断点规范"

## 八、常见问题

### Q1: 什么时候使用 `--borderRadius` vs `--borderRadiusLG`?

**A:**
- `--borderRadius` (4px): 用于小组件（按钮、输入框、标签等）
- `--borderRadiusLG` (8px): 用于大容器（卡片、面板、模态框等）

### Q2: 如何选择合适的间距变量？

**A:**
- 页面级留白：使用 `--gutter-*`
- 主模块间距：使用 `--section-gap-primary` (24px)
- 次级元素间距：使用 `--section-gap-secondary` (16px)
- 元素内部间距：使用 `--space-*` 系列

### Q3: 状态颜色如何使用？

**A:**
```css
/* 成功状态 */
color: var(--colorSuccess);

/* 警告状态 */
color: var(--colorWarning);

/* 错误状态 */
color: var(--colorError);

/* 信息提示 */
color: var(--colorInfo);
```

## 九、版本历史

### v1.0.0 (2025-10-15)
- 初始版本发布
- 完成全局CSS变量定义
- 统一6个主要页面样式
- 统一多个组件样式
- 建立响应式设计规范
- 创建开发指南和检查清单

## 十、相关文档

- [Ant Design B2B UI/UX规范](./ant-design-b2b-uiux-spec.md)
- [产品设计文档](../product_document/产品设计文档.md)
- [Claude Code开发指南](../../CLAUDE.md)

---

**维护者**: AI开发团队
**审核者**: 项目负责人
**更新周期**: 每次样式规范调整后更新
