import React, { useState, useMemo } from 'react'
import { Input } from 'antd'
import { SearchOutlined, DatabaseOutlined } from '@ant-design/icons'
import { BusinessInfo } from '../../types'
import './index.css'

interface BusinessSelectorProps {
  businesses: BusinessInfo[]
  selectedBusinessId: string | null
  onSelect: (business: BusinessInfo) => void
}

const BusinessSelector: React.FC<BusinessSelectorProps> = ({
  businesses,
  selectedBusinessId,
  onSelect
}) => {
  const [searchKeyword, setSearchKeyword] = useState('')

  // 筛选业务列表
  const filteredBusinesses = useMemo(() => {
    if (!searchKeyword.trim()) {
      return businesses
    }
    const keyword = searchKeyword.toLowerCase()
    return businesses.filter(
      b =>
        b.name.toLowerCase().includes(keyword) ||
        b.code.toLowerCase().includes(keyword)
    )
  }, [businesses, searchKeyword])

  return (
    <div className="business-selector">
      <div className="business-selector-header">
        <div className="business-selector-title">业务选择</div>
        <Input
          className="business-selector-search"
          placeholder="搜索业务"
          prefix={<SearchOutlined />}
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          allowClear
        />
      </div>

      <div className="business-selector-list">
        {filteredBusinesses.length === 0 ? (
          <div className="business-selector-empty">
            {searchKeyword ? '未找到匹配的业务' : '暂无业务数据'}
          </div>
        ) : (
          filteredBusinesses.map(business => (
            <div
              key={business.id}
              className={`business-selector-item ${
                selectedBusinessId === business.id ? 'active' : ''
              }`}
              onClick={() => onSelect(business)}
            >
              <div className="business-selector-item-name">{business.name}</div>
              <div className="business-selector-item-info">
                <span className="business-selector-item-code">{business.code}</span>
                <span className="business-selector-item-count">
                  <DatabaseOutlined />
                  {business.assetCount}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BusinessSelector
