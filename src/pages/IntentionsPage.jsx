import { Calendar, Clock, ChevronLeft, ChevronRight, BookOpen, Loader2 } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import { useIntentions } from '../hooks/useApi'

function IntentionsPage() {
  const { data: weeks, loading, error } = useIntentions()

  const formatWeekRange = (start, end) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })} - ${endDate.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}`
  }

  const formatDateShort = (date) => {
    return new Date(date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
  }

  const getDayName = (date) => {
    return new Date(date).toLocaleDateString('pl-PL', { weekday: 'long' })
  }
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0)

  // Znajdź bieżący tydzień
  useEffect(() => {
    if (weeks && weeks.length > 0) {
      const today = new Date()
      const currentIndex = weeks.findIndex(week => {
        const start = new Date(week.startDate)
        const end = new Date(week.endDate)
        return today >= start && today <= end
      })
      if (currentIndex !== -1) {
        setCurrentWeekIndex(currentIndex)
      }
    }
  }, [weeks])

  // Grupuj intencje według dni
  const currentWeek = weeks?.[currentWeekIndex]
  const dayGroups = useMemo(() => {
    if (!currentWeek?.intentions) return []

    const groups = {}
    currentWeek.intentions.forEach(intention => {
      const date = intention.date
      if (!groups[date]) {
        groups[date] = {
          date,
          dayName: getDayName(date),
          dateShort: formatDateShort(date),
          isSunday: new Date(date).getDay() === 0,
          masses: []
        }
      }
      groups[date].masses.push({
        time: intention.time,
        intention: intention.intention
      })
    })

    // Sortuj według daty i czasu
    return Object.values(groups)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(day => ({
        ...day,
        masses: day.masses.sort((a, b) => a.time.localeCompare(b.time))
      }))
  }, [currentWeek])

  const goToPreviousWeek = () => {
    setCurrentWeekIndex(prev => Math.max(0, prev - 1))
  }

  const goToNextWeek = () => {
    setCurrentWeekIndex(prev => Math.min((weeks?.length || 1) - 1, prev + 1))
  }

  return (
    <>
      <PageHeader
        title="Intencje Mszalne"
        subtitle="Tygodniowy rozkład Mszy Świętych i intencji"
      />

      <section className="py-12 md:py-16 bg-cream-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={48} className="text-primary-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">Wystąpił błąd podczas ładowania intencji.</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Spróbuj ponownie
              </button>
            </div>
          ) : weeks && weeks.length > 0 ? (
            <>
              {/* Week navigation */}
              <nav className="flex items-center justify-between max-w-4xl mx-auto mb-8" aria-label="Nawigacja tygodni">
                <button
                  onClick={goToPreviousWeek}
                  disabled={currentWeekIndex === 0}
                  className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-gold-600 dark:hover:text-gold-400 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2"
                  aria-label="Poprzedni tydzień"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                  <span className="hidden sm:inline font-medium">Poprzedni tydzień</span>
                </button>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gold-600 dark:text-gold-400 mb-1">
                    <Calendar size={20} aria-hidden="true" />
                    <span className="font-semibold">Tydzień</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-600 dark:text-primary-300">
                    {formatWeekRange(currentWeek.startDate, currentWeek.endDate)}
                  </h2>
                </div>

                <button
                  onClick={goToNextWeek}
                  disabled={currentWeekIndex === weeks.length - 1}
                  className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-gold-600 dark:hover:text-gold-400 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2"
                  aria-label="Następny tydzień"
                >
                  <span className="hidden sm:inline font-medium">Następny tydzień</span>
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </nav>

              {/* Intentions grid */}
              <div className="max-w-4xl mx-auto space-y-4">
                {dayGroups.map((day) => (
                  <article
                    key={day.date}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${
                      day.isSunday ? 'ring-2 ring-gold-400' : ''
                    }`}
                  >
                    <header
                      className={`px-6 py-3 ${
                        day.isSunday
                          ? 'bg-gold-500 text-primary-900'
                          : 'bg-primary-600 dark:bg-primary-700 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold capitalize">{day.dayName}</span>
                        <time className={day.isSunday ? 'text-primary-800 font-semibold' : 'text-white font-medium'}>
                          {day.dateShort}
                        </time>
                      </div>
                    </header>

                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {day.masses.map((mass, massIdx) => (
                        <div
                          key={massIdx}
                          className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                        >
                          <div className="flex items-center gap-2 text-gold-600 dark:text-gold-400 font-bold min-w-[80px]">
                            <Clock size={16} aria-hidden="true" />
                            <time>{mass.time}</time>
                          </div>
                          <p className="text-gray-800 dark:text-gray-200">{mass.intention}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <BookOpen size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Brak intencji do wyświetlenia</p>
            </div>
          )}

          {/* Info box */}
          <aside className="max-w-4xl mx-auto mt-8">
            <div className="bg-primary-100 dark:bg-primary-900/50 border border-primary-300 dark:border-primary-700 rounded-xl p-6">
              <h3 className="text-lg font-serif font-bold text-primary-700 dark:text-primary-300 mb-2">
                Zamawianie intencji mszalnych
              </h3>
              <p className="text-gray-800 dark:text-gray-200 mb-4">
                Intencje mszalne można zamawiać w kancelarii parafialnej w godzinach urzędowania
                lub w zakrystii przed i po Mszy Świętej.
              </p>
              <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300 font-medium">
                <Clock size={16} aria-hidden="true" />
                <span>Kancelaria: Pon-Pt 8:00-9:00 oraz 16:00-17:00</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

export default IntentionsPage
