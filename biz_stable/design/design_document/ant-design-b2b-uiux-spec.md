---
docVersion: "0.1.0"
lastUpdated: "2024-04-24"
targetAudience: ["UI Designer", "Frontend Engineer", "AI Agent"]
techStack:
  uiLibrary: "Ant Design 5.0"
  themeAlgorithm: "theme.v4Algorithm"
  navigationPattern: "Top Navigation"
  chartsLibrary: "Ant Design Charts"
scope: "B2B information systems dashboards and workflows"
---

# Ant Design V4 B2B UI/UX 设计规范

## 1. 目标与范围
- 针对使用 Ant Design 5.0、V4 主题算法和顶部导航的信息化 B2B 系统统一视觉与交互设计。
- 为人类团队与 AI 代理提供一致的 UI、UX 和数据可视化实现契约，基于 Ant Design 组件与 Ant Design Charts。
- 覆盖设计基础、布局框架、核心组件、图表默认值、交互模式、无障碍与内容语调。

## 2. 指导原则
- 保持企业级清晰度：信息密度高但层级明确，按需逐步展示详情。
- 优先使用 Ant Design Token 与组件能力，避免不必要的自定义覆写。
- 交互可预测：在导航、反馈、加载与校验上复用既有模式。
- 确保可访问性与性能达到生产标准。
- 将决策记录为机器可解析格式，支持自动化生成与校验。

## 3. 执行清单
1. 通过 `ConfigProvider` 启用 `theme.v4Algorithm`。
2. 加载本规范定义的颜色、排版、间距、阴影 Token。
3. 使用指定的顶部导航布局模板构建页面。
4. 按组件规则应用 Ant Design 默认配置与约束。
5. 使用提供的调色板与配置架构渲染 Ant Design Charts。
6. 发布前核对交互、可访问性与内容语调。

## 4. 设计基础

### 4.1 颜色系统
| Token | 值 | 用途 |
| --- | --- | --- |
| colorPrimary | #1890FF | 品牌主操作、激活状态、数据高亮 |
| colorSuccess | #52C41A | 正向反馈、成功提示 |
| colorWarning | #FAAD14 | 注意提示、待处理状态 |
| colorError | #FF4D4F | 严重告警、破坏性操作 |
| colorInfo | #1890FF | 中性信息提示 |
| colorBgBase | #FFFFFF | 主背景 |
| colorBgLayout | #F5F5F5 | 全局铺底背景 |
| colorBgContainer | #FFFFFF | 卡片、表格、弹窗容器 |
| colorText | #1F1F1F | 主文本 |
| colorTextSecondary | #595959 | 次级文本、标签 |
| colorBorder | #D9D9D9 | 分割线、输入边框 |
| colorSplit | #F0F0F0 | 细分割线 |
| colorLink | #1890FF | 文本链接 |
| colorDisabled | #BFBFBF | 禁用态 |
| chartPalette | ["#1890FF","#13C2C2","#2FC25B","#FACC14","#F04864","#8543E0","#3436C7","#223273"] | 分类图表调色板 |

#### 机器可读 Token 导出
```json
{
  "theme": {
    "algorithm": "theme.v4Algorithm",
    "tokens": {
      "colorPrimary": "#1890FF",
      "colorSuccess": "#52C41A",
      "colorWarning": "#FAAD14",
      "colorError": "#FF4D4F",
      "colorInfo": "#1890FF",
      "colorBgBase": "#FFFFFF",
      "colorBgLayout": "#F5F5F5",
      "colorBgContainer": "#FFFFFF",
      "colorText": "#1F1F1F",
      "colorTextSecondary": "#595959",
      "colorBorder": "#D9D9D9",
      "colorSplit": "#F0F0F0",
      "colorLink": "#1890FF",
      "colorDisabled": "#BFBFBF",
      "borderRadius": 4,
      "fontSize": 14,
      "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"
    }
  },
  "charts": {
    "palette": ["#1890FF", "#13C2C2", "#2FC25B", "#FACC14", "#F04864", "#8543E0", "#3436C7", "#223273"],
    "backgroundColor": "#FFFFFF",
    "gridColor": "#E5E5E5"
  }
}
```

### 4.2 字体排版
| 角色 | Token | 字号 | 字重 | 行高 | 用途 |
| --- | --- | --- | --- | --- | --- |
| 标题 H1 | fontSizeHeading1 | 32px | 600 | 40px | 页面主标题 |
| 标题 H2 | fontSizeHeading2 | 24px | 600 | 32px | 模块标题 |
| 标题 H3 | fontSizeHeading3 | 20px | 500 | 28px | 子模块标题 |
| 正文 | fontSize | 14px | 400 | 22px | 默认文本 |
| 紧凑正文 | fontSizeSM | 12px | 400 | 20px | 高密表格、脚注 |
| 代码 | fontSize | 14px | 400 | 22px | 行内代码、技术标签 |

- 字体栈：`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`。
- 数字默认使用等宽排布，在表格中设置 `font-variant-numeric: tabular-nums`。
- 受限宽度文本使用 Typography `ellipsis` 控制截断。

#### 字体 Token JSON
```json
{
  "typography": {
    "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    "heading": {
      "h1": {"fontSize": 32, "fontWeight": 600, "lineHeight": 40},
      "h2": {"fontSize": 24, "fontWeight": 600, "lineHeight": 32},
      "h3": {"fontSize": 20, "fontWeight": 500, "lineHeight": 28}
    },
    "body": {
      "default": {"fontSize": 14, "fontWeight": 400, "lineHeight": 22},
      "compact": {"fontSize": 12, "fontWeight": 400, "lineHeight": 20}
    }
  }
}
```

### 4.3 间距与布局单位
- 基础网格：4px。
- 间距刻度：0、4、8、12、16、20、24、32、40、48。
- 内容左右留白：桌面 24px、平板 16px、移动 12px。
- 垂直节奏：主模块间距 24px，次级元素间距 16px。

#### 间距 Token JSON
```json
{
  "spacing": {
    "scale": [0, 4, 8, 12, 16, 20, 24, 32, 40, 48],
    "gutter": {"desktop": 24, "tablet": 16, "mobile": 12},
    "sectionGap": {"primary": 24, "secondary": 16}
  }
}
```

### 4.4 阴影与圆角
| Token | 值 | 用途 |
| --- | --- | --- |
| shadow1 | 0 2px 8px rgba(0,0,0,0.15) | 卡片、下拉菜单 |
| shadow2 | 0 6px 16px rgba(0,0,0,0.15) | 弹窗、抽屉 |
| shadowInner | inset 0 1px 2px rgba(0,0,0,0.12) | 输入聚焦内阴影 |
| borderRadius | 4px | 默认圆角 |
| borderRadiusLG | 8px | 大面积容器 |

### 4.5 图标与图像
- 默认使用 Ant Design Icons v5 线框风格，实心图标仅用于破坏性或成功状态。
- 图标尺寸：行内 16px，按钮内 20px，空状态插画 24px。
- 空状态插画采用线性风格与中性色保持一致。

## 5. 主题与实现

### 5.1 ConfigProvider 基线配置
```tsx
import { ConfigProvider, theme } from "antd";

const AppTheme: React.FC = ({ children }) => (
  <ConfigProvider
    theme={{
      algorithm: theme.v4Algorithm,
      token: {
        colorPrimary: "#1890FF",
        borderRadius: 4,
        fontSize: 14,
        colorBgLayout: "#F5F5F5"
      },
      components: {
        Button: { controlHeight: 36, fontWeight: 500 },
        Table: { headerBg: "#F5F5F5", cellPaddingBlock: 12, cellPaddingInline: 16 },
        Layout: { headerBg: "#FFFFFF", headerHeight: 64 }
      }
    }}
  >
    {children}
  </ConfigProvider>
);
```
- 当全局 Token 无法满足需求时再扩展组件级 Token。
- 暗色模式不在本规范范围，默认均为亮色主题。

