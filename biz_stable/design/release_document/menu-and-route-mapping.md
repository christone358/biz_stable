# 系统菜单与页面路径映射表

## 文档说明
本文档记录了业务保障管理系统和业务协同管理系统的所有功能菜单、页面路径及开发状态。

**更新日期**: 2025-10-14
**维护规则**: 每次新增或修改功能页面时，需同步更新此文档

---

## 系统一：业务保障管理系统

### 部署信息
- **端口**: 5173 (默认开发端口)
- **路径前缀**: `/management`
- **环境变量**: `VITE_SYSTEM_TYPE=management`
- **系统名称**: 业务保障管理系统

### 功能菜单映射表

| 一级菜单 | 二级菜单 | 页面路径 | 组件路径 | 开发状态 | 备注 |
|---------|---------|---------|---------|---------|------|
| **业务全景** | | | | | |
| | 业务健康概览 | `/management/business-panorama` | `src/pages/business-panorama/index.tsx` | ✅ 已完成 | 原dashboard页面重构 |
| | 业务运行监测 | `/management/business-monitoring` | `src/pages/management/business-monitoring/index.tsx` | ⏸️ 待开发 | 业务监测画像页面 |
| **业务资产管理** | | | | | |
| | 业务板块管理 | `/management/business-management` | `src/pages/business-management/index.tsx` | ✅ 已完成 | 业务板块层级管理 |
| | 资产管理 | `/management/asset-management` | `src/pages/asset-management/index.tsx` | ✅ 已完成 | IT资产信息管理 |
| | 资产全景视图 | `/management/asset-management/panorama/:businessId` | `src/pages/asset-management/AssetPanorama.tsx` | ✅ 已完成 | 单个业务的四层资产全景视图 |
| **业务保障管理** | | | | | |
| | 资产告警监测 | `/management/alert-monitoring` | `src/pages/management/alert-monitoring/index.tsx` | ✅ 已完成 | 统一告警管理页面（从HTML迁移） |
| | 资产运营 | `/management/asset-operations` | `src/pages/management/asset-operations/index.tsx` | ⏸️ 待开发 | 无主/未知/不合规资产管理 |
| | 脆弱性管理 | `/management/vulnerability` | `src/pages/management/vulnerability/index.tsx` | ⏸️ 待开发 | 业务全局脆弱性管理 |
| **协同工作中心** | | | | | |
| | 协同任务管理 | `/management/task-management` | `src/pages/management/task-management/index.tsx` | ⏸️ 待开发 | 各类协同任务看板 |
| | 任务执行记录 | `/management/task-records` | `src/pages/management/task-records/index.tsx` | ⏸️ 待开发 | 任务全流程留痕 |

---

## 系统二：业务协同管理系统

### 部署信息
- **端口**: 5174 (开发端口)
- **路径前缀**: `/collaboration`
- **环境变量**: `VITE_SYSTEM_TYPE=collaboration`
- **系统名称**: 业务协同管理系统

### 功能菜单映射表

| 一级菜单 | 二级菜单 | 页面路径 | 组件路径 | 开发状态 | 备注 |
|---------|---------|---------|---------|---------|------|
| **业务运行保障** | | | | | |
| | 资产监测 | `/collaboration/asset-monitoring` | `src/pages/collaboration/asset-monitoring/index.tsx` | ⏸️ 待开发 | 责任范围内资产运行监测 |
| | 运行告警 | `/collaboration/runtime-alerts` | `src/pages/collaboration/runtime-alerts/index.tsx` | ⏸️ 待开发 | 责任范围内告警管理 |
| | 脆弱性 | `/collaboration/vulnerability` | `src/pages/collaboration/vulnerability/index.tsx` | ⏸️ 待开发 | 责任范围内脆弱性管理 |
| **协同任务** | | | | | |
| | 待办任务中心 | `/collaboration/todo-center` | `src/pages/collaboration/todo-center/index.tsx` | ⏸️ 待开发 | 全部类型待办工作台 |
| | 任务处置记录 | `/collaboration/task-records` | `src/pages/collaboration/task-records/index.tsx` | ⏸️ 待开发 | 协同任务处置记录 |
| **资产管理** | | | | | |
| | 资产信息管理 | `/collaboration/asset-info` | `src/pages/collaboration/asset-info/index.tsx` | ⏸️ 待开发 | 责任范围内资产信息维护 |
| | 资产异常问题处置 | `/collaboration/asset-issues` | `src/pages/collaboration/asset-issues/index.tsx` | ⏸️ 待开发 | 资产异常确认和处置 |

---

## 开发状态说明

| 状态图标 | 说明 |
|---------|------|
| ✅ 已完成 | 功能已开发完成并测试通过 |
| 🚧 开发中 | 功能正在开发中 |
| ⏸️ 待开发 | 功能规划已完成，等待开发 |
| 🔄 重构中 | 功能需要重构或优化 |
| ❌ 已废弃 | 功能已不再使用 |

---

## 路由命名规范

### 系统一（业务保障管理系统）
- **前缀**: `/management`
- **命名风格**: kebab-case（小写+连字符）
- **示例**: `/management/business-panorama`

### 系统二（业务协同管理系统）
- **前缀**: `/collaboration`
- **命名风格**: kebab-case（小写+连字符）
- **示例**: `/collaboration/asset-monitoring`

---

## 共享页面

以下页面为两个系统共用：

| 页面名称 | 路径 | 组件路径 | 说明 |
|---------|------|---------|------|
| Mock配置 | `/mock-config` | `src/pages/mock-config/index.tsx` | 数据配置管理 |
| 测试页面 | `/test` | `src/pages/test.tsx` | 开发测试页面 |

---

## 历史路由兼容

为保持向后兼容，以下旧路由会自动重定向：

| 旧路由 | 新路由 | 说明 |
|-------|--------|------|
| `/dashboard` | `/management/business-panorama` | 旧仪表板路由 |
| `/organization-health` | `/management/business-panorama` | 组织健康概览路由 |

---

## 更新日志

| 日期 | 版本 | 变更说明 | 变更人 |
|------|------|---------|--------|
| 2025-10-14 | v1.0.0 | 初始版本，建立两个系统的菜单和路由映射 | Claude |
| 2025-10-14 | v1.1.0 | 完成资产告警监测页面开发（HTML迁移） | Claude |
| 2025-10-15 | v1.2.0 | 完成资产全景视图页面开发（集成到资产管理） | Claude |

---

## 附录：页面开发检查清单

新增页面时，请确保完成以下事项：

- [ ] 在对应系统的菜单配置文件中添加菜单项
- [ ] 在App.tsx中添加路由配置
- [ ] 创建页面组件文件
- [ ] 更新本文档的映射表
- [ ] 添加页面级Redux slice（如需要）
- [ ] 编写页面设计文档（在design文件夹下）
- [ ] 确保遵循UI/UX规范
- [ ] 进行功能测试和验收
