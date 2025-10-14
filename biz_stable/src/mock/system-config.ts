// 系统配置数据

export interface SystemConfig {
  systemName: string          // 系统名称（显示在logo位置）
}

// 从localStorage获取系统配置
export const getSystemConfig = (): SystemConfig | null => {
  const configStr = localStorage.getItem('SYSTEM_CONFIG')
  if (!configStr) {
    return null
  }

  try {
    return JSON.parse(configStr)
  } catch (e) {
    console.error('解析系统配置失败:', e)
    return null
  }
}

// 保存系统配置
export const saveSystemConfig = (config: SystemConfig) => {
  localStorage.setItem('SYSTEM_CONFIG', JSON.stringify(config))
}

// 清除系统配置
export const clearSystemConfig = () => {
  localStorage.removeItem('SYSTEM_CONFIG')
}

