import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DownOutlined, RightOutlined, FolderOutlined, FolderOpenOutlined, DatabaseOutlined, HddOutlined } from '@ant-design/icons'
import { RootState } from '../../../store'
import {
  setSelectedOrganization,
  setSystems,
  toggleOrganizationExpand,
  expandOrganizationNode,
  setFilteredAssets,
  setSelectedDepartmentId,
  setSelectedAssetId
} from '../../../store/slices/dashboardSlice'
import { OrganizationNode } from '../../../types'
import { generateMockSystems, generateSystemsForDepartment, getAssetsForDepartment, getAllAssets } from '../../../mock/data'
import './index.css'

const OrganizationTree: React.FC = () => {
  const dispatch = useDispatch()
  const { organizations, selectedOrganization, selectedDepartmentId, systems } = useSelector((state: RootState) => state.dashboard)

  const handleNodeClick = (node: OrganizationNode, event: React.MouseEvent) => {
    event.stopPropagation()

    dispatch(setSelectedOrganization(node))

    if (node.type === 'root') {
      // 点击根节点，显示全部资产
      const allSystems = generateMockSystems('ROOT')
      dispatch(setSystems(allSystems))
      dispatch(setFilteredAssets(getAllAssets()))
      dispatch(setSelectedDepartmentId(null))
      // 清除资产选择
      dispatch(setSelectedAssetId(null))
    } else if (node.type === 'department') {
      // 点击部门节点，筛选该部门的数据
      const allSystems = generateMockSystems()
      const departmentSystems = allSystems.filter(sys => sys.departmentId === node.id)
      dispatch(setSystems(departmentSystems))
      dispatch(setFilteredAssets(getAssetsForDepartment(node.id)))
      dispatch(setSelectedDepartmentId(node.id))
      // 清除资产选择
      dispatch(setSelectedAssetId(null))
    } else if (node.type === 'system') {
      // 点击系统节点，筛选该系统的资产
      console.log('🔍 点击系统节点:', node.id, node.name)

      // 首先从当前systems状态中查找
      let currentSystem = systems.find(sys => sys.id === node.id)
      console.log('📊 从当前systems状态查找:', currentSystem ? '找到' : '未找到')

      // 如果在当前systems中找不到，从全量数据中查找
      if (!currentSystem) {
        console.log('🔄 从全量数据中查找...')
        const allSystems = generateMockSystems()
        currentSystem = allSystems.find(sys => sys.id === node.id)
        console.log('📊 从全量数据查找:', currentSystem ? '找到' : '未找到')
      }

      const systemAssets = currentSystem?.assets || []
      console.log('🎯 系统资产数据:', {
        systemId: currentSystem?.id,
        systemName: currentSystem?.name,
        assetCount: systemAssets.length,
        assets: systemAssets.map(asset => ({ id: asset.id, name: asset.name, type: asset.type }))
      })

      dispatch(setFilteredAssets(systemAssets))
    } else if (node.type === 'asset') {
      // 点击资产节点，显示单个资产信息
      const singleAsset = getAllAssets().find(asset => asset.id === node.id)
      dispatch(setFilteredAssets(singleAsset ? [singleAsset] : []))
    }
  }

  const handleExpandClick = async (node: OrganizationNode, event: React.MouseEvent) => {
    event.stopPropagation()

    if (node.type === 'department' && !node.children) {
      // 第一次展开部门，只加载业务系统（不包含具体资产）
      const systemNodes = generateSystemsForDepartment(node.id).map(system => ({
        ...system,
        children: undefined // 不显示资产节点
      }))
      dispatch(expandOrganizationNode({ nodeId: node.id, children: systemNodes }))
    } else if (node.type === 'system') {
      // 系统节点不展开，点击直接筛选该系统的资产
      return
    } else {
      // 切换展开/折叠状态
      dispatch(toggleOrganizationExpand(node.id))
    }
  }

  const getHealthStatusClass = (status: string) => {
    const statusMap = {
      HEALTHY: 'healthy',
      WARNING: 'warning',
      CRITICAL: 'critical',
      UNKNOWN: 'unknown'
    }
    return `health-indicator ${statusMap[status as keyof typeof statusMap] || 'unknown'}`
  }

  const getNodeIcon = (node: OrganizationNode) => {
    switch (node.type) {
      case 'root':
        return <FolderOpenOutlined />
      case 'department':
        return node.isExpanded ? <FolderOpenOutlined /> : <FolderOutlined />
      case 'system':
        return <DatabaseOutlined />
      case 'asset':
        return <HddOutlined />
      default:
        return <FolderOutlined />
    }
  }

  const getExpandIcon = (node: OrganizationNode) => {
    if (node.type === 'asset' || node.type === 'system') return null

    const hasChildren = (node.type === 'department' && node.systemCount > 0) ||
                       (node.children && node.children.length > 0)

    if (!hasChildren) return <span className="no-expand-icon"></span>

    return node.isExpanded ? <DownOutlined /> : <RightOutlined />
  }

  const renderNodeContent = (node: OrganizationNode, level: number = 0) => {
    const isSelected = selectedOrganization?.id === node.id
    const isDepartmentSelected = selectedDepartmentId === node.id

    return (
      <div key={node.id} className="tree-node-wrapper">
        <div
          className={`tree-node level-${level} ${isSelected ? 'selected' : ''} ${isDepartmentSelected ? 'department-selected' : ''}`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={(e) => handleNodeClick(node, e)}
        >
          {/* 根节点和部门节点：竖直布局，统计信息换行 */}
          {(node.type === 'root' || node.type === 'department') && (
            <>
              <div className="node-main-row">
                <div className="node-left-section">
                  <span
                    className="expand-icon"
                    onClick={(e) => handleExpandClick(node, e)}
                  >
                    {getExpandIcon(node)}
                  </span>

                  <span className="node-icon">
                    {getNodeIcon(node)}
                  </span>

                  <div className={getHealthStatusClass(node.healthStatus)}></div>

                  <span className="node-name">{node.name}</span>
                </div>
              </div>

              <div className="node-multiline-stats">
                {node.type === 'root' && (
                  <>
                    <span className="stat-item">
                      <span className="stat-label">部门:</span>
                      <span className="stat-value">{node.children?.length || 0}</span>
                    </span>
                    <span className="stat-item">
                      <span className="stat-label">系统:</span>
                      <span className="stat-value">{node.systemCount}</span>
                    </span>
                  </>
                )}
                {node.type === 'department' && (
                  <>
                    <span className="stat-item">
                      <span className="stat-label">系统:</span>
                      <span className="stat-value">{node.systemCount}</span>
                    </span>
                    <span className="stat-item">
                      <span className="stat-label">资产:</span>
                      <span className="stat-value">{node.assetCount}</span>
                    </span>
                  </>
                )}
              </div>
            </>
          )}

          {/* 系统和资产节点：水平布局，统计信息在右侧 */}
          {(node.type === 'system' || node.type === 'asset') && (
            <>
              <span
                className="expand-icon"
                onClick={(e) => handleExpandClick(node, e)}
              >
                {getExpandIcon(node)}
              </span>

              <span className="node-icon">
                {getNodeIcon(node)}
              </span>

              <div className={getHealthStatusClass(node.healthStatus)}></div>

              <span className="node-name">{node.name}</span>

              <div className="node-stats">
                {node.type === 'system' && (
                  <span className="stat-item">
                    <span className="stat-label">资产:</span>
                    <span className="stat-value">{node.assetCount}</span>
                  </span>
                )}
                {node.type === 'asset' && (
                  <span className="asset-type-label">{node.name.split('-')[0]}</span>
                )}
              </div>
            </>
          )}
        </div>

        {node.isExpanded && node.children && (
          <div className="children-container">
            {node.children.map(child => renderNodeContent(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="organization-tree-container">
      <div className="tree-header">
        <h3>组织架构</h3>
        {/* <div className="breadcrumb">
          {selectedOrganization && selectedOrganization.type !== 'root' && (
            <span className="current-path">
              {selectedOrganization.type === 'department' && selectedOrganization.name}
              {selectedOrganization.type === 'system' && `${selectedOrganization.name}`}
              {selectedOrganization.type === 'asset' && `${selectedOrganization.name}`}
            </span>
          )}
        </div> */}
      </div>

      <div className="tree-content">
        {organizations.map(org => renderNodeContent(org, 0))}
      </div>

      <div className="tree-legend">
        <div className="legend-item">
          <div className="health-indicator healthy"></div>
          <span>健康</span>
        </div>
        <div className="legend-item">
          <div className="health-indicator warning"></div>
          <span>警告</span>
        </div>
        <div className="legend-item">
          <div className="health-indicator critical"></div>
          <span>故障</span>
        </div>
        <div className="legend-item">
          <div className="health-indicator unknown"></div>
          <span>未知</span>
        </div>
      </div>
    </div>
  )
}

export default OrganizationTree