
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/dashboard'
import BusinessPanorama from './pages/business-panorama'
import MockConfig from './pages/mock-config'
import Test from './pages/test'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Navigate to="/organization-health" replace />} />

            {/* 使用AppLayout作为父布局 */}
            <Route element={<AppLayout />}>
              <Route path="/organization-health" element={<Dashboard />} />
              <Route path="/business-panorama" element={<BusinessPanorama />} />
            </Route>

            {/* 其他页面不使用布局 */}
            <Route path="/mock-config" element={<MockConfig />} />
            <Route path="/test" element={<Test />} />

            {/* 兼容旧路由 */}
            <Route path="/dashboard" element={<Navigate to="/organization-health" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App