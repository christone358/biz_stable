
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider, theme } from 'antd'
import { store } from './store'
import ManagementLayout from './components/layout/ManagementLayout'
import CollaborationLayout from './components/layout/CollaborationLayout'
import { SystemType, getCurrentSystemType } from './config/system'
import Dashboard from './pages/dashboard'
import BusinessPanorama from './pages/business-panorama'
import AssetManagement from './pages/management/asset-management'
import BusinessManagement from './pages/business-management'
import AlertMonitoring from './pages/management/alert-monitoring'
import AssetOperations from './pages/management/asset-operations'
import VulnerabilityManagement from './pages/management/vulnerability'
import BusinessMonitoring from './pages/management/business-monitoring'
import VulnerabilityDisposal from './pages/collaboration/vulnerability'
import AssetMonitoring from './pages/collaboration/asset-monitoring'
import RuntimeAlerts from './pages/collaboration/runtime-alerts'
import TaskCenter from './pages/collaboration/task-center'
import TaskRecords from './pages/collaboration/task-records'
import AssetInfo from './pages/collaboration/asset-info'
import AssetIssues from './pages/collaboration/asset-issues'
import MockConfig from './pages/mock-config'
import Test from './pages/test'
import './App.css'

function App() {
  // 根据环境变量获取当前系统类型
  const systemType = getCurrentSystemType()

  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: theme.v4Algorithm,
          token: {
            colorPrimary: '#1890FF',
            colorSuccess: '#52C41A',
            colorWarning: '#FAAD14',
            colorError: '#FF4D4F',
            colorInfo: '#1890FF',
            colorBgLayout: '#F5F5F5',
            colorBorder: '#D9D9D9',
            colorSplit: '#F0F0F0',
            colorLink: '#1890FF',
            borderRadius: 4,
            fontSize: 14,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"
          },
          components: {
            Button: {
              controlHeight: 36,
              fontWeight: 500
            },
            Table: {
              headerBg: '#F5F5F5',
              cellPaddingBlock: 12,
              cellPaddingInline: 16
            },
            Layout: {
              headerBg: '#FFFFFF',
              headerHeight: 64
            },
            Card: {
              paddingLG: 24
            }
          }
        }}
      >
        <Router>
          <div className="app">
            <Routes>
              {/* 根据系统类型渲染不同的路由 */}
              {systemType === SystemType.MANAGEMENT ? (
                <>
                  {/* 系统一：业务保障管理系统路由 */}
                  <Route path="/" element={<Navigate to="/management/business-panorama" replace />} />

                  <Route element={<ManagementLayout />}>
                    {/* 业务全景 */}
                    <Route path="/management/business-panorama" element={<BusinessPanorama />} />
                    <Route path="/management/business-monitoring" element={<BusinessMonitoring />} />

                    {/* 业务资产管理 */}
                    <Route path="/management/business-management" element={<BusinessManagement />} />
                    <Route path="/management/asset-management" element={<AssetManagement />} />

                    {/* 业务保障管理 */}
                    <Route path="/management/alert-monitoring" element={<AlertMonitoring />} />
                    <Route path="/management/asset-operations" element={<AssetOperations />} />
                    <Route path="/management/vulnerability" element={<VulnerabilityManagement />} />

                    {/* 协同工作中心 */}
                    <Route path="/management/task-management" element={<div>协同任务管理（待开发）</div>} />
                    <Route path="/management/task-records" element={<div>任务执行记录（待开发）</div>} />
                  </Route>

                  {/* 兼容旧路由 */}
                  <Route path="/dashboard" element={<Navigate to="/management/business-panorama" replace />} />
                  <Route path="/organization-health" element={<Navigate to="/management/business-panorama" replace />} />
                  <Route path="/business-panorama" element={<Navigate to="/management/business-panorama" replace />} />
                  <Route path="/business-management" element={<Navigate to="/management/business-management" replace />} />
                  <Route path="/asset-management" element={<Navigate to="/management/asset-management" replace />} />
                  <Route path="/management/asset-panorama" element={<Navigate to="/management/asset-management" replace />} />

                  {/* 在开发环境下，也允许访问协同系统路由 */}
                  <Route element={<CollaborationLayout />}>
                    {/* 业务运行保障 */}
                    <Route path="/collaboration/asset-monitoring" element={<AssetMonitoring />} />
                    <Route path="/collaboration/runtime-alerts" element={<RuntimeAlerts />} />
                    <Route path="/collaboration/vulnerability" element={<VulnerabilityDisposal />} />

                    {/* 协同任务 */}
                    <Route path="/collaboration/task-center" element={<TaskCenter />} />
                    <Route path="/collaboration/task-records" element={<TaskRecords />} />

                    {/* 资产管理 */}
                    <Route path="/collaboration/asset-info" element={<AssetInfo />} />
                    <Route path="/collaboration/asset-issues" element={<AssetIssues />} />
                  </Route>
                </>
              ) : (
                <>
                  {/* 系统二：业务协同管理系统路由 */}
                  <Route path="/" element={<Navigate to="/collaboration/asset-monitoring" replace />} />

                  <Route element={<CollaborationLayout />}>
                    {/* 业务运行保障 */}
                    <Route path="/collaboration/asset-monitoring" element={<AssetMonitoring />} />
                    <Route path="/collaboration/runtime-alerts" element={<RuntimeAlerts />} />
                    <Route path="/collaboration/vulnerability" element={<VulnerabilityDisposal />} />

                    {/* 协同任务 */}
                    <Route path="/collaboration/task-center" element={<TaskCenter />} />
                    <Route path="/collaboration/task-records" element={<TaskRecords />} />

                    {/* 资产管理 */}
                    <Route path="/collaboration/asset-info" element={<AssetInfo />} />
                    <Route path="/collaboration/asset-issues" element={<AssetIssues />} />
                  </Route>

                  {/* 在开发环境下，也允许访问管理系统路由 */}
                  <Route element={<ManagementLayout />}>
                    {/* 业务全景 */}
                    <Route path="/management/business-panorama" element={<BusinessPanorama />} />
                    <Route path="/management/business-monitoring" element={<BusinessMonitoring />} />

                    {/* 业务资产管理 */}
                    <Route path="/management/business-management" element={<BusinessManagement />} />
                    <Route path="/management/asset-management" element={<AssetManagement />} />

                    {/* 业务保障管理 */}
                    <Route path="/management/alert-monitoring" element={<AlertMonitoring />} />
                    <Route path="/management/asset-operations" element={<AssetOperations />} />
                    <Route path="/management/vulnerability" element={<VulnerabilityManagement />} />

                    {/* 协同工作中心 */}
                    <Route path="/management/task-management" element={<div>协同任务管理（待开发）</div>} />
                    <Route path="/management/task-records" element={<div>任务执行记录（待开发）</div>} />
                  </Route>
                </>
              )}

              {/* 共享页面（两个系统都可访问） */}
              <Route path="/mock-config" element={<MockConfig />} />
              <Route path="/test" element={<Test />} />
            </Routes>
          </div>
        </Router>
      </ConfigProvider>
    </Provider>
  )
}

export default App