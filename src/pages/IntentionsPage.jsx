import { Calendar, Clock, BookOpen, Loader2 } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import { useIntentions } from '../hooks/useApi'

const MONTHS = [
  { value: 1, label: 'Styczeń', short: 'Sty' },
  { value: 2, label: 'Luty', short: 'Lut' },
  { value: 3, label: 'Marzec', short: 'Mar' },
  { value: 4, label: 'Kwiecień', short: 'Kwi' },
  { value: 5, label: 'Maj', short: 'Maj' },
  { value: 6, label: 'Czerwiec', short: 'Cze' },
  { value: 7, label: 'Lipiec', short: 'Lip' },
  { value: 8, label: 'Sierpień', short: 'Sie' },
  { value: 9, label: 'Wrzesień', short: 'Wrz' },
  { value: 10, label: 'Październik', short: 'Paź' },
  { value: 11, label: 'Listopad', short: 'Lis' },
  { value: 12, label: 'Grudzień', short: 'Gru' },
]

function IntentionsPage() {
  const { data: months, loading, error } = useIntentions()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1) // 1-12
  const [currentYear] = useState(new Date().getFullYear())

  const formatDateShort = (date) => {
    return new Date(date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
  }

  const getDayName = (date) => {
    return new Date(date).toLocaleDateString('pl-PL', { weekday: 'long' })
  }

  // Get data for selected month
  const currentMonthData = useMemo(() => {
    if (!months) return null
    return months.find(m => m.year === currentYear && m.month === selectedMonth)
  }, [months, currentYear, selectedMonth])

  // Group intentions by days
  const dayGroups = useMemo(() => {
    if (!currentMonthData?.intentions) return []

    const groups = {}
    currentMonthData.intentions.forEach(intention => {
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

    // Sort by date and time
    return Object.values(groups)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(day => ({
        ...day,
        masses: day.masses.sort((a, b) => a.time.localeCompare(b.time))
      }))
  }, [currentMonthData])

  const getIntentionsCount = (month) => {
    if (!months) return 0
    const monthData = months.find(m => m.year === currentYear && m.month === month)
    return monthData?.intentions?.length || 0
  }

  const currentMonthNum = new Date().getMonth() + 1

  return (
    <>
      <PageHeader
        title="Intencje Mszalne"
        subtitle="Miesięczny rozkład Mszy Świętych i intencji"
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
          ) : (
            <>
              {/* Year display */}
              <div className="text-center mb-6">
                <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                  {currentYear}
                </span>
              </div>

              {/* Month tabs */}
              <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-4xl mx-auto">
                {MONTHS.map((month) => {
                  const count = getIntentionsCount(month.value)
                  const isCurrent = month.value === currentMonthNum
                  const isSelected = selectedMonth === month.value

                  return (
                    <button
                      key={month.value}
                      onClick={() => setSelectedMonth(month.value)}
                      className={`
                        relative px-4 py-2 rounded-full font-medium text-sm transition-all
                        ${isSelected
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700'
                        }
                        ${isCurrent && !isSelected ? 'ring-2 ring-primary-300 dark:ring-primary-600' : ''}
                      `}
                    >
                      <span className="hidden sm:inline">{month.label}</span>
                      <span className="sm:hidden">{month.short}</span>
                      {count > 0 && (
                        <span className={`
                          ml-1.5 text-xs px-1.5 py-0.5 rounded-full
                          ${isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                          }
                        `}>
                          {count}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold-500 rounded-full border-2 border-white dark:border-gray-900" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Selected month header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 text-gold-600 dark:text-gold-400 mb-1">
                  <Calendar size={20} />
                  <span className="font-semibold">Intencje na miesiąc</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary-600 dark:text-primary-300">
                  {MONTHS.find(m => m.value === selectedMonth)?.label} {currentYear}
                </h2>
              </div>

              {/* Intentions list */}
              <div className="max-w-4xl mx-auto space-y-4">
                {dayGroups.length > 0 ? (
                  dayGroups.map((day) => (
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
                              <Clock size={16} />
                              <time>{mass.time}</time>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200">{mass.intention}</p>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                    <BookOpen size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">Brak intencji w tym miesiącu</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                      Intencje zostaną dodane wkrótce
                    </p>
                  </div>
                )}
              </div>
            </>
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
                <Clock size={16} />
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
