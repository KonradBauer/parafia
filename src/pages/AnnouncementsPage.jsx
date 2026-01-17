import { Calendar, ChevronRight, FileText } from 'lucide-react'
import PageHeader from '../components/PageHeader'

function AnnouncementsPage() {
  const announcements = [
    {
      id: 1,
      date: '12 Stycznia 2026',
      week: 'II Niedziela Zwykła',
      title: 'Ogłoszenia Parafialne',
      content: [
        'W tym tygodniu rozpoczynamy wizytę duszpasterską - kolędę. Szczegółowy harmonogram dostępny jest w zakrystii oraz na tablicy ogłoszeń.',
        'W piątek po Mszy Świętej wieczornej adoracja Najświętszego Sakramentu.',
        'Zapraszamy na spotkanie Żywego Różańca w sobotę po rannej Mszy Świętej.',
        'Ofiary na ogrzewanie kościoła można składać w zakrystii lub na konto parafialne.',
        'Dziękujemy za wszystkie ofiary składane na potrzeby parafii.',
      ],
      isNew: true,
    },
    {
      id: 2,
      date: '5 Stycznia 2026',
      week: 'Uroczystość Objawienia Pańskiego',
      title: 'Ogłoszenia Parafialne',
      content: [
        'Dzisiaj Uroczystość Objawienia Pańskiego - Trzech Króli. Podczas Mszy Świętych poświęcenie kredy i kadzidła.',
        'Zachęcamy do święcenia wody, która będzie dostępna przy wejściu do kościoła.',
        'Rozpoczyna się czas kolędy. Prosimy o przygotowanie domów na wizytę duszpasterską.',
        'W przyszłą niedzielę II zbiórka na ogrzewanie kościoła.',
      ],
      isNew: false,
    },
    {
      id: 3,
      date: '29 Grudnia 2025',
      week: 'Niedziela Świętej Rodziny',
      title: 'Ogłoszenia Parafialne',
      content: [
        'Dzisiaj Niedziela Świętej Rodziny. Podczas Mszy Świętej o godz. 12:00 odnowienie przyrzeczeń małżeńskich.',
        'We wtorek 31 grudnia nabożeństwo dziękczynne za miniony rok o godz. 16:00.',
        'W środę 1 stycznia Uroczystość Świętej Bożej Rodzicielki. Msze Święte jak w niedzielę.',
        'Kancelaria parafialna w okresie świątecznym będzie nieczynna do 7 stycznia.',
      ],
      isNew: false,
    },
    {
      id: 4,
      date: '22 Grudnia 2025',
      week: 'IV Niedziela Adwentu',
      title: 'Ogłoszenia Parafialne',
      content: [
        'Dzisiaj IV Niedziela Adwentu. Zapraszamy na roraty w tym tygodniu o godz. 6:30.',
        'We wtorek 24 grudnia Wigilia Bożego Narodzenia. Pasterka o godz. 24:00.',
        'W środę 25 grudnia Uroczystość Bożego Narodzenia. Msze Święte: 8:00, 10:00, 12:00.',
        'W czwartek 26 grudnia Święto św. Szczepana. Msze Święte jak w niedzielę.',
        'Serdecznie dziękujemy za przygotowanie stroików świątecznych.',
      ],
      isNew: false,
    },
  ]

  return (
    <>
      <PageHeader
        title="Ogłoszenia Parafialne"
        subtitle="Bądź na bieżąco z aktualnościami i informacjami z życia parafii"
      />

      <section className="py-12 md:py-16 bg-cream-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                aria-labelledby={`announcement-${announcement.id}-title`}
              >
                {/* Header - poprawiony kontrast */}
                <header className="bg-primary-600 dark:bg-primary-700 text-white px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Calendar size={20} className="text-gold-300" aria-hidden="true" />
                      <time className="font-semibold text-white">{announcement.date}</time>
                      {announcement.isNew && (
                        <span className="bg-gold-400 text-primary-900 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">
                          Najnowsze
                        </span>
                      )}
                    </div>
                    {/* Poprawiony kontrast: z text-primary-200 na text-gold-200 */}
                    <span className="text-gold-200 font-medium text-sm">{announcement.week}</span>
                  </div>
                </header>

                {/* Content - poprawiony kontrast tekstu */}
                <div className="p-6 md:p-8">
                  <h2
                    id={`announcement-${announcement.id}-title`}
                    className="text-2xl font-serif font-bold text-primary-600 dark:text-primary-300 mb-5 flex items-center gap-3"
                  >
                    <FileText size={26} className="text-gold-600 dark:text-gold-400" aria-hidden="true" />
                    {announcement.title}
                  </h2>
                  <ul className="space-y-4" role="list">
                    {announcement.content.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <ChevronRight
                          size={20}
                          className="text-gold-600 dark:text-gold-400 mt-0.5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        {/* Poprawiony kontrast: z text-gray-700 na text-gray-800 dark:text-gray-200 */}
                        <span className="text-gray-800 dark:text-gray-200 leading-relaxed text-base">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Load more */}
          <div className="text-center mt-10">
            <button
              className="btn-outline"
              aria-label="Załaduj starsze ogłoszenia parafialne"
            >
              Załaduj starsze ogłoszenia
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default AnnouncementsPage
