import { Church, BookOpen, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

function HistoryPage() {
  const timeline = [
    {
      year: '1406',
      title: 'Pierwsza wzmianka o parafii',
      description: 'Parafia istniała już w 1406 r. i należała do dekanatu lelowskiego w diecezji krakowskiej.',
    },
    {
      year: 'XV wiek',
      title: 'Drewniany kościół',
      description: 'Jan Długosz w swoim Liber Beneficiorum podał, że kościół był drewniany p.w. Podwyższenia Krzyża, a dziesięciny były przeznaczone dla biskupa krakowskiego.',
    },
    {
      year: 'XVIII wiek',
      title: 'Okres upadku',
      description: 'Z powodu bardzo skromnego uposażenia przez 40 lat w pierwszej połowie XVIII w. nie było tutaj proboszcza, a kościół popadł w ruinę.',
    },
    {
      year: '1752',
      title: 'Budowa nowego kościoła',
      description: 'Z fundacji D. Zabickiej, właścicielki wsi, wybudowano nowy kościół na miejscu zrujnowanej świątyni.',
    },
    {
      year: '1797',
      title: 'Wykończenie kościoła',
      description: 'Kościół został wykończony kosztem Antoniego Paciorkowskiego.',
    },
    {
      year: '1922-1923',
      title: 'Gruntowna restauracja i konsekracja',
      description: 'Staraniem ks. Adama Żora kościół został gruntownie odrestaurowany i konsekrowany 29 czerwca 1923 r. przez biskupa sufragana włocławskiego Władysława Krynickiego.',
    },
    {
      year: '1951-1953',
      title: 'Odnowienie świątyni',
      description: 'Staraniem ks. Jana Osmelaka kościół został ponownie odnowiony.',
    },
    {
      year: '1958',
      title: 'Restauracja ołtarzy',
      description: 'Za ks. Józefa Zawadzkiego odrestaurowano ołtarz główny, a za ks. Stanisława Milewskiego odnowiono ołtarze boczne, ufundowano nowe ławki, konfesjonały oraz drogę krzyżową.',
    },
    {
      year: 'Lata późniejsze',
      title: 'Dalsze prace remontowe',
      description: 'Staraniem ks. Jana Bałysa położono posadzkę granitową, prezbiterium wyłożono marmurem i założono witraże w oknach.',
    },
    {
      year: 'Współcześnie',
      title: 'Kontynuacja dzieła',
      description: 'Staraniem ks. Eugeniusza Lubiszewskiego i dzięki ofiarności wiernych położono dębową boazerię w całym kościele, pomalowano wnętrze, założono napęd mechaniczno-elektryczny dzwonów oraz wybudowano kaplicę na cmentarzu grzebalnym.',
    },
  ]

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
                <span className="inline-block text-gold-600 dark:text-gold-400 font-semibold mb-2">O parafii</span>
                <h2 className="text-3xl font-serif font-bold text-primary-600 dark:text-primary-300 mb-4">
                  Parafia Trójcy Przenajświętszej
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Parafia pw. Trójcy Przenajświętszej w Przystajni istnieje od co najmniej 1406 roku
                  i należała do dekanatu lelowskiego w diecezji krakowskiej. Przez wieki była duchowym
                  centrum dla mieszkańców Przystajni i okolicznych wiosek.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Obecny kościół parafialny został wzniesiony w 1752 roku z fundacji D. Zabickiej,
                  a wykończony w 1797 roku. Konsekrowany 29 czerwca 1923 roku przez biskupa
                  Władysława Krynickiego, jest świadectwem wiary pokoleń naszych przodków.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-2xl aspect-[4/3] flex items-center justify-center">
                <Church size={80} className="text-primary-400 dark:text-primary-500" aria-hidden="true" />
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

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-300 dark:bg-primary-700 transform md:-translate-x-1/2" aria-hidden="true" />

              {/* Timeline items */}
              {timeline.map((item, idx) => (
                <div
                  key={idx}
                  className={`relative flex items-start gap-6 mb-8 ${
                    idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-gold-500 rounded-full transform -translate-x-1/2 mt-6 z-10 ring-4 ring-cream-100 dark:ring-gray-900" aria-hidden="true" />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <article className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                      <span className="inline-block bg-primary-600 dark:bg-primary-500 text-white text-sm px-3 py-1 rounded-full mb-2 font-medium">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-primary-600 dark:text-primary-300 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{item.description}</p>
                    </article>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
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
                    Z parafii Przystajń pochodzi <strong>11 księży</strong>.
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
