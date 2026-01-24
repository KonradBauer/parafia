import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
  Cross
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
  { path: '/wiadomosci', label: 'Wiadomości', icon: Mail },
]

function Layout({ children }) {
  const { logout, user } = useAuth()
  const location = useLocation()

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
                <span>{item.label}</span>
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
