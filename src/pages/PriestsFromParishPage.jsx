import { User, Calendar, ArrowLeft, Users, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import { usePriestsFromParish } from '../hooks/useApi'

function PriestsFromParishPage() {
  const { data: priests, loading, error } = usePriestsFromParish()

  // Grupowanie według dekad
  const { groupedByDecade, decades, firstYear } = useMemo(() => {
    if (!priests || priests.length === 0) {
      return { groupedByDecade: {}, decades: [], firstYear: null }
    }

    const grouped = priests.reduce((acc, priest) => {
      const year = priest.ordinationYear || priest.year
      if (!year) return acc

      const decade = Math.floor(year / 10) * 10
      if (!acc[decade]) {
        acc[decade] = []
      }
      acc[decade].push(priest)
      return acc
    }, {})

    const sortedDecades = Object.keys(grouped).sort((a, b) => a - b)
    const first = priests.reduce((min, p) => {
      const year = p.ordinationYear || p.year
      return year && year < min ? year : min
    }, Infinity)

    return {
      groupedByDecade: grouped,
      decades: sortedDecades,
      firstYear: first !== Infinity ? first : null
    }
  }, [priests])

  return (
    <>
      <PageHeader
        title="Księża pochodzący z parafii"
        subtitle="Kapłani, którzy wyrośli z naszej wspólnoty parafialnej"
      />

      <section className="py-12 md:py-16 bg-cream-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <div className="max-w-4xl mx-auto mb-8">
            <Link
              to="/historia"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-gold-600 dark:hover:text-gold-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1"
            >
              <ArrowLeft size={20} aria-hidden="true" />
              <span className="font-medium">Powrót do historii parafii</span>
            </Link>
          </div>

          {/* Introduction */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                Z parafii Trójcy Przenajświętszej w Przystajni pochodzi wielu kapłanów,
                którzy odpowiedzieli na Boże powołanie i poświęcili swoje życie służbie Kościołowi.
                Są oni dumą naszej wspólnoty i dowodem żywej wiary przekazywanej z pokolenia na pokolenie.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={48} className="text-primary-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">Wystąpił błąd podczas ładowania danych.</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Spróbuj ponownie
              </button>
            </div>
          ) : priests && priests.length > 0 ? (
            <>
              {/* Stats */}
              <div className="max-w-4xl mx-auto mb-12">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-primary-600 dark:bg-primary-700 text-white rounded-xl p-6 text-center">
                    <div className="text-4xl font-serif font-bold mb-1">{priests.length}</div>
                    <div className="text-primary-100">Kapłanów</div>
                  </div>
                  <div className="bg-gold-500 text-primary-900 rounded-xl p-6 text-center">
                    <div className="text-4xl font-serif font-bold mb-1">{decades.length}</div>
                    <div className="text-primary-800">Dekad powołań</div>
                  </div>
                  <div className="bg-burgundy-500 text-white rounded-xl p-6 text-center col-span-2 md:col-span-1">
                    <div className="text-4xl font-serif font-bold mb-1">{firstYear}</div>
                    <div className="text-burgundy-100">Pierwsze święcenia</div>
                  </div>
                </div>
              </div>

              {/* Priests list by decade */}
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-serif font-bold text-primary-600 dark:text-primary-300 text-center mb-8">
                  Lista kapłanów według roku święceń
                </h2>

                <div className="space-y-8">
                  {decades.map((decade) => (
                    <div key={decade}>
                      {/* Decade header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gold-500 text-primary-900 px-4 py-2 rounded-lg font-bold">
                          Lata {decade}.
                        </div>
                        <div className="flex-grow h-px bg-gold-300 dark:bg-gold-700" />
                      </div>

                      {/* Priests in decade */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupedByDecade[decade].map((priest) => (
                          <article
                            key={priest.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition-shadow"
                          >
                            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                              <User size={28} className="text-primary-600 dark:text-primary-400" aria-hidden="true" />
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-serif font-bold text-primary-600 dark:text-primary-300 text-lg">
                                {priest.name}
                                {priest.order && (
                                  <span className="ml-2 text-gold-600 dark:text-gold-400 text-sm font-sans">
                                    {priest.order}
                                  </span>
                                )}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                                <Calendar size={14} aria-hidden="true" />
                                <span>
                                  Święcenia: <strong className="text-gray-800 dark:text-gray-200">
                                    {priest.ordinationYear || priest.year}
                                  </strong>
                                </span>
                              </p>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Users size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Brak danych do wyświetlenia</p>
            </div>
          )}

          {/* Prayer intention */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-primary-600 dark:bg-primary-700 text-white rounded-2xl p-8 text-center">
              <p className="text-xl font-serif italic mb-4">
                "Proście Pana żniwa, żeby wyprawił robotników na swoje żniwo"
              </p>
              <p className="text-primary-200 text-sm">— Mt 9,38</p>
              <div className="mt-6 pt-6 border-t border-primary-500">
                <p className="text-primary-100">
                  Módlmy się za nowych kapłanów i o nowe powołania z naszej parafii.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PriestsFromParishPage