### 5.2 主题治理
- 新增 Token 必须沿用 Ant Design 命名约定。
- 每次更新记录变更日志，说明影响范围与可视差异。
- 如需兼容旧栈，可额外导出 CSS 变量。

## 6. 布局与导航

### 6.1 全局框架
- 顶部导航高度：桌面 64px、平板 56px、移动 48px。
- 头部结构：左侧 Logo（宽 ≤160px）、产品名称，中间可选页面标题，右侧放搜索、通知、用户菜单等工具。
- 背景使用 `colorBgContainer`，底部分隔线 1px `colorSplit`。
- 面包屑位于头部下方，间距 8px。
- 内容区域最大宽度 1200px，左右填充遵循间距规则。

### 6.2 二级导航与页面模板
- 二级导航优先使用 `Tabs` 安置在头部下方；层级复杂时再使用侧边 `Menu`。
- 常见页面模板：
  - 仪表盘：`Layout` + `Grid`(24 列)，卡片宽度 8/12/24 列，可在首行放 KPI 摘要。
  - 数据表格：`Layout.Content` 内顶部放筛选 `Form`，下方 `Table`，批量操作时使用底部固定操作栏。
  - 详情页：左右双列（16/8），使用锚点定位各章节。
  - 表单向导：顶部 `Steps`，主体 `Card`，底部固定操作区放主次按钮。

#### 布局 Schema JSON
```json
{
  "layout": {
    "header": {
      "height": {"desktop": 64, "tablet": 56, "mobile": 48},
      "background": "#FFFFFF",
      "borderBottom": "1px solid #F0F0F0",
      "content": ["logo", "productName", "pageTitle", "utilities"]
    },
    "content": {
      "maxWidth": 1200,
      "padding": {"desktop": 24, "tablet": 16, "mobile": 12},
      "patterns": ["dashboard", "dataTable", "detailView", "formWizard"]
    },
    "footer": {
      "height": 48,
      "background": "#FFFFFF",
      "borderTop": "1px solid #F0F0F0",
      "usage": "Action toolbar or status summary"
    }
  }
}
```

### 6.3 响应式规则
- 断点沿用 Ant Design（`xs <576`，`sm ≥576`，`md ≥768`，`lg ≥992`，`xl ≥1200`，`xxl ≥1600`）。
- 在 `md` 以下将头部工具折叠为溢出菜单。
- 表格在 `lg` 以下开启横向滚动，首列固定。
- 表单在 `sm` 以下切换为单列布局。

## 7. 组件指南

### 7.1 通用约定
- 优先使用组件 `props`，自定义样式时使用 `className`，统一前缀 `b2b-`。
- 初次加载使用 `Skeleton`，<2 秒的异步操作使用 `Spin`。
- 错误优先在组件附近提示，跨页面问题可用 `Alert` 或 `Notification`。

### 7.2 按钮
- 每个视图仅有一个主按钮。
- 次级操作使用 `default`，危险操作使用 `danger`。
- 禁用状态优先于隐藏，并用 Tooltip 说明前置条件。
- 主按钮最小宽度 96px。

### 7.3 表单
- 桌面端 `Form` 横向布局，标签列 6，控件列 14；`sm` 以下切换为垂直布局。
- 校验触发：失焦 + 提交；错误信息显示在字段下方。
- 必填项以红色星号标注，必要时在标签注明“可选”。
- 异步提交时禁用主按钮，并在按钮内显示 `Spin`。

### 7.4 表格
- 默认 `middle` 尺寸，行高 48px。
- 默认分页大小 20，支持后端排序与筛选。
- 表头与首列固定，便于阅读宽表。
- 空状态使用 `Empty` 并提供快捷操作（例如“新增记录”）。

