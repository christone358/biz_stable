import React from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import './AppLayout.css'

const { Header, Content } = Layout

const AppLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 菜单项配置
  const menuItems = [
    {
      key: 'health-overview',
      label: '业务健康概览',
      children: [
        {
          key: '/organization-health',
          label: '组织健康概览',
        },
        {
          key: '/business-panorama',
          label: '业务健康全景',
        },
      ],
    },
    {
      key: 'business-asset-management',
      label: '业务资产管理',
      children: [
        {
          key: '/business-management',
          label: '业务板块管理',
        },
        {
          key: '/asset-management',
          label: '业务资产管理',
        },
      ],
    },
  ]

  // 获取当前选中的菜单键
  const getSelectedKeys = () => {
    return [location.pathname]
  }

  // 菜单点击处理
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key.startsWith('/')) {
      navigate(key)
    }
  }

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="header-left">
          <div className="logo">XX市大数据中心</div>
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={getSelectedKeys()}
          onClick={handleMenuClick}
          items={menuItems}
          className="app-menu"
        />
      </Header>
      <Content className="app-content">
        <Outlet />
      </Content>
    </Layout>
  )
}

export default AppLayout
