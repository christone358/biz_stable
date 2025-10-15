import React from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { managementMenuItems } from '../../config/menu-management'
import { getCurrentSystemConfig } from '../../config/system'
import './ManagementLayout.css'

const { Header, Content } = Layout

/**
 * 系统一：业务保障管理系统布局组件
 *
 * 功能：
 * - 顶部导航栏展示系统名称
 * - 水平菜单支持二级子菜单
 * - 根据当前路由自动选中菜单项
 * - 点击菜单项导航到对应页面
 */
const ManagementLayout: React.FC = () => {
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
    <Layout className="management-layout">
      <Header className="management-header">
        <div className="header-left">
          <div className="logo">{systemConfig.name}</div>
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={getSelectedKeys()}
          onClick={handleMenuClick}
          items={managementMenuItems}
          className="management-menu"
        />
      </Header>
      <Content className="management-content">
        <Outlet />
      </Content>
    </Layout>
  )
}

export default ManagementLayout