### 7.5 卡片
- 内边距 24px，标题字重 16px 加粗。
- `extra` 区域放操作按钮，避免在底部追加主操作。

### 7.6 弹窗与抽屉
- 弹窗默认宽度 520px，按钮右对齐，先取消后主操作。
- 抽屉宽度 480px，用于上下文编辑，需提供关闭图标与取消按钮。

### 7.7 选项卡与步骤条
- 选项卡保持紧凑，最多展示 6 个标签，多余折叠在下拉中。
- 向导型步骤条在顶部，当前步骤突出显示 `colorPrimary`。

### 7.8 上传
- 批量导入使用 `Upload.Dragger`，提交前显示解析摘要。
- 在辅助文本中明确文件大小限制与可接受类型。

### 7.9 结果页与空状态
- `Result` 用于流程完成或错误边界兜底。
- `Empty` 默认用于空数据，空间受限时使用 `simple` 变体。

### 7.10 通知与提示
- 信息类事件使用 `notification.info`，持续 4 秒；重大告警需用户手动关闭。
- Toast 同屏不超过 3 个。

#### 组件默认值 JSON
```json
{
  "components": {
    "Button": {
      "primaryMinWidth": 96,
      "sizes": ["small", "middle", "large"],
      "dangerUsage": ["delete", "irreversible"]
    },
    "Form": {
      "layoutDesktop": {"labelCol": 6, "wrapperCol": 14},
      "layoutMobile": "vertical",
      "validationTrigger": ["onBlur", "onSubmit"]
    },
    "Table": {
      "size": "middle",
      "rowHeight": 48,
      "pageSize": 20,
      "features": ["stickyHeader", "stickyFirstColumn", "serverSort", "serverFilter"]
    },
    "Modal": {
      "width": 520,
      "footerOrder": ["cancel", "primary"],
      "destroyOnClose": true
    },
    "Drawer": {
      "width": 480,
      "placement": "right",
      "keyboard": true
    }
  }
}
```

## 8. 数据可视化

### 8.1 通用规则
- 使用 Ant Design Charts 预设，除非必要不直接操作 G2 底层。
- 分类调色板最多八种颜色，突出异常时按语义色覆盖。
- 坐标轴标题与单位需明确，小数位保持一致。
- 图表上方展示数据来源与最近刷新时间。

### 8.2 图表类型
- 折线/面积图：趋势类默认直线，离散变化可用阶梯线，关键阈值使用标记点。
- 柱状/条形图：间距比例 0.3，柱数 <12 时显示数值标签。
- 双轴图：用于指标相关性，需显式标注双轴刻度。
- 饼/环图：适用于 ≤6 分项的占比展示，需携带百分比图例。
- 仪表盘：用于 KPI 阈值，按成功/警告/错误色带分段。

### 8.3 状态管理
- 加载：高度 200px 的 `Skeleton` 或图表 `loading` 属性。
- 空数据：使用 `Empty`，附加过滤条件提示。
- 错误：显示 `Result`（status="error"）并提供重试。
- 无数据：轴线置灰，标注“所选区间暂无数据”。

#### 图表默认配置
```json
{
  "chartDefaults": {
    "common": {
      "autoFit": true,
      "padding": "auto",
      "legend": {"position": "top", "itemName": {"style": {"fontSize": 12, "fill": "#595959"}}},
      "tooltip": {"showMarkers": true, "shared": true, "domStyles": {"tooltip": {"fontSize": "12px"}}},
      "interactions": ["active-region", "tooltip", "legend-filter"]
    },
    "line": {
      "smooth": false,
      "point": {"size": 3, "shape": "circle"},
      "seriesField": "series",
      "color": ["#1890FF", "#13C2C2", "#2FC25B", "#FACC14"]
    },
    "column": {
      "columnWidthRatio": 0.6,
      "seriesField": "series",
      "color": ["#1890FF", "#13C2C2", "#2FC25B", "#FACC14"]
    },
    "pie": {
      "radius": 0.8,
      "innerRadius": 0.64,
      "label": {"type": "outer", "style": {"fontSize": 12, "fill": "#595959"}}
    }
  }
}
```

