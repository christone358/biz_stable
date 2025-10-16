import React from 'react'
import { Layout, Menu, Avatar, Dropdown, Space } from 'antd'
import { UserOutlined, SwapOutlined, LogoutOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { collaborationMenuItems } from '../../config/menu-collaboration'
import { getCurrentSystemConfig, SYSTEM_CONFIGS, SystemType } from '../../config/system'
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
 * - 用户头像和系统切换功能（符合Ant Design B2B规范）
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

  // 用户菜单项配置
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'switch',
      label: '切换到业务保障管理系统',
      icon: <SwapOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ]

  // 用户菜单点击处理
  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'switch') {
      // 切换到业务保障管理系统
      const managementConfig = SYSTEM_CONFIGS[SystemType.MANAGEMENT]
      const targetUrl = `http://localhost:${managementConfig.port}${managementConfig.routePrefix}/asset-panorama`
      window.location.href = targetUrl
    } else if (key === 'logout') {
      // 退出登录，跳转到根路径
      window.location.href = '/'
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
        <div className="header-actions">
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
          >
            <div className="user-info">
              <Avatar size="small" icon={<UserOutlined />} />
              <span className="user-name">协同员</span>
            </div>
          </Dropdown>
        </div>
      </Header>
      <Content className="collaboration-content">
        <Outlet />
      </Content>
    </Layout>
  )
}

export default CollaborationLayout
