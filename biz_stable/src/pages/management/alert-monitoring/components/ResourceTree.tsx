import React from 'react'
import { Card, Checkbox } from 'antd'
import type { ResourceCategory, ResourceItem } from '../types'
import './ResourceTree.css'

interface ResourceTreeProps {
  categories: ResourceCategory[]
  onResourceChange: (categoryId: string, itemId: string, checked: boolean) => void
}

const ResourceTree: React.FC<ResourceTreeProps> = ({ categories, onResourceChange }) => {
  const handleItemClick = (categoryId: string, item: ResourceItem) => {
    onResourceChange(categoryId, item.id, !item.checked)
  }

  return (
    <Card
      title="监控对象资源目录"
      className="resource-tree-card"
      bordered={false}
    >
      <div className="resource-tree-content">
        {categories.map((category) => (
          <div key={category.id} className="resource-category">
            <div className="category-title">{category.name}</div>
            <div className="resource-list">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className={`resource-item ${item.checked ? 'active' : ''}`}
                  onClick={() => handleItemClick(category.id, item)}
                >
                  <Checkbox checked={item.checked} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default ResourceTree
