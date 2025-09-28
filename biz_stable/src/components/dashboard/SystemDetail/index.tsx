import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, List, Tag, Empty, Descriptions, Avatar, Progress, Badge, Space, Switch } from 'antd'
import { UserOutlined, SafetyOutlined, ExclamationCircleOutlined, BugOutlined, SecurityScanOutlined } from '@ant-design/icons'
import { RootState } from '../../../store'
import { setSelectedOrganization, setFilteredAssets } from '../../../store/slices/dashboardSlice'
import { generateMockSystems, getAllAssets } from '../../../mock/data'
import './index.css'

const SystemDetail: React.FC = () => {
  const dispatch = useDispatch()
  const { selectedOrganization, filteredAssets, selectedDepartmentId, systems, selectedAssetId } = useSelector((state: RootState) => state.dashboard)
  const [viewMode, setViewMode] = React.useState<'list' | 'card'>('card')

  // 处理返回到系统视图
  const handleBackToSystem = () => {
    // 清除资产选择状态
    dispatch(setSelectedAssetId(null))
  }

  // 处理系统卡片点击，下钻到系统详情
  const handleSystemClick = (system: any) => {
    // 创建系统节点
    const systemNode = {
      id: system.id,
      name: system.name,
      type: 'system' as const,
      parentId: selectedOrganization?.id,
      children: []
    }

    // 设置选中的系统
    dispatch(setSelectedOrganization(systemNode))

    // 获取该系统的资产数据并设置
    const allAssets = getAllAssets()
    const systemAssets = allAssets.filter(asset => asset.systemId === system.id)
    dispatch(setFilteredAssets(systemAssets))
  }

  // 根据选择状态决定显示内容
  const displayContent = useMemo(() => {
    // 优先检查蜂窝图资产选择 - 只有当有明确的selectedAssetId时才显示资产详情
    if (selectedAssetId && filteredAssets.length > 0) {
      const selectedAsset = filteredAssets.find(asset => asset.id === selectedAssetId)
      if (selectedAsset) {
        return { type: 'assetDetail', data: selectedAsset }
      }
    }

    if (!selectedOrganization) {
      return { type: 'empty', data: null }
    }

    if (selectedOrganization.type === 'root') {
      // 根节点：显示业务系统整体状态列表
      const allSystems = generateMockSystems()
      return { type: 'systemsList', data: allSystems }
    }

    if (selectedOrganization.type === 'department') {
      // 部门节点：显示该部门的资产健康状态（可切换列表/卡片）
      const departmentSystems = systems.filter(sys => sys.departmentId === selectedOrganization.id)
      return { type: 'departmentSystems', data: departmentSystems }
    }

    if (selectedOrganization.type === 'system') {
      // 系统节点：显示选中系统的详细信息
      const systemDetail = systems.find(sys => sys.id === selectedOrganization.id) ||
                           generateMockSystems().find(sys => sys.id === selectedOrganization.id)
      return { type: 'systemDetail', data: systemDetail }
    }

    if (selectedOrganization.type === 'asset' && filteredAssets.length > 0) {
      // 资产节点：显示具体资产的信息
      return { type: 'assetDetail', data: filteredAssets[0] }
    }

    return { type: 'empty', data: null }
  }, [selectedOrganization, filteredAssets, systems, selectedDepartmentId, selectedAssetId])

  const renderSystemsList = (systemsList: any[]) => (
    <div className="systems-overview">
      <div className="panel-header">
        <h4>业务系统状态概览</h4>
        <Badge count={systemsList.length} showZero color="#1677FF" />
      </div>
      <List
        size="small"
        dataSource={systemsList}
        renderItem={(system) => (
          <List.Item className="system-item">
            <div className="system-basic-info">
              <div className="system-name">{system.name}</div>
              <div className="system-department">{system.department}</div>
            </div>
            <div className="system-status">
              <Tag color={system.healthStatus === 'HEALTHY' ? 'green' :
                          system.healthStatus === 'WARNING' ? 'orange' : 'red'}>
                {system.healthStatus === 'HEALTHY' ? '健康' :
                 system.healthStatus === 'WARNING' ? '警告' : '故障'}
              </Tag>
            </div>
          </List.Item>
        )}
      />
    </div>
  )

  const renderDepartmentSystems = (departmentSystems: any[]) => (
    <div className="department-systems">
      <div className="panel-header">
        <h4>{selectedOrganization?.name} - 系统状态</h4>
        <Space>
          <span>视图模式:</span>
          <Switch
            checked={viewMode === 'card'}
            onChange={(checked) => setViewMode(checked ? 'card' : 'list')}
            checkedChildren="卡片"
            unCheckedChildren="列表"
          />
        </Space>
      </div>

      {viewMode === 'list' ? (
        <List
          size="small"
          dataSource={departmentSystems}
          renderItem={(system) => (
            <List.Item
              className="department-system-item"
              style={{ cursor: 'pointer' }}
              onClick={() => handleSystemClick(system)}
            >
              <div className="system-info">
                <div className="system-name">{system.name}</div>
                <Tag color={system.healthStatus === 'HEALTHY' ? 'green' :
                            system.healthStatus === 'WARNING' ? 'orange' : 'red'}>
                  {system.healthStatus === 'HEALTHY' ? '健康' :
                   system.healthStatus === 'WARNING' ? '警告' : '故障'}
                </Tag>
              </div>
              <div className="system-stats">
                <span>资产: {system.assetCount}</span>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <div className="systems-cards">
          {departmentSystems.map((system) => (
            <Card
              key={system.id}
              size="small"
              className="system-card"
              style={{ cursor: 'pointer' }}
              onClick={() => handleSystemClick(system)}
            >
              <div className="card-header">
                <div className="system-name">{system.name}</div>
                <Tag color={system.healthStatus === 'HEALTHY' ? 'green' :
                            system.healthStatus === 'WARNING' ? 'orange' : 'red'}>
                  {system.healthStatus === 'HEALTHY' ? '健康' :
                   system.healthStatus === 'WARNING' ? '警告' : '故障'}
                </Tag>
              </div>
              <div className="card-stats">
                <div className="stat-row">
                  <UserOutlined /> 资产: {system.assetCount}个
                </div>
                <div className="stat-row">
                  <ExclamationCircleOutlined /> 告警: {system.alertCount}条
                </div>
                <div className="stat-row">
                  <BugOutlined /> 漏洞: {system.vulnerabilityCount}个
                </div>
                <div className="stat-row">
                  <SecurityScanOutlined /> 安全事件: {Math.floor(Math.random() * 3)}个
                </div>
                <div className="stat-row">
                  错误率: {system.errorRate?.toFixed(2)}%
                </div>
                <div className="stat-row">
                  响应时间: {system.responseTime}ms
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderSystemDetail = (system: any) => (
    <div className="system-detail">
      <div className="panel-header">
        <h4>{system.name}</h4>
        <Tag color={system.healthStatus === 'HEALTHY' ? 'green' :
                    system.healthStatus === 'WARNING' ? 'orange' : 'red'}>
          {system.healthStatus === 'HEALTHY' ? '健康' :
           system.healthStatus === 'WARNING' ? '警告' : '故障'}
        </Tag>
      </div>

      <Descriptions size="small" column={1} className="system-descriptions">
        <Descriptions.Item label="系统名称">{system.name}</Descriptions.Item>
        <Descriptions.Item label="归属部门">{system.department}</Descriptions.Item>
        <Descriptions.Item label="责任人">
          <Space>
            <Avatar size="small" icon={<UserOutlined />} />
            张三
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="重要程度">
          <Tag color={system.importance === 'CRITICAL' ? 'red' :
                      system.importance === 'HIGH' ? 'orange' :
                      system.importance === 'MEDIUM' ? 'blue' : 'default'}>
            {system.importance === 'CRITICAL' ? '关键' :
             system.importance === 'HIGH' ? '重要' :
             system.importance === 'MEDIUM' ? '一般' : '较低'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="健康度">
          <Progress
            percent={system.healthStatus === 'HEALTHY' ? 95 :
                     system.healthStatus === 'WARNING' ? 70 : 40}
            size="small"
            status={system.healthStatus === 'HEALTHY' ? 'success' :
                    system.healthStatus === 'WARNING' ? 'active' : 'exception'}
          />
        </Descriptions.Item>
        <Descriptions.Item label="资产数量">{system.assetCount} 个</Descriptions.Item>
        <Descriptions.Item label="错误率">{system.errorRate?.toFixed(2)}%</Descriptions.Item>
        <Descriptions.Item label="响应时间">{system.responseTime}ms</Descriptions.Item>
        <Descriptions.Item label="可用性">{system.availability?.toFixed(1)}%</Descriptions.Item>
      </Descriptions>

      <div className="system-alerts-summary">
        <h5>告警概览</h5>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div className="alert-stat">
            <ExclamationCircleOutlined style={{ color: '#FF4D4F' }} />
            <span>运行告警: {system.alertCount || 0} 条</span>
          </div>
          <div className="alert-stat">
            <BugOutlined style={{ color: '#FAAD14' }} />
            <span>脆弱性: {system.vulnerabilityCount || 0} 个</span>
          </div>
          <div className="alert-stat">
            <SecurityScanOutlined style={{ color: '#722ED1' }} />
            <span>安全事件: {Math.floor(Math.random() * 3)} 个</span>
          </div>
        </Space>
      </div>
    </div>
  )

  const renderAssetDetail = (asset: any) => (
    <div className="asset-detail">
      <div className="panel-header">
        <h4>
          {selectedAssetId && selectedOrganization?.type === 'system' ? (
            <>
              <span
                className="breadcrumb-link"
                onClick={handleBackToSystem}
                title="返回系统详情"
              >
                {selectedOrganization.name}
              </span>
              <span className="breadcrumb-separator">&gt;</span>
              <span>{asset.name}</span>
            </>
          ) : selectedAssetId ? (
            '选中资产详情'
          ) : (
            '资产详细信息'
          )}
        </h4>
        <Tag color={asset.healthStatus === 'HEALTHY' ? 'green' :
                    asset.healthStatus === 'WARNING' ? 'orange' : 'red'}>
          {asset.healthStatus === 'HEALTHY' ? '健康' :
           asset.healthStatus === 'WARNING' ? '警告' : '故障'}
        </Tag>
      </div>

      <Descriptions size="small" column={1} className="asset-descriptions">
        <Descriptions.Item label="资产名称">{asset.name}</Descriptions.Item>
        <Descriptions.Item label="资产类型">{asset.type}</Descriptions.Item>
        <Descriptions.Item label="所属系统">{asset.systemName}</Descriptions.Item>
        <Descriptions.Item label="归属部门">{asset.department}</Descriptions.Item>
        <Descriptions.Item label="IP地址">{asset.ipAddress}</Descriptions.Item>
        <Descriptions.Item label="重要程度">
          <Tag color={asset.importance === 'CRITICAL' ? 'red' :
                      asset.importance === 'HIGH' ? 'orange' :
                      asset.importance === 'MEDIUM' ? 'blue' : 'default'}>
            {asset.importance === 'CRITICAL' ? '关键' :
             asset.importance === 'HIGH' ? '重要' :
             asset.importance === 'MEDIUM' ? '一般' : '较低'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="错误率">{asset.errorRate?.toFixed(2)}%</Descriptions.Item>
        <Descriptions.Item label="响应时间">{asset.responseTime}ms</Descriptions.Item>
        <Descriptions.Item label="可用性">{asset.availability?.toFixed(1)}%</Descriptions.Item>
        <Descriptions.Item label="最近检查">{asset.lastCheck ? new Date(asset.lastCheck).toLocaleString() : '未知'}</Descriptions.Item>
      </Descriptions>

      <div className="asset-alerts-summary">
        <h5>告警信息</h5>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div className="alert-stat">
            <ExclamationCircleOutlined style={{ color: '#FF4D4F' }} />
            <span>运行告警: {asset.alertCount || 0} 条</span>
          </div>
          <div className="alert-stat">
            <BugOutlined style={{ color: '#FAAD14' }} />
            <span>脆弱性: {asset.vulnerabilityCount || 0} 个</span>
          </div>
          <div className="alert-stat">
            <SecurityScanOutlined style={{ color: '#722ED1' }} />
            <span>安全事件: 0 个</span>
          </div>
        </Space>
      </div>
    </div>
  )

  return (
    <div className="system-detail-container">
      {displayContent.type === 'empty' && (
        <Empty description="请选择左侧组织架构节点查看详情" />
      )}

      {displayContent.type === 'systemsList' && displayContent.data &&
        renderSystemsList(displayContent.data)}

      {displayContent.type === 'departmentSystems' && displayContent.data &&
        renderDepartmentSystems(displayContent.data)}

      {displayContent.type === 'systemDetail' && displayContent.data &&
        renderSystemDetail(displayContent.data)}

      {displayContent.type === 'assetDetail' && displayContent.data &&
        renderAssetDetail(displayContent.data)}
    </div>
  )
}

export default SystemDetail