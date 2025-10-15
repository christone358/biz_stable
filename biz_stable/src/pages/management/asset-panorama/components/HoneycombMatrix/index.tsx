import React from 'react'
import { Tooltip } from 'antd'
import type { HoneycombData } from '../../types'
import './index.css'

interface HoneycombMatrixProps {
  data: HoneycombData[]
}

const HoneycombMatrix: React.FC<HoneycombMatrixProps> = ({ data }) => {
  return (
    <div className="honeycomb-container">
      <div className="honeycomb-title">资源分布</div>

      <div className="honeycomb-grid">
        {data.map((item, groupIndex) =>
          item.assets.slice(0, Math.min(item.count, 10)).map((asset, assetIndex) => (
            <Tooltip key={`${groupIndex}-${assetIndex}`} title={asset}>
              <div
                className={`hexagon ${item.status === 'abnormal' ? 'hexagon-abnormal' : ''}`}
                style={{ backgroundColor: item.color }}
              >
                <div className="hexagon-name">{asset}</div>
              </div>
            </Tooltip>
          ))
        )}
      </div>

      <div className="cell-legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: item.color }} />
            <span>{item.type} ({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HoneycombMatrix