## 9. 交互与反馈

### 9.1 加载与异步
- 若支持回滚可考虑乐观更新，否则保持加载态并展示进度。
- 网络操作超过 5 秒需提供进度详情与联络方式。

### 9.2 校验与错误
- 字段级错误在字段下方提示，阻断流程的错误使用顶部或组件内 `Alert`。
- 服务端校验信息放在表单顶部的 `Alert` 中总结。

### 9.3 确认层级
- 高风险操作使用 `Modal.confirm`，可追加二次确认。
- 中风险操作使用 `Popconfirm`。
- 低风险操作使用行内提示或消息通知。

### 9.4 焦点与键盘
- 保留 2px `colorPrimary` 焦点高亮。
- 支持菜单、选项卡、表格的键盘导航；弹窗支持 ESC 关闭与 Enter 提交。

## 10. 无障碍与国际化
- 文本对比度至少 4.5:1，大号文本与控件至少 3:1。
- 图标按钮需提供 `aria-label` 或 `aria-labelledby`。
- 图表需附加文字摘要说明核心洞察。
- 日期时间遵循 ISO 8601，通过 `dayjs` 及语言包本地化；默认时区 UTC+8，可根据用户偏好覆盖。

## 11. 内容语调
- 语气专业、简洁、支持性，避免感叹号。
- 标题使用 Title Case，按钮语句采用祈使句（如“保存更改”）。
- 错误文案结构：发生了什么 + 影响 + 解决方式。
- Tooltip 不超过 80 字符，先名词后动作（如“导出 CSV 下载记录”）。
- 数字格式使用细空格作为千位分隔，依赖 `Intl.NumberFormat` 渲染。

## 12. 性能与质量保证
- 重型图表启用懒加载，容器可见时再渲染。
- 当表格行数 >200 时使用虚拟滚动。
- 核心模板建立自动化视觉回归，与 Token 基线对比。
- 关注核心 Web 指标与交互延迟，参考硬件 FCP <2.5s。

## 13. 治理与变更管理
- 归属团队：UX 设计组 + 前端技术小组。
- 版本遵循语义化（`v主.次.修`），新增组件升次版本，Token 微调升修订号。
- 变更流程：提出议案 → 设计评审 → 开发评审 → 合并规范并输出实施任务。
- 通过变更日志公布更新，说明影响组件与迁移建议。

## 附录 A：TypeScript 类型
```ts
export type ThemeTokens = {
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;
  colorBgBase: string;
  colorBgLayout: string;
  colorBgContainer: string;
  colorText: string;
  colorTextSecondary: string;
  colorBorder: string;
  colorSplit: string;
  colorLink: string;
  colorDisabled: string;
  borderRadius: number;
  fontSize: number;
  fontFamily: string;
};

export type LayoutPattern = "dashboard" | "dataTable" | "detailView" | "formWizard";
```

## 附录 B：示例页面结构
```tsx
import { Layout, Breadcrumb, Tabs, Space } from "antd";
import { OverviewCards } from "./OverviewCards";
import { MetricsChart } from "./MetricsChart";

export const DashboardPage = () => (
  <Layout className="b2b-shell">
    <Layout.Header className="b2b-header">
      {/* Logo + Navigation */}
    </Layout.Header>
    <Layout.Content className="b2b-content">
      <Breadcrumb items={[{ title: "Home" }, { title: "Dashboard" }]} />
      <Tabs items={[{ key: "overview", label: "Overview" }, { key: "usage", label: "Usage" }]} />
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <OverviewCards />
        <MetricsChart />
      </Space>
    </Layout.Content>
  </Layout>
);
```
