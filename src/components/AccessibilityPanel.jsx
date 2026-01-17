import { useEffect, useRef } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'
import {
  Accessibility,
  X,
  Sun,
  Moon,
  Monitor,
  Type,
  Contrast,
  Eye,
  RotateCcw,
  ZoomIn,
  AlignJustify,
  Space,
  Sparkles,
  Focus
} from 'lucide-react'

function AccessibilityPanel() {
  const { settings, updateSetting, resetSettings, isOpen, togglePanel, closePanel } = useAccessibility()
  const panelRef = useRef(null)
  const buttonRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closePanel()
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closePanel])

  // Trap focus in panel
  useEffect(() => {
    if (!isOpen || !panelRef.current) return

    const focusableElements = panelRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTab = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleTab)
    firstElement?.focus()

    return () => document.removeEventListener('keydown', handleTab)
  }, [isOpen])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target) && !buttonRef.current?.contains(e.target)) {
        closePanel()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, closePanel])

  const themeOptions = [
    { value: 'light', label: 'Jasny', icon: Sun },
    { value: 'dark', label: 'Ciemny', icon: Moon },
    { value: 'system', label: 'Systemowy', icon: Monitor },
  ]

  const fontSizeOptions = [
    { value: 'normal', label: 'Normalny', size: 'A' },
    { value: 'large', label: 'Duży', size: 'A+' },
    { value: 'xlarge', label: 'Bardzo duży', size: 'A++' },
  ]

  const lineHeightOptions = [
    { value: 'normal', label: 'Normalna' },
    { value: 'relaxed', label: 'Rozluźniona' },
    { value: 'loose', label: 'Duża' },
  ]

  const letterSpacingOptions = [
    { value: 'normal', label: 'Normalny' },
    { value: 'wide', label: 'Szeroki' },
    { value: 'wider', label: 'Bardzo szeroki' },
  ]

  return (
    <>
      {/* Accessibility Toggle Button */}
      <button
        ref={buttonRef}
        onClick={togglePanel}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-primary-500 dark:bg-gold-500 text-white dark:text-primary-900 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-gold-300"
        aria-label="Otwórz panel dostępności"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <Accessibility size={28} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
      </button>

      {/* Panel Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Accessibility Panel */}
      <aside
        ref={panelRef}
        id="accessibility-panel"
        role="dialog"
        aria-label="Ustawienia dostępności"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 bg-primary-500 dark:bg-primary-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Accessibility size={24} aria-hidden="true" />
            <h2 className="text-lg font-semibold" id="panel-title">Dostępność</h2>
          </div>
          <button
            onClick={closePanel}
            className="p-2 hover:bg-primary-400 dark:hover:bg-primary-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Zamknij panel dostępności"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </header>

        <div className="p-4 space-y-6">
          {/* Theme Selection */}
          <section aria-labelledby="theme-heading">
            <h3 id="theme-heading" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              <Sun size={18} aria-hidden="true" />
              Motyw kolorystyczny
            </h3>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby="theme-heading">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSetting('theme', option.value)}
                  role="radio"
                  aria-checked={settings.theme === option.value}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    settings.theme === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <option.icon size={20} aria-hidden="true" />
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Font Size */}
          <section aria-labelledby="fontsize-heading">
            <h3 id="fontsize-heading" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              <ZoomIn size={18} aria-hidden="true" />
              Rozmiar tekstu
            </h3>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby="fontsize-heading">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSetting('fontSize', option.value)}
                  role="radio"
                  aria-checked={settings.fontSize === option.value}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    settings.fontSize === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className="text-xl font-bold" aria-hidden="true">{option.size}</span>
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Line Height */}
          <section aria-labelledby="lineheight-heading">
            <h3 id="lineheight-heading" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              <AlignJustify size={18} aria-hidden="true" />
              Interlinia (odstęp między wierszami)
            </h3>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby="lineheight-heading">
              {lineHeightOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSetting('lineHeight', option.value)}
                  role="radio"
                  aria-checked={settings.lineHeight === option.value}
                  className={`p-3 rounded-lg border-2 transition-all text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    settings.lineHeight === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {/* Letter Spacing */}
          <section aria-labelledby="spacing-heading">
            <h3 id="spacing-heading" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              <Space size={18} aria-hidden="true" />
              Odstęp między literami
            </h3>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby="spacing-heading">
              {letterSpacingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSetting('letterSpacing', option.value)}
                  role="radio"
                  aria-checked={settings.letterSpacing === option.value}
                  className={`p-3 rounded-lg border-2 transition-all text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    settings.letterSpacing === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {/* Toggle Options */}
          <section aria-labelledby="toggles-heading">
            <h3 id="toggles-heading" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              <Sparkles size={18} aria-hidden="true" />
              Dodatkowe opcje
            </h3>
            <div className="space-y-3">
              {/* High Contrast */}
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="flex items-center gap-3">
                  <Contrast size={20} className="text-gray-600 dark:text-gray-400" aria-hidden="true" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">Wysoki kontrast</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  aria-describedby="high-contrast-desc"
                />
              </label>
              <p id="high-contrast-desc" className="sr-only">Zwiększa kontrast kolorów dla lepszej widoczności</p>

              {/* Reduced Motion */}
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="flex items-center gap-3">
                  <Eye size={20} className="text-gray-600 dark:text-gray-400" aria-hidden="true" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">Ogranicz animacje</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                  className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  aria-describedby="reduced-motion-desc"
                />
              </label>
              <p id="reduced-motion-desc" className="sr-only">Wyłącza lub ogranicza animacje na stronie</p>

              {/* Focus Highlight */}
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="flex items-center gap-3">
                  <Focus size={20} className="text-gray-600 dark:text-gray-400" aria-hidden="true" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">Podświetlenie fokusa</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.focusHighlight}
                  onChange={(e) => updateSetting('focusHighlight', e.target.checked)}
                  className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  aria-describedby="focus-desc"
                />
              </label>
              <p id="focus-desc" className="sr-only">Wyraźniejsze podświetlenie elementów podczas nawigacji klawiaturą</p>

              {/* Dyslexia Font */}
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="flex items-center gap-3">
                  <Type size={20} className="text-gray-600 dark:text-gray-400" aria-hidden="true" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">Czcionka dla dyslektyków</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.dyslexiaFont}
                  onChange={(e) => updateSetting('dyslexiaFont', e.target.checked)}
                  className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  aria-describedby="dyslexia-desc"
                />
              </label>
              <p id="dyslexia-desc" className="sr-only">Używa czcionki ułatwiającej czytanie osobom z dysleksją</p>
            </div>
          </section>

          {/* Quick Presets */}
          <section aria-labelledby="presets-heading">
            <h3 id="presets-heading" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              <Sparkles size={18} aria-hidden="true" />
              Tryby szybkiego dostępu
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  updateSetting('fontSize', 'xlarge')
                  updateSetting('lineHeight', 'loose')
                  updateSetting('highContrast', true)
                }}
                className="w-full p-3 text-left bg-gold-50 dark:bg-gold-900/30 border-2 border-gold-200 dark:border-gold-700 rounded-lg hover:bg-gold-100 dark:hover:bg-gold-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <span className="font-semibold text-gold-700 dark:text-gold-300 block">Tryb dla seniorów</span>
                <span className="text-xs text-gold-600 dark:text-gold-400">Duży tekst, wysoki kontrast, większa interlinia</span>
              </button>

              <button
                onClick={() => {
                  updateSetting('dyslexiaFont', true)
                  updateSetting('letterSpacing', 'wide')
                  updateSetting('lineHeight', 'relaxed')
                }}
                className="w-full p-3 text-left bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="font-semibold text-blue-700 dark:text-blue-300 block">Tryb dla dyslektyków</span>
                <span className="text-xs text-blue-600 dark:text-blue-400">Specjalna czcionka, większe odstępy</span>
              </button>
            </div>
          </section>

          {/* Reset Button */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={resetSettings}
              className="w-full flex items-center justify-center gap-2 p-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <RotateCcw size={18} aria-hidden="true" />
              <span>Przywróć domyślne ustawienia</span>
            </button>
          </div>

          {/* WCAG Info */}
          <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
            <p className="text-xs text-primary-700 dark:text-primary-300 leading-relaxed">
              Ta strona spełnia standardy dostępności <strong>WCAG 2.2</strong> na poziomie AA.
              Jeśli masz problemy z korzystaniem ze strony, skontaktuj się z nami.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AccessibilityPanel
