// 系统类型枚举
export enum SystemType {
  MANAGEMENT = 'management',      // 业务保障管理系统
  COLLABORATION = 'collaboration' // 业务协同管理系统
}

// 系统配置接口
export interface SystemConfig {
  type: SystemType
  name: string
  port: number
  routePrefix: string
}

// 系统配置映射
export const SYSTEM_CONFIGS: Record<SystemType, SystemConfig> = {
  [SystemType.MANAGEMENT]: {
    type: SystemType.MANAGEMENT,
    name: '业务保障管理系统',
    port: 5173,
    routePrefix: '/management'
  },
  [SystemType.COLLABORATION]: {
    type: SystemType.COLLABORATION,
    name: '业务协同管理系统',
    port: 5174,
    routePrefix: '/collaboration'
  }
}

// 获取当前系统类型（从环境变量读取）
export const getCurrentSystemType = (): SystemType => {
  const envType = import.meta.env.VITE_SYSTEM_TYPE as SystemType
  return envType || SystemType.MANAGEMENT // 默认为业务保障管理系统
}

// 获取当前系统配置
export const getCurrentSystemConfig = (): SystemConfig => {
  const type = getCurrentSystemType()
  return SYSTEM_CONFIGS[type]
}
