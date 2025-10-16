# Mock数据架构文档

## 数据统一架构

本项目使用统一的Mock数据架构，确保以下三个页面使用同一套数据源：
1. **业务全景** (business-panorama)
2. **业务监控** (business-monitoring)
3. **资产监测** (asset-monitoring)

## 核心数据文件

### 1. unified-business-data.ts（统一数据源 ⭐️）
**作用**: 核心数据源，为所有业务系统生成完整的监控数据

**数据结构**:
```typescript
interface UnifiedBusinessData {
  system: BusinessSystem           // 系统基本信息
  monitoring: {
    kpis: {...}                    // KPI指标
    alerts: [...]                  // 告警列表
    vulnerabilities: [...]         // 脆弱性列表
    topology: {...}                // 资产拓扑
    performance: {...}             // 性能时序数据
  }
}
```

**核心函数**:
- `getUnifiedBusinessData(systemId)` - 根据系统ID获取完整监控数据
- `getAllBusinessSystemIds()` - 获取所有系统ID列表
- `clearUnifiedDataCache()` - 清除缓存

**数据生成特点**:
- 使用哈希确保数据稳定性（同一系统ID始终生成相同数据）
- 告警和脆弱性数量与system对象的alertCount/vulnerabilityCount一致
- 性能数据生成24个时序数据点（最近24小时）

### 2. data.ts（系统列表生成）
**作用**: 生成业务系统列表数据

**核心函数**:
- `generateBusinessDomainSystems()` - 生成业务全景使用的系统列表
- `generateMockSystems()` - 生成资产管理使用的系统列表
- `generateAssetsForSystem()` - 为系统生成资产列表

**业务领域结构**:
```
一梁（一级板块）
├── 一网通办门户（二级业务）
│   ├── 前端服务系统
│   ├── 业务处理平台
│   └── 数据管理系统
├── 随申办APP
└── 小程序入口

一库（一级板块）
├── 公共信息库
├── 人口信息库
└── 空间地理信息库

四柱（一级板块）
├── 统一公共支付
├── 统一身份认证
├── 统一客服
└── 统一物流快递

多应用（一级板块）
├── 创新创业一件事
├── 企业开办一件事
├── 出生一件事
├── 结婚落户一件事
├── 教育服务一件事
└── 社会保障一件事
```

### 3. business-monitoring-data.ts（监控数据适配）
**作用**: 将unified-business-data适配为business-monitoring页面所需的格式

**核心函数**:
- `generateMonitoringDataForAsset(params)` - 生成单个系统的完整监控数据

**数据流**:
```
systemId → getUnifiedBusinessData() → ApplicationMonitoringData
```

## 数据映射关系

### 系统ID映射

#### business-panorama使用的系统
```typescript
// 来自generateBusinessDomainSystems()
'SYS_PORTAL_WEB_001' → '一网通办门户前端服务系统'
'SYS_PORTAL_APP_001' → '随申办APP前端服务系统'
'SYS_AUTH_001'       → '统一身份认证前端服务系统'
// ... 等等
```

#### asset-monitoring使用的系统
```typescript
// 固定的6个核心系统（已统一使用SYS_格式ID）
'SYS_PORTAL_WEB_001'  → '一网通办门户前端服务系统'
'SYS_PORTAL_APP_001'  → '随申办APP前端服务系统'
'SYS_AUTH_001'        → '统一身份认证前端服务系统'
'SYS_PAY_001'         → '统一公共支付前端服务系统'
'SYS_DB_PUBLIC_001'   → '公共信息库前端服务系统'
'SYS_DB_POP_001'      → '人口信息库前端服务系统'
```

## 页面数据使用

### 业务全景 (business-panorama)
**使用的数据**:
- `generateBusinessDomainSystems()` - 获取所有业务系统
- `mockBusinessDomains` - 获取业务领域树结构
- `mockMetrics` - 获取KPI指标

**当前状态**: ⚠️ 未完全集成unified-business-data

### 业务监控 (business-monitoring)
**使用的数据**:
- `generateMonitoringDataForAsset()` - 获取系统监控数据
  - 内部调用 `getUnifiedBusinessData()`

**当前状态**: ✅ 已集成unified-business-data

### 资产监测 (asset-monitoring)
**使用的数据**:
- `generateSystemsOverview()` - 获取系统概览
  - 内部调用 `getUnifiedBusinessData()`
- `generateSystemMonitoringData()` - 获取系统监控数据
  - 内部调用 `generateMonitoringDataForAsset()`

**当前状态**: ✅ 已集成unified-business-data

## 数据一致性保证

### 1. 使用哈希确保稳定性
所有数据生成函数使用system ID的哈希值作为种子，确保：
- 同一系统ID总是生成相同的数据
- 刷新页面数据不会改变
- 不同页面看到的同一系统数据一致
- **已移除所有 Math.random() 调用**，所有随机数据都基于系统哈希生成
- **健康分基于实际指标计算**：错误率、响应时间、可用性、告警数、脆弱性数

