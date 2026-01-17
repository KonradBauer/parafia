import { User, Calendar, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

function PriestsFromParishPage() {
  const priests = [
    { name: 'Jerzy Tomziński', order: 'OSPPE', year: 1944 },
    { name: 'Józef Stemplewski', order: null, year: 1974 },
    { name: 'Sławomir Kandziora', order: null, year: 1988 },
    { name: 'Krzysztof Słomian', order: null, year: 1988 },
    { name: 'Włodzimierz Wiecha', order: null, year: 1988 },
    { name: 'Izaak Krawczyk', order: 'OFM', year: 1989 },
    { name: 'Marek Józef Jelonek', order: null, year: 1994 },
    { name: 'Jerzy Józef Wachowski', order: null, year: 1994 },
    { name: 'Jacek Mirosław Kurczaba', order: null, year: 1997 },
    { name: 'Mirosław Piotr Chrzęstek', order: null, year: 2006 },
    { name: 'Tomasz Jan Chrzęstek', order: null, year: 2006 },
  ]

  // Grupowanie według dekad
  const groupedByDecade = priests.reduce((acc, priest) => {
    const decade = Math.floor(priest.year / 10) * 10
    if (!acc[decade]) {
      acc[decade] = []
    }
    acc[decade].push(priest)
    return acc
  }, {})

  const decades = Object.keys(groupedByDecade).sort((a, b) => a - b)

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
                <div className="text-4xl font-serif font-bold mb-1">{priests[0].year}</div>
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
                    {groupedByDecade[decade].map((priest, idx) => (
                      <article
                        key={idx}
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
                            <span>Święcenia: <strong className="text-gray-800 dark:text-gray-200">{priest.year}</strong></span>
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

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
