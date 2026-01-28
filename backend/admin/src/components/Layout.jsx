import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
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
  Info,
  Menu,
  ChevronsLeft,
  ChevronsRight
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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

  // Close mobile sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const currentPage = navItems.find(item => location.pathname === item.path)

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 z-50",
        "bg-card border-r flex flex-col overflow-hidden",
        "transition-all duration-200 ease-in-out",
        "md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        sidebarCollapsed ? "w-60 md:w-14" : "w-60"
      )}>
        {/* Header */}
        <div className={cn(
          "p-4 flex items-center shrink-0",
          sidebarCollapsed ? "md:justify-center gap-3" : "gap-3"
        )}>
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
            <Cross className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div className={cn("whitespace-nowrap", sidebarCollapsed && "md:hidden")}>
            <div className="text-sm font-semibold text-primary leading-tight">Panel</div>
            <div className="text-sm font-semibold text-primary leading-tight">Administracyjny</div>
          </div>
        </div>

        <Separator />

        {/* Collapse toggle (desktop only) */}
        <button
          className="hidden md:flex items-center justify-center py-2 mx-2 mt-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? "Rozwiń menu" : "Zwiń menu"}
        >
          {sidebarCollapsed
            ? <ChevronsRight className="w-4 h-4" />
            : <ChevronsLeft className="w-4 h-4" />
          }
        </button>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            const showBadge = item.showBadge && unreadCount > 0
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={item.label}
                className={({ isActive }) => cn(
                  "relative flex items-center rounded-md text-sm font-medium transition-colors mx-2",
                  sidebarCollapsed
                    ? "gap-3 px-4 py-2.5 md:justify-center md:px-0 md:py-2.5"
                    : "gap-3 px-4 py-2.5",
                  isActive
                    ? "bg-secondary/20 text-primary border-l-2 border-secondary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className={cn(
                  "flex-1 whitespace-nowrap",
                  sidebarCollapsed && "md:hidden"
                )}>
                  {item.label}
                </span>
                {showBadge && (
                  <>
                    <span className={cn(
                      "bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center",
                      sidebarCollapsed && "md:hidden"
                    )}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                    {sidebarCollapsed && (
                      <span className="hidden md:block absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={cn(
          "border-t shrink-0",
          sidebarCollapsed ? "p-4 md:p-2" : "p-4"
        )}>
          <div className={cn(
            "text-xs text-muted-foreground mb-2",
            sidebarCollapsed && "md:hidden"
          )}>
            Zalogowany jako: <span className="font-medium">{user?.username}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full",
              sidebarCollapsed && "md:w-auto md:p-2"
            )}
            onClick={logout}
            title="Wyloguj"
          >
            <LogOut className={cn(
              "w-4 h-4 shrink-0",
              sidebarCollapsed ? "mr-2 md:mr-0" : "mr-2"
            )} />
            <span className={cn(
              "whitespace-nowrap",
              sidebarCollapsed && "md:hidden"
            )}>
              Wyloguj
            </span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 ml-0 min-h-screen transition-[margin] duration-200",
        sidebarCollapsed ? "md:ml-14" : "md:ml-60"
      )}>
        {/* Page Header */}
        <header className="sticky top-0 z-40 bg-background border-b px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1 -ml-1 rounded-md hover:bg-muted"
              onClick={() => setSidebarOpen(true)}
              aria-label="Otwórz menu nawigacyjne"
              aria-expanded={sidebarOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-primary">
              {currentPage?.label || 'Panel'}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
