import React, { useState } from 'react'
import { Input, Select, Badge } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { BusinessInfo } from '../../types'
import './index.css'

interface BusinessSidebarProps {
  businesses: BusinessInfo[]
  selectedId: string
  onSelect: (business: BusinessInfo) => void
}

const BusinessSidebar: React.FC<BusinessSidebarProps> = ({
  businesses,
  selectedId,
  onSelect
}) => {
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  // 按分组组织业务
  const groupedBusinesses: Record<string, BusinessInfo[]> = {
    yiliang: [],
    duoyingyong: [],
    sizhu: [],
    yiku: []
  }

  businesses.forEach(business => {
    if (groupedBusinesses[business.group]) {
      groupedBusinesses[business.group].push(business)
    }
  })

  const groupNames: Record<string, string> = {
    yiliang: '一梁',
    duoyingyong: '多应用',
    sizhu: '四柱',
    yiku: '一库'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      normal: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f'
    }
    return colors[status] || '#52c41a'
  }

  // 过滤业务
  const filterBusinesses = (businessList: BusinessInfo[]) => {
    return businessList.filter(business => {
      const matchesSearch = business.name.toLowerCase().includes(searchText.toLowerCase())
      const matchesFilter = filterType === 'all' || business.status === filterType
      return matchesSearch && matchesFilter
    })
  }

  return (
    <div className="business-sidebar">
      {/* 搜索框 */}
      <div className="sidebar-search-box">
        <Input
          placeholder="搜索业务..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      {/* 业务列表 */}
      <div className="business-list">
        {Object.entries(groupedBusinesses).map(([groupKey, businessList]) => {
          const filteredList = filterBusinesses(businessList)
          if (filteredList.length === 0) return null

          return (
            <div key={groupKey} className="business-group">
              <div className="group-title">
                <span>{groupNames[groupKey]}</span>
              </div>
              {filteredList.map(business => (
                <div
                  key={business.id}
                  className={`business-item ${selectedId === business.id ? 'active' : ''}`}
                  onClick={() => onSelect(business)}
                >
                  <div className="business-item-content">
                    <Badge
                      color={getStatusColor(business.status)}
                      text={business.name}
                    />
                  </div>
                  <span className="business-count">{business.assetCount}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* 筛选器 */}
      <div className="sidebar-filter-box">
        <Select
          style={{ width: '100%' }}
          value={filterType}
          onChange={setFilterType}
          options={[
            { value: 'all', label: '全部业务' },
            { value: 'normal', label: '正常业务' },
            { value: 'warning', label: '告警业务' },
            { value: 'error', label: '异常业务' }
          ]}
        />
      </div>
    </div>
  )
}

export default BusinessSidebar
