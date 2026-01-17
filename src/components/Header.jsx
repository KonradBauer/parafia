import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Mail, Clock, ExternalLink } from 'lucide-react'

const navigation = [
  { name: 'Strona główna', href: '/' },
  { name: 'Ogłoszenia', href: '/ogloszenia' },
  { name: 'Intencje', href: '/intencje' },
  { name: 'Kancelaria', href: '/kancelaria' },
  { name: 'Galeria', href: '/galeria' },
  { name: 'Historia', href: '/historia' },
  { name: 'Cmentarz', href: 'https://przystajn.grobonet.com/grobonet/start.php', external: true },
  { name: 'Kontakt', href: '/kontakt' },
]

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const menuButtonRef = useRef(null)
  const mobileNavRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Close menu on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Focus first item when menu opens
  useEffect(() => {
    if (isOpen && mobileNavRef.current) {
      const firstLink = mobileNavRef.current.querySelector('a')
      firstLink?.focus()
    }
  }, [isOpen])

  // Announce page changes to screen readers
  useEffect(() => {
    const pageTitle = navigation.find(item => item.href === location.pathname)?.name || 'Strona'
    document.title = `${pageTitle} | Parafia Trójcy Przenajświętszej w Przystajni`
  }, [location])

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-500 dark:bg-primary-700 text-white py-2 hidden md:block" role="banner">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a
                href="tel:+48343191029"
                className="flex items-center gap-2 hover:text-gold-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-primary-500 rounded"
                aria-label="Zadzwoń do parafii: 34 319 10 29"
              >
                <Phone size={14} aria-hidden="true" />
                <span>34 319 10 29</span>
              </a>
              <a
                href="mailto:przystajn@archidiecezja.pl"
                className="flex items-center gap-2 hover:text-gold-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-primary-500 rounded"
                aria-label="Wyślij email do parafii"
              >
                <Mail size={14} aria-hidden="true" />
                <span>przystajn@archidiecezja.pl</span>
              </a>
            </div>
            <div className="flex items-center gap-2" aria-label="Godziny pracy kancelarii">
              <Clock size={14} aria-hidden="true" />
              <span>Kancelaria: Pon-Pt 8:00-9:00, 16:00-17:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white dark:bg-gray-900 shadow-lg py-2'
            : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm py-4'
        }`}
        role="banner"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-gold-400 rounded-lg"
              aria-label="Strona główna parafii"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-gold-400 text-xl md:text-2xl font-serif font-bold" aria-hidden="true">✝</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-primary-500 dark:text-primary-300 font-serif font-semibold text-lg md:text-xl leading-tight block">
                  Parafia Trójcy Przenajświętszej
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm block">w Przystajni</span>
              </div>
            </Link>

            {/* Desktop navigation */}
            <nav
              id="main-navigation"
              className="hidden lg:flex items-center gap-1"
              aria-label="Nawigacja główna"
            >
              {navigation.map((item) => (
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/50 hover:text-primary-500 dark:hover:text-primary-300 inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label={`${item.name} (otwiera się w nowej karcie)`}
                  >
                    {item.name}
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      location.pathname === item.href
                        ? 'bg-primary-500 dark:bg-primary-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/50 hover:text-primary-500 dark:hover:text-primary-300'
                    }`}
                    aria-current={location.pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              ref={menuButtonRef}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={isOpen ? 'Zamknij menu' : 'Otwórz menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div
          id="mobile-navigation"
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!isOpen}
        >
          <nav
            ref={mobileNavRef}
            className="container mx-auto px-4 py-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700"
            aria-label="Menu mobilne"
          >
            <ul className="flex flex-col gap-1" role="list">
              {navigation.map((item) => (
                <li key={item.name}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 rounded-lg font-medium transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/50 hover:text-primary-500 dark:hover:text-primary-300 inline-flex items-center gap-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                      aria-label={`${item.name} (otwiera się w nowej karcie)`}
                      tabIndex={isOpen ? 0 : -1}
                    >
                      {item.name}
                      <ExternalLink size={16} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 block focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        location.pathname === item.href
                          ? 'bg-primary-500 dark:bg-primary-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/50 hover:text-primary-500 dark:hover:text-primary-300'
                      }`}
                      aria-current={location.pathname === item.href ? 'page' : undefined}
                      tabIndex={isOpen ? 0 : -1}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile contact info */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href="tel:+48343191029"
                className="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
                aria-label="Zadzwoń: 34 319 10 29"
                tabIndex={isOpen ? 0 : -1}
              >
                <Phone size={18} className="text-primary-500 dark:text-primary-400" aria-hidden="true" />
                <span>34 319 10 29</span>
              </a>
              <a
                href="mailto:przystajn@archidiecezja.pl"
                className="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
                aria-label="Wyślij email do parafii"
                tabIndex={isOpen ? 0 : -1}
              >
                <Mail size={18} className="text-primary-500 dark:text-primary-400" aria-hidden="true" />
                <span>przystajn@archidiecezja.pl</span>
              </a>
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header
