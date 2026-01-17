import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AnnouncementsPage from './pages/AnnouncementsPage'
import IntentionsPage from './pages/IntentionsPage'
import OfficePage from './pages/OfficePage'
import GalleryPage from './pages/GalleryPage'
import HistoryPage from './pages/HistoryPage'
import PriestsFromParishPage from './pages/PriestsFromParishPage'
import ContactPage from './pages/ContactPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ogloszenia" element={<AnnouncementsPage />} />
        <Route path="/intencje" element={<IntentionsPage />} />
        <Route path="/kancelaria" element={<OfficePage />} />
        <Route path="/galeria" element={<GalleryPage />} />
        <Route path="/historia" element={<HistoryPage />} />
        <Route path="/historia/ksieza-z-parafii" element={<PriestsFromParishPage />} />
        <Route path="/kontakt" element={<ContactPage />} />
      </Routes>
    </Layout>
  )
}

export default App
