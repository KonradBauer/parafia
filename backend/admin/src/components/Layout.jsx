import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import api from '@/services/api'
import {
  Megaphone,
  BookOpen,
  Clock,
  User,
  Users,
  Image,
  History,
  Calendar,
  Church,
  Mail,
  LogOut,
  Cross,
  Info
} from 'lucide-react'

const navItems = [
  { path: '/ogloszenia', label: 'Ogłoszenia', icon: Megaphone },
  { path: '/intencje', label: 'Intencje', icon: BookOpen },
  { path: '/msze', label: 'Msze św.', icon: Clock },
  { path: '/duszpasterze', label: 'Duszpasterze', icon: User },
  { path: '/ksieza-z-parafii', label: 'Księża z parafii', icon: Users },
  { path: '/galeria', label: 'Galeria', icon: Image },
  { path: '/historia', label: 'Historia', icon: History },
  { path: '/wydarzenia', label: 'Wydarzenia', icon: Calendar },
  { path: '/dane-parafii', label: 'Dane parafii', icon: Church },
  { path: '/o-nas', label: 'O nas (strona gł.)', icon: Info },
  { path: '/o-parafii', label: 'O parafii (historia)', icon: Church },
  { path: '/wiadomosci', label: 'Wiadomości', icon: Mail, showBadge: true },
]

function Layout({ children }) {
  const { logout, user } = useAuth()
  const location = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const messages = await api.getMessages()
        const unread = messages.filter(m => !m.isRead).length
        setUnreadCount(unread)
      } catch (err) {
        // ignore errors
      }
    }

    fetchUnreadCount()
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  // Refresh count when navigating to messages
  useEffect(() => {
    if (location.pathname === '/wiadomosci') {
      const fetchUnreadCount = async () => {
        try {
          const messages = await api.getMessages()
          const unread = messages.filter(m => !m.isRead).length
          setUnreadCount(unread)
        } catch (err) {
          // ignore errors
        }
      }
      // Small delay to allow for read status updates
      const timeout = setTimeout(fetchUnreadCount, 500)
      return () => clearTimeout(timeout)
    }
  }, [location.pathname])

  const currentPage = navItems.find(item => location.pathname === item.path)

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 z-50 w-60 bg-card border-r flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Cross className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold text-primary leading-tight">Panel</div>
            <div className="text-sm font-semibold text-primary leading-tight">Administracyjny</div>
          </div>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            const showBadge = item.showBadge && unreadCount > 0
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-secondary/20 text-primary border-l-2 border-secondary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
                {showBadge && (
                  <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground mb-2">
            Zalogowany jako: <span className="font-medium">{user?.username}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Wyloguj
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-60 min-h-screen">
        {/* Page Header */}
        <header className="sticky top-0 z-40 bg-background border-b px-6 py-4">
          <h1 className="text-xl font-semibold text-primary">
            {currentPage?.label || 'Panel'}
          </h1>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
