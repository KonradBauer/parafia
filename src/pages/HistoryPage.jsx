import { Church, BookOpen, Users, ArrowRight, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useHistory, usePriestsFromParish, useHistoryAbout } from '../hooks/useApi'
import { getImageUrl } from '../services/api'

function HistoryPage() {
  const { data: historyItems, loading } = useHistory()
  const { data: priestsFromParish } = usePriestsFromParish()
  const { data: historyAbout } = useHistoryAbout()

  // Defaults for about section
  const aboutSubtitle = historyAbout?.subtitle || 'O parafii'
  const aboutTitle = historyAbout?.title || 'Parafia Trójcy Przenajświętszej'
  const aboutContent = historyAbout?.content || 'Parafia pw. Trójcy Przenajświętszej w Przystajni istnieje od co najmniej 1406 roku i należała do dekanatu lelowskiego w diecezji krakowskiej. Przez wieki była duchowym centrum dla mieszkańców Przystajni i okolicznych wiosek.\n\nObecny kościół parafialny został wzniesiony w 1752 roku z fundacji D. Zabickiej, a wykończony w 1797 roku. Konsekrowany 29 czerwca 1923 roku przez biskupa Władysława Krynickiego, jest świadectwem wiary pokoleń naszych przodków.'
  const aboutImageUrl = historyAbout?.imageUrl ? getImageUrl(historyAbout.imageUrl) : null

  // Split content into paragraphs
  const aboutParagraphs = aboutContent.split('\n').filter(p => p.trim())

  return (
    <>
      <PageHeader
        title="Historia Parafii"
        subtitle="Poznaj bogatą historię naszej wspólnoty sięgającą 1406 roku"
      />

      {/* Introduction */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block text-gold-600 dark:text-gold-400 font-semibold mb-2">{aboutSubtitle}</span>
                <h2 className="text-3xl font-serif font-bold text-primary-600 dark:text-primary-300 mb-4">
                  {aboutTitle}
                </h2>
                {aboutParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-2xl aspect-[4/3] flex items-center justify-center overflow-hidden">
                {aboutImageUrl ? (
                  <img
                    src={aboutImageUrl}
                    alt={aboutTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Church size={80} className="text-primary-400 dark:text-primary-500" aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 md:py-16 bg-cream-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-gold-600 dark:text-gold-400 font-semibold mb-2">Kronika</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-600 dark:text-primary-300 mb-4">
              Historia parafii na przestrzeni wieków
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={48} className="text-primary-500 animate-spin" />
            </div>
          ) : historyItems && historyItems.length > 0 ? (
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-300 dark:bg-primary-700 transform md:-translate-x-1/2" aria-hidden="true" />

                {historyItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`relative flex items-start gap-6 mb-8 ${
                      idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-gold-500 rounded-full transform -translate-x-1/2 mt-6 z-10 ring-4 ring-cream-100 dark:ring-gray-900" aria-hidden="true" />

                    <div className={`ml-12 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <article className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                        <span className="inline-block bg-primary-600 dark:bg-primary-500 text-white text-sm px-3 py-1 rounded-full mb-2 font-medium">
                          {item.year}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-primary-600 dark:text-primary-300 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {typeof item.content === 'string'
                            ? item.content
                            : item.content?.[0]?.children?.[0]?.text || ''}
                        </p>
                        {item.imageUrl && getImageUrl(item.imageUrl) && (
                          <img
                            src={getImageUrl(item.imageUrl)}
                            alt={item.title}
                            className="mt-4 rounded-lg w-full object-cover max-h-48"
                          />
                        )}
                      </article>
                    </div>

                    <div className="hidden md:block md:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Brak danych historycznych</p>
          )}
        </div>
      </section>

      {/* Priests from parish - Link section */}
      <section className="py-12 md:py-16 bg-cream-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/historia/ksieza-z-parafii"
              className="block bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow group focus:outline-none focus:ring-4 focus:ring-primary-500"
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-gold-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Users size={40} className="text-white" aria-hidden="true" />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-2xl font-serif font-bold text-primary-600 dark:text-primary-300 mb-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                    Księża pochodzący z parafii
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Poznaj kapłanów, którzy wyrośli z naszej wspólnoty parafialnej i odpowiedzieli na Boże powołanie.
                    {priestsFromParish && priestsFromParish.length > 0 && (
                      <> Z parafii Przystajń pochodzi <strong>{priestsFromParish.length} księży</strong>.</>
                    )}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-2 text-gold-600 dark:text-gold-400 font-semibold group-hover:gap-3 transition-all">
                    Zobacz listę
                    <ArrowRight size={20} aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Patrons */}
      <section className="py-12 md:py-16 bg-primary-600 dark:bg-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <BookOpen size={48} className="text-gold-400 mx-auto mb-6" aria-hidden="true" />
            <h2 className="text-3xl font-serif font-bold mb-4">
              Trójca Przenajświętsza - Patron Parafii
            </h2>
            <p className="text-white/90 leading-relaxed mb-6">
              Tajemnica Trójcy Świętej - jednego Boga w trzech Osobach: Ojca, Syna i Ducha Świętego -
              jest centralną prawdą wiary chrześcijańskiej. Uroczystość Trójcy Przenajświętszej
              obchodzona jest w pierwszą niedzielę po Zesłaniu Ducha Świętego i jest głównym
              odpustem parafialnym.
            </p>
            <p className="text-gold-400 font-semibold">
              Odpust parafialny: I niedziela po Zesłaniu Ducha Świętego
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default HistoryPage
