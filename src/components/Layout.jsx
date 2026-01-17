import Header from './Header'
import Footer from './Footer'
import AccessibilityPanel from './AccessibilityPanel'

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip Links for keyboard navigation - WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="skip-link sr-only-focusable"
      >
        Przejdź do głównej treści
      </a>
      <a
        href="#main-navigation"
        className="skip-link sr-only-focusable"
      >
        Przejdź do nawigacji
      </a>
      <a
        href="#footer"
        className="skip-link sr-only-focusable"
      >
        Przejdź do stopki
      </a>

      <Header />

      <main id="main-content" className="flex-grow" role="main" tabIndex={-1}>
        {children}
      </main>

      <Footer />

      {/* Accessibility Panel */}
      <AccessibilityPanel />
    </div>
  )
}

export default Layout
