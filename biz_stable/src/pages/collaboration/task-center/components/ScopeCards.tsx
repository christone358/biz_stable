import React from 'react'
import { Tooltip } from 'antd'
import { AppstoreOutlined, SendOutlined, CheckCircleOutlined, ProfileOutlined } from '@ant-design/icons'

export type TicketScope = 'myTodo' | 'mySubmitted' | 'myDone' | 'all'

interface ScopeCardsProps {
  active: TicketScope
  counts: { myTodo: number; mySubmitted: number; myDone: number; all: number }
  onChange?: (scope: TicketScope) => void
}

const CARD_META: Record<TicketScope, { title: string; color: string; icon: React.ReactNode; bg: string }> = {
  myTodo: { title: '我的待办', color: '#2F54EB', icon: <ProfileOutlined />, bg: 'linear-gradient(180deg, rgba(47,84,235,0.08) 0%, rgba(47,84,235,0.02) 100%)' },
  mySubmitted: { title: '我提交的', color: '#389E0D', icon: <SendOutlined />, bg: 'linear-gradient(180deg, rgba(56,158,13,0.08) 0%, rgba(56,158,13,0.02) 100%)' },
  myDone: { title: '我的已办', color: '#FA8C16', icon: <CheckCircleOutlined />, bg: 'linear-gradient(180deg, rgba(250,140,22,0.08) 0%, rgba(250,140,22,0.02) 100%)' },
  all: { title: '全部工单', color: '#FF4D4F', icon: <AppstoreOutlined />, bg: 'linear-gradient(180deg, rgba(255,77,79,0.08) 0%, rgba(255,77,79,0.02) 100%)' },
}

const ScopeCards: React.FC<ScopeCardsProps> = ({ active, counts, onChange }) => {
  const items: TicketScope[] = ['myTodo', 'mySubmitted', 'myDone', 'all']
  return (
    <div className="scope-cards">
      {items.map(key => {
        const meta = CARD_META[key]
        const isActive = active === key
        return (
          <div
            key={key}
            className={`scope-card ${isActive ? 'active' : ''}`}
            style={{ background: meta.bg }}
            onClick={() => onChange?.(key)}
          >
            <div className="scope-card-left" style={{ background: meta.color }}>
              {meta.icon}
            </div>
            <div className="scope-card-content">
              <div className="scope-card-count">{counts[key] ?? 0}</div>
              <div className="scope-card-title">{meta.title}</div>
            </div>
            <div className="scope-card-bg-hint" />
          </div>
        )
      })}
    </div>
  )
}

export default ScopeCards

