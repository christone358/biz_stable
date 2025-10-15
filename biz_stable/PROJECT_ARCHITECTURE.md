# 项目架构说明文档

## 项目概述

本项目是一个企业级业务管理平台,包含两个主要子系统和一个数据服务,采用前后端分离架构。

## 系统组成

### 1. 业务保障管理系统 (Business Assurance Management System)

**项目名称**: biz_stable
**端口号**: 3000
**开发状态**: 已完成
**项目路径**: `/Users/chris/Documents/dev/biz/biz_stable`

**功能模块**:
- 业务全景 (Business Panorama) - 业务系统和资产的全局视图
- 业务监测 (Business Monitoring) - 单个业务系统的实时监控
- 业务板块管理 (Business Management) - 业务架构信息维护
- 资产管理 (Asset Management) - IT资产全景和依赖分析
- 告警监测 (Alert Monitoring) - 告警汇总和处理
- 资产运营 (Asset Operations) - 异常资产运营管理
- 脆弱性管理 (Vulnerability Management) - 安全漏洞跟踪处理

**技术栈**:
- React 18 + TypeScript
- Vite 5.x
- Ant Design 5.x
- Redux Toolkit
- D3.js (数据可视化)
- ECharts (图表)

**启动命令**:
```bash
cd /Users/chris/Documents/dev/biz/biz_stable
npm run dev
# 访问地址: http://localhost:3000
```

---

### 2. 业务协同管理系统 (Business Collaboration Management System)

**项目名称**: biz_collaboration (待创建)
**端口号**: 3001
**开发状态**: 规划中
**项目路径**: `/Users/chris/Documents/dev/biz/biz_collaboration` (预留)

**功能模块**: (待规划)
- 协同办公功能
- 跨部门协作
- 流程审批
- 任务管理
- (其他协同相关功能)

**技术栈**: (预计与业务保障管理系统保持一致)
- React 18 + TypeScript
- Vite 5.x
- Ant Design 5.x
- Redux Toolkit

**启动命令**: (待定)
```bash
cd /Users/chris/Documents/dev/biz/biz_collaboration
npm run dev
# 访问地址: http://localhost:3001
```

---

### 3. 数据Mock服务 (Data Mock Service)

**项目名称**: biz_mock_server (待创建)
**端口号**: 3003
**开发状态**: 规划中
**项目路径**: `/Users/chris/Documents/dev/biz/biz_mock_server` (预留)

**功能说明**:
- 为业务保障管理系统提供Mock数据API
- 为业务协同管理系统提供Mock数据API
- 统一管理测试数据和接口模拟
- 支持开发环境和测试环境

**技术选型**: (建议)
- Node.js + Express
- JSON Server
- Mock.js
- 或使用 MSW (Mock Service Worker)

**启动命令**: (待定)
```bash
cd /Users/chris/Documents/dev/biz/biz_mock_server
npm run dev
# 服务地址: http://localhost:3003
```

---

## 端口分配表

| 端口 | 系统名称 | 项目代码 | 状态 | 说明 |
|------|---------|---------|------|------|
| 3000 | 业务保障管理系统 | biz_stable | ✅ 已完成 | 监控、告警、资产管理 |
| 3001 | 业务协同管理系统 | biz_collaboration | 📋 规划中 | 协同办公、流程管理 |
| 3002 | (预留) | - | - | 未来扩展预留 |
| 3003 | 数据Mock服务 | biz_mock_server | 📋 规划中 | 统一Mock数据服务 |

---

## 项目间关系

```
┌─────────────────────────────────────────────────────────┐
│                      用户浏览器                          │
└─────────────────────────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│ 业务保障管理系统  │    │ 业务协同管理系统  │
│   (端口3000)     │    │   (端口3001)     │
│   biz_stable    │    │ biz_collaboration│
└──────────────────┘    └──────────────────┘
          │                       │
          └───────────┬───────────┘
                      ▼
            ┌──────────────────┐
            │  数据Mock服务     │
            │   (端口3003)     │
            │  biz_mock_server │
            └──────────────────┘
                      │
                      ▼
            ┌──────────────────┐
            │   Mock数据存储    │
            │  (JSON/内存)     │
            └──────────────────┘
```

---

## 开发环境配置

### 当前项目 (业务保障管理系统)

**配置文件**: `vite.config.ts`
```typescript
export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
})
```

**package.json**:
```json
{
  "name": "biz_stable",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

---

## 未来规划

### 短期目标 (1-3个月)
- [x] 完成业务保障管理系统核心功能
- [ ] 创建数据Mock服务项目
- [ ] 规划业务协同管理系统功能

### 中期目标 (3-6个月)
- [ ] 启动业务协同管理系统开发
- [ ] 完善Mock服务,支持动态数据生成
- [ ] 两个系统间的数据联动

### 长期目标 (6-12个月)
- [ ] 系统集成和统一登录
- [ ] 微前端架构改造(可选)
- [ ] 生产环境部署和运维

---

## 开发规范

### 端口使用规范

1. **固定端口**: 每个系统使用固定端口,不随意更改
2. **端口冲突**: 启动前检查端口占用,避免冲突
3. **端口预留**: 3000-3009 为本项目保留端口段
4. **文档同步**: 端口变更时及时更新本文档

### 项目命名规范

- **项目前缀**: 统一使用 `biz_` 前缀
- **命名风格**: 使用下划线命名法 (snake_case)
- **语义清晰**: 项目名称要能体现功能用途

### 代码组织规范

- **独立仓库**: 每个系统独立Git仓库
- **统一结构**: 保持相似的目录结构和代码风格
- **共享组件**: 考虑创建共享组件库 (biz_components)

---

## 常见问题 FAQ

### Q: 为什么端口从3000开始而不是8000?
A: React/Vite默认使用3000端口,保持默认配置可以减少配置复杂度。

### Q: 为什么Mock服务是3003而不是3002?
A: 3002预留给可能的其他前端系统,3003作为后端服务端口更合理。

### Q: 两个前端系统能否共用一个Mock服务?
A: 可以。Mock服务设计为统一服务,通过不同的API路径区分不同系统的数据。

### Q: 生产环境也用这些端口吗?
A: 不。生产环境会使用标准端口(80/443),这些端口仅用于开发环境。

---

**文档版本**: v1.0
**最后更新**: 2025-10-15
**维护者**: 开发团队
**更新记录**:
- 2025-10-15: 初始版本,明确三个系统的端口分配
