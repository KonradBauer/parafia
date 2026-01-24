import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Announcements from '@/pages/Announcements'
import Intentions from '@/pages/Intentions'
import MassTimes from '@/pages/MassTimes'
import Priests from '@/pages/Priests'
import PriestsFromParish from '@/pages/PriestsFromParish'
import Gallery from '@/pages/Gallery'
import History from '@/pages/History'
import Events from '@/pages/Events'
import ParishInfo from '@/pages/ParishInfo'
import Messages from '@/pages/Messages'
import { Loader2 } from 'lucide-react'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/ogloszenia" replace />} />
                <Route path="/ogloszenia" element={<Announcements />} />
                <Route path="/intencje" element={<Intentions />} />
                <Route path="/msze" element={<MassTimes />} />
                <Route path="/duszpasterze" element={<Priests />} />
                <Route path="/ksieza-z-parafii" element={<PriestsFromParish />} />
                <Route path="/galeria" element={<Gallery />} />
                <Route path="/historia" element={<History />} />
                <Route path="/wydarzenia" element={<Events />} />
                <Route path="/dane-parafii" element={<ParishInfo />} />
                <Route path="/wiadomosci" element={<Messages />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
