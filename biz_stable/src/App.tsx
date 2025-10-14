
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider, theme } from 'antd'
import { store } from './store'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/dashboard'
import BusinessPanorama from './pages/business-panorama'
import AssetManagement from './pages/asset-management'
import BusinessManagement from './pages/business-management'
import MockConfig from './pages/mock-config'
import Test from './pages/test'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
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
              <Route path="/" element={<Navigate to="/organization-health" replace />} />

              {/* 使用AppLayout作为父布局 */}
              <Route element={<AppLayout />}>
                <Route path="/organization-health" element={<Dashboard />} />
                <Route path="/business-panorama" element={<BusinessPanorama />} />
                <Route path="/business-management" element={<BusinessManagement />} />
                <Route path="/asset-management" element={<AssetManagement />} />
              </Route>

              {/* 其他页面不使用布局 */}
              <Route path="/mock-config" element={<MockConfig />} />
              <Route path="/test" element={<Test />} />

              {/* 兼容旧路由 */}
              <Route path="/dashboard" element={<Navigate to="/organization-health" replace />} />
            </Routes>
          </div>
        </Router>
      </ConfigProvider>
    </Provider>
  )
}

export default App