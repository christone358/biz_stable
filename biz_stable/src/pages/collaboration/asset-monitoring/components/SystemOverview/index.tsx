import React, { useState } from 'react'
import type { SystemOverview as SystemOverviewType } from '../../types'
import SystemCard from './SystemCard'
import './index.css'

interface SystemOverviewProps {
  systems: SystemOverviewType[]                  // 系统列表
  selectedSystemId: string | null                // 当前选中的系统ID
  onSystemSelect: (systemId: string) => void     // 系统选择回调
}

/**
 * 系统概览组件
 * 管理顶部系统健康概览区域，处理简略/卡片视图切换和系统选择
 */
const SystemOverview: React.FC<SystemOverviewProps> = ({
  systems,
  selectedSystemId,
  onSystemSelect
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleMouseEnter = () => setIsExpanded(true)
  const handleMouseLeave = () => setIsExpanded(false)

  return (
    <div
      className="system-overview-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="system-cards-wrapper">
        {systems.map(system => (
          <SystemCard
            key={system.id}
            system={system}
            isExpanded={isExpanded}
            isSelected={system.id === selectedSystemId}
            onClick={() => onSystemSelect(system.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default SystemOverview
