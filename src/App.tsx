import { useState } from 'react'
import { AppPage } from './types'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import MetricDetail from './pages/MetricDetail'
import Prescriptions from './pages/Prescriptions'
import DesignSystem from './pages/DesignSystem'

export default function App() {
  const [page, setPage] = useState<AppPage>('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState('Sarah')

  const handleLogin = () => {
    setIsAuthenticated(true)
    setPage('dashboard')
  }

  const handleSignup = (name: string) => {
    setUserName(name || 'Sarah')
    setIsAuthenticated(true)
    setPage('dashboard')
  }

  if (!isAuthenticated) {
    if (page === 'signup') {
      return <Signup onSignup={handleSignup} onGoLogin={() => setPage('login')} />
    }
    return <Login onLogin={handleLogin} onGoSignup={() => setPage('signup')} />
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard userName={userName} onNavigate={setPage} />
      case 'heart':
        return <MetricDetail metric="heart" onNavigate={setPage} />
      case 'glucose':
        return <MetricDetail metric="glucose" onNavigate={setPage} />
      case 'liver':
        return <MetricDetail metric="liver" onNavigate={setPage} />
      case 'prescriptions':
        return <Prescriptions />
      case 'design-system':
        return <DesignSystem />
      default:
        return <Dashboard userName={userName} onNavigate={setPage} />
    }
  }

  return (
    <AppLayout currentPage={page} onNavigate={setPage}>
      {renderPage()}
    </AppLayout>
  )
}
