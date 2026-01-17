import { createContext, useContext, useState, useEffect } from 'react'

const AccessibilityContext = createContext()

const STORAGE_KEY = 'parafia-accessibility-settings'

const defaultSettings = {
  theme: 'light', // 'light' | 'dark' | 'system'
  fontSize: 'normal', // 'normal' | 'large' | 'xlarge'
  highContrast: false,
  reducedMotion: false,
  lineHeight: 'normal', // 'normal' | 'relaxed' | 'loose'
  letterSpacing: 'normal', // 'normal' | 'wide' | 'wider'
  focusHighlight: true,
  dyslexiaFont: false,
}

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) }
        } catch {
          return defaultSettings
        }
      }
    }
    return defaultSettings
  })

  const [isOpen, setIsOpen] = useState(false)

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    // Theme
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    } else {
      root.classList.toggle('dark', settings.theme === 'dark')
    }

    // Font size
    root.classList.remove('text-base', 'text-lg', 'text-xl')
    switch (settings.fontSize) {
      case 'large':
        root.style.fontSize = '118.75%' // 19px base
        break
      case 'xlarge':
        root.style.fontSize = '137.5%' // 22px base
        break
      default:
        root.style.fontSize = '100%' // 16px base
    }

    // High contrast
    root.classList.toggle('high-contrast', settings.highContrast)

    // Reduced motion
    root.classList.toggle('reduce-motion', settings.reducedMotion)

    // Line height
    root.classList.remove('leading-normal', 'leading-relaxed', 'leading-loose')
    root.classList.add(`leading-${settings.lineHeight}`)

    // Letter spacing
    root.classList.remove('tracking-normal', 'tracking-wide', 'tracking-wider')
    root.classList.add(`tracking-${settings.letterSpacing}`)

    // Focus highlight
    root.classList.toggle('enhanced-focus', settings.focusHighlight)

    // Dyslexia-friendly font
    root.classList.toggle('dyslexia-font', settings.dyslexiaFont)

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  // Listen for system theme changes
  useEffect(() => {
    if (settings.theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      document.documentElement.classList.toggle('dark', e.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [settings.theme])

  // Listen for system reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches && !settings.reducedMotion) {
      setSettings(prev => ({ ...prev, reducedMotion: true }))
    }
  }, [])

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  const togglePanel = () => setIsOpen(!isOpen)
  const closePanel = () => setIsOpen(false)

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        isOpen,
        togglePanel,
        closePanel,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

export default AccessibilityContext
