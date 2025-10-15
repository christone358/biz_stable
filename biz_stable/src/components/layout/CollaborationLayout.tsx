import React from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { collaborationMenuItems } from '../../config/menu-collaboration'
import { getCurrentSystemConfig } from '../../config/system'
import './CollaborationLayout.css'

const { Header, Content } = Layout

/**
 * 系统二：业务协同管理系统布局组件
 *
 * 功能：
 * - 顶部导航栏展示系统名称
 * - 水平菜单支持二级子菜单
 * - 根据当前路由自动选中菜单项
 * - 点击菜单项导航到对应页面
 */
const CollaborationLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const systemConfig = getCurrentSystemConfig()

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
    <Layout className="collaboration-layout">
      <Header className="collaboration-header">
        <div className="header-left">
          <div className="logo">{systemConfig.name}</div>
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={getSelectedKeys()}
          onClick={handleMenuClick}
          items={collaborationMenuItems}
          className="collaboration-menu"
        />
      </Header>
      <Content className="collaboration-content">
        <Outlet />
      </Content>
    </Layout>
  )
}

export default CollaborationLayout
