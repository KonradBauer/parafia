import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import PageHeader from '../components/PageHeader'

function IntentionsPage() {
  const [currentWeek, setCurrentWeek] = useState(0)

  const weeks = [
    {
      dateRange: '13-19 Stycznia 2026',
      days: [
        {
          day: 'Poniedziałek',
          date: '13.01',
          masses: [
            { time: '7:00', intention: '+ Jan Kowalski w 5. rocznicę śmierci' },
            { time: '18:00', intention: '+ Maria i Stanisław Nowak' },
          ],
        },
        {
          day: 'Wtorek',
          date: '14.01',
          masses: [
            { time: '7:00', intention: 'W intencji zdrowia dla rodziny Wiśniewskich' },
            { time: '18:00', intention: '+ Józef Mazur w 1. rocznicę śmierci' },
          ],
        },
        {
          day: 'Środa',
          date: '15.01',
          masses: [
            { time: '7:00', intention: '+ Anna Kaczmarek' },
            { time: '18:00', intention: 'Dziękczynna za otrzymane łaski z prośbą o dalsze błogosławieństwo' },
          ],
        },
        {
          day: 'Czwartek',
          date: '16.01',
          masses: [
            { time: '7:00', intention: '+ Rodzice i dziadkowie z rodziny Pawlaków' },
            { time: '18:00', intention: '+ Tadeusz Zając w 10. rocznicę śmierci' },
          ],
        },
        {
          day: 'Piątek',
          date: '17.01',
          masses: [
            { time: '7:00', intention: '+ Zofia i Władysław Duda' },
            { time: '18:00', intention: 'O Boże błogosławieństwo dla młodej pary' },
          ],
        },
        {
          day: 'Sobota',
          date: '18.01',
          masses: [
            { time: '7:00', intention: '+ Krystyna Wójcik w 30. dzień po śmierci' },
            { time: '18:00', intention: '+ Henryk i Jadwiga Szymańscy' },
          ],
        },
        {
          day: 'Niedziela',
          date: '19.01',
          isHighlight: true,
          masses: [
            { time: '8:00', intention: 'Za parafian' },
            { time: '10:00', intention: '+ Barbara Kowalczyk' },
            { time: '12:00', intention: '+ Piotr Lewandowski w 2. rocznicę śmierci' },
            { time: '18:00', intention: 'W intencji dzieci pierwszokomunijnych' },
          ],
        },
      ],
    },
    {
      dateRange: '20-26 Stycznia 2026',
      days: [
        {
          day: 'Poniedziałek',
          date: '20.01',
          masses: [
            { time: '7:00', intention: '+ Andrzej Nowak' },
            { time: '18:00', intention: '+ Rodzice z rodziny Jabłońskich' },
          ],
        },
      ],
    },
  ]

  const week = weeks[currentWeek]

  return (
    <>
      <PageHeader
        title="Intencje Mszalne"
        subtitle="Tygodniowy rozkład Mszy Świętych i intencji"
      />

      <section className="py-12 md:py-16 bg-cream-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {/* Week navigation */}
          <nav className="flex items-center justify-between max-w-4xl mx-auto mb-8" aria-label="Nawigacja tygodni">
            <button
              onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
              disabled={currentWeek === 0}
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
                {week.dateRange}
              </h2>
            </div>

            <button
              onClick={() => setCurrentWeek(Math.min(weeks.length - 1, currentWeek + 1))}
              disabled={currentWeek === weeks.length - 1}
              className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-gold-600 dark:hover:text-gold-400 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2"
              aria-label="Następny tydzień"
            >
              <span className="hidden sm:inline font-medium">Następny tydzień</span>
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </nav>

          {/* Intentions grid */}
          <div className="max-w-4xl mx-auto space-y-4">
            {week.days.map((day, idx) => (
              <article
                key={idx}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${
                  day.isHighlight ? 'ring-2 ring-gold-400' : ''
                }`}
              >
                {/* Day header - poprawiony kontrast */}
                <header
                  className={`px-6 py-3 ${
                    day.isHighlight
                      ? 'bg-gold-500 text-primary-900'
                      : 'bg-primary-600 dark:bg-primary-700 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{day.day}</span>
                    {/* Poprawiony kontrast daty */}
                    <time className={day.isHighlight ? 'text-primary-800 font-semibold' : 'text-white font-medium'}>
                      {day.date}
                    </time>
                  </div>
                </header>

                {/* Masses - poprawiony kontrast */}
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
                      {/* Poprawiony kontrast tekstu intencji */}
                      <p className="text-gray-800 dark:text-gray-200">{mass.intention}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Info box - poprawiony kontrast */}
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