### 2. 缓存机制
`unified-business-data.ts`使用缓存Map：
```typescript
let _cachedUnifiedData: Map<string, UnifiedBusinessData> | null = null
```
- 首次调用时生成所有数据并缓存
- 后续调用直接从缓存读取
- 可通过`clearUnifiedDataCache()`清除缓存

### 3. 数据关联
- system.alertCount === monitoring.alerts.length
- system.vulnerabilityCount === monitoring.vulnerabilities.length
- system.assetCount === monitoring.topology.nodes.length
- system.assets === monitoring.topology.nodes（映射关系）

## 待优化项

### 1. ~~统一系统ID体系~~ ✅ 已完成
~~当前存在两套系统ID：~~
- ~~business-panorama: `SYS_PORTAL_WEB_001`~~
- ~~asset-monitoring: `sys-1`~~

**已完成**: asset-monitoring已统一使用`SYS_`格式的系统ID，三个页面现在使用相同的ID体系。

### 2. business-panorama集成unified-business-data ⚠️
当前business-panorama仅使用`data.ts`中的系统列表，未使用监控详情数据。

**建议**: 让SystemDetail组件也使用`getUnifiedBusinessData()`

### 3. 移除重复的Mock数据 ⚠️
`business-monitoring-data.ts`中有独立定义的mock数据（mockApplicationKPIs等），这些应该被unified-business-data替代。

## 开发指南

### 添加新系统
1. 在`data.ts`的业务领域中添加系统定义
2. unified-business-data会自动为新系统生成监控数据
3. 三个页面都能看到新系统

### 修改监控数据生成逻辑
在`unified-business-data.ts`的`getUnifiedBusinessData()`函数中修改。

### 清除缓存（开发时）
```typescript
import { clearUnifiedDataCache } from '@/mock/unified-business-data'
clearUnifiedDataCache()  // 重新生成所有数据
```

## 数据生成算法

### 时序数据生成
```typescript
const generateTimeSeriesData = (
  hours: number,      // 时间跨度（小时）
  baseValue: number,  // 基准值
  variance: number,   // 方差
  systemHash: number  // 系统哈希（确保稳定性）
) => {
  // 生成24个数据点
  // 使用systemHash + index确保稳定性
}
```

### 告警数据生成
```typescript
// 数量与system.alertCount一致
for (let i = 0; i < system.alertCount; i++) {
  // 轮流分配level: urgent/warning/info
  // 轮流分配type: PERFORMANCE/SYSTEM/SECURITY/RESOURCE
  // 时间递增：现在、30分钟前、1小时前...
}
```

### 脆弱性数据生成
```typescript
// 数量与system.vulnerabilityCount一致
for (let i = 0; i < system.vulnerabilityCount; i++) {
  // 轮流分配severity: CRITICAL/HIGH/MEDIUM/LOW
  // CVSS分数基于severity: 9.5/7.5/5.5/3.5
  // CVE ID基于systemHash生成
}
```

### 健康分计算
```typescript
// 基础分100分，根据各项指标扣分
let healthScore = 100

// 错误率扣分：每0.5%扣2分，最多扣20分
healthScore -= Math.min(20, (system.errorRate / 0.5) * 2)

// 响应时间扣分：超过200ms开始扣分，每100ms扣5分，最多扣20分
if (system.responseTime > 200) {
  healthScore -= Math.min(20, ((system.responseTime - 200) / 100) * 5)
}

// 可用性扣分：低于99%开始扣分，每降低1%扣10分
if (system.availability < 99) {
  healthScore -= (99 - system.availability) * 10
}

// 告警扣分：每个告警扣2分，最多扣10分
healthScore -= Math.min(10, system.alertCount * 2)

// 脆弱性扣分：每个脆弱性扣3分，最多扣15分
healthScore -= Math.min(15, system.vulnerabilityCount * 3)

// 确保健康分在0-100之间
healthScore = Math.max(0, Math.min(100, Math.round(healthScore)))
```

**特点**：
- 每个系统的健康分基于其实际运行指标动态计算
- 确保overview卡片和详情页面显示的健康分完全一致
- 分数范围：0-100分

## 测试验证

### 验证数据一致性
```typescript
// 1. 获取同一系统的数据
const data1 = getUnifiedBusinessData('sys-1')
const data2 = getUnifiedBusinessData('sys-1')
// data1 === data2 (相同引用，来自缓存)

// 2. 验证告警数量
const system = generateBusinessDomainSystems().find(s => s.id === 'sys-1')
const unified = getUnifiedBusinessData('sys-1')
// system.alertCount === unified.monitoring.alerts.length

// 3. 跨页面验证
// business-monitoring和asset-monitoring看到的sys-1数据应该完全一致
```
