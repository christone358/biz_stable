
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import Dashboard from './pages/dashboard'
import MockConfig from './pages/mock-config'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mock-config" element={<MockConfig />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App