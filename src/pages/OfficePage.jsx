import {
  Clock,
  FileText,
  Heart,
  Baby,
  Church,
  Users,
  Cross,
  BookOpen,
  AlertCircle,
  Phone,
  User,
  Loader2
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { usePriests, useMassTimes, useParishInfo } from '../hooks/useApi'
import { getImageUrl } from '../services/api'

const roleLabels = {
  proboszcz: 'Proboszcz',
  wikariusz: 'Wikariusz',
}

const sacraments = [
  {
    icon: Baby,
    title: 'Chrzest Święty',
    description: 'Sakrament chrztu świętego udzielany jest w II i IV niedzielę miesiąca podczas Mszy Świętej o godz. 12:00.',
    requirements: [
      'Akt urodzenia dziecka z USC',
      'Świadectwo ślubu kościelnego rodziców',
      'Dane chrzestnych (imię, nazwisko, adres)',
      'Zaświadczenia dla chrzestnych z ich parafii',
    ],
  },
  {
    icon: BookOpen,
    title: 'I Komunia Święta',
    description: 'Przygotowanie do I Komunii Świętej trwa dwa lata i odbywa się w ramach katechezy szkolnej.',
    requirements: [
      'Świadectwo chrztu dziecka',
      'Regularne uczestnictwo w katechezie',
      'Uczestnictwo w rekolekcjach',
    ],
  },
  {
    icon: Church,
    title: 'Bierzmowanie',
    description: 'Sakrament bierzmowania przyjmuje młodzież klas ósmych po dwuletnim przygotowaniu.',
    requirements: [
      'Świadectwo chrztu',
      'Świadectwo I Komunii Świętej',
      'Uczestnictwo w katechezie i spotkaniach',
      'Wybór świadka bierzmowania',
    ],
  },
  {
    icon: Heart,
    title: 'Sakrament Małżeństwa',
    description: 'Narzeczeni powinni zgłosić się do kancelarii parafialnej minimum 3 miesiące przed planowaną datą ślubu.',
    requirements: [
      'Świadectwa chrztu (nie starsze niż 6 miesięcy)',
      'Świadectwa bierzmowania',
      'Dowody osobiste',
      'Zaświadczenie z USC (ślub konkordatowy)',
      'Świadectwo ukończenia kursu przedmałżeńskiego',
      'Zaświadczenie o wygłoszonych zapowiedziach',
    ],
  },
  {
    icon: Cross,
    title: 'Pogrzeb Katolicki',
    description: 'W przypadku śmierci bliskiej osoby prosimy o kontakt z kancelarią parafialną.',
    requirements: [
      'Akt zgonu z USC',
      'Karta zgonu od lekarza',
      'Zaświadczenie o przyjęciu sakramentów (jeśli możliwe)',
      'Ustalenie terminu i miejsca pogrzebu',
    ],
  },
  {
    icon: Users,
    title: 'Sakrament Chorych',
    description: 'Sakrament namaszczenia chorych udzielany jest osobom w podeszłym wieku lub ciężko chorym.',
    requirements: [
      'Kontakt telefoniczny z parafią',
      'W nagłych przypadkach dzwonić pod numer alarmowy',
    ],
  },
]

function OfficePage() {
  const { data: priests, loading: priestsLoading } = usePriests()
  const { data: massTimes, loading: massTimesLoading } = useMassTimes()
  const { data: parishInfo } = useParishInfo()

  const getMediaUrl = (url) => getImageUrl(url)

  // Grupuj godziny mszy według typu
  const sundayMasses = massTimes?.filter(m => m.dayType === 'sunday') || []
  const weekdayMasses = massTimes?.filter(m => m.dayType === 'weekday') || []

  return (
    <>
      <PageHeader
        title="Kancelaria Parafialna"
        subtitle="Informacje o sakramentach i wymaganych dokumentach"
      />

      {/* Duszpasterze */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-gold-600 dark:text-gold-400 font-semibold mb-2">Duszpasterze</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-600 dark:text-primary-300">
              Kapłani posługujący w parafii
            </h2>
          </div>

          {priestsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={40} className="text-primary-500 animate-spin" />
            </div>
          ) : priests && priests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {priests.map((priest) => {
                const photoUrl = getMediaUrl(priest.photo)
                return (
                  <article key={priest.id} className="bg-cream-100 dark:bg-gray-700 rounded-2xl p-6 text-center shadow-md">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={priest.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <User size={36} className="text-white" aria-hidden="true" />
                      </div>
                    )}
                    <h3 className="text-xl font-serif font-bold text-primary-600 dark:text-primary-300 mb-1">
                      {priest.name}
                    </h3>
                    <p className="text-gold-600 dark:text-gold-400 font-semibold mb-3">
                      {roleLabels[priest.role] || priest.role}
                    </p>
                    {priest.phone && (
                      <a
                        href={`tel:${priest.phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                      >
                        <Phone size={18} aria-hidden="true" />
                        {priest.phone}
                      </a>
                    )}
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Informacje o duszpasterzach zostaną dodane wkrótce.
            </p>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-cream-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {/* Office hours & Mass times */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Office hours */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center" aria-hidden="true">
                    <Clock size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-primary-600 dark:text-primary-300">
                    Godziny kancelarii
                  </h2>
                </div>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div>
                    <span className="font-semibold">Poniedziałek - Piątek:</span>
                    <p>{parishInfo?.officeHoursWeekday || '8:00 - 9:00 oraz 16:00 - 17:00'}</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    W sprawach pilnych kontakt telefoniczny lub osobisty w zakrystii.
                  </p>
                </div>
              </div>

              {/* Mass times */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center" aria-hidden="true">
                    <Church size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-primary-600 dark:text-primary-300">
                    Msze Święte
                  </h2>
                </div>
                {massTimesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 size={24} className="animate-spin text-primary-500" />
                  </div>
                ) : (
                  <div className="space-y-3 text-gray-700 dark:text-gray-300">
                    <div>
                      <span className="font-semibold text-gold-600 dark:text-gold-400">Niedziele:</span>
                      <p>{sundayMasses.length > 0 ? sundayMasses.map(m => m.time).join(', ') : '8:00, 10:00, 12:00, 18:00'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gold-600 dark:text-gold-400">Dni powszednie:</span>
                      <p>{weekdayMasses.length > 0 ? weekdayMasses.map(m => m.time).join(', ') : '7:00, 18:00'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-burgundy-100 dark:bg-burgundy-900/30 border border-burgundy-300 dark:border-burgundy-700 rounded-xl flex items-start gap-3" role="alert">
              <AlertCircle size={20} className="text-burgundy-600 dark:text-burgundy-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-burgundy-800 dark:text-burgundy-200 text-sm">
                W okresie świąt i wakacji godziny urzędowania mogą ulec zmianie. Aktualne informacje podawane są w ogłoszeniach parafialnych.
              </p>
            </div>
          </div>

          {/* Sacraments */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-primary-600 dark:text-primary-300 text-center mb-8">
              Sakramenty i wymagane dokumenty
            </h2>

            <div className="space-y-6">
              {sacraments.map((sacrament, idx) => (
                <article
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <sacrament.icon size={24} className="text-white" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-serif font-bold text-primary-600 dark:text-primary-300 mb-2">
                          {sacrament.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{sacrament.description}</p>

                        <div className="bg-cream-100 dark:bg-gray-700 rounded-xl p-4">
                          <h4 className="text-sm font-bold text-primary-600 dark:text-primary-300 mb-2 flex items-center gap-2">
                            <FileText size={16} className="text-gold-600 dark:text-gold-400" aria-hidden="true" />
                            Wymagane dokumenty:
                          </h4>
                          <ul className="space-y-1" role="list">
                            {sacrament.requirements.map((req, reqIdx) => (
                              <li key={reqIdx} className="text-sm text-gray-800 dark:text-gray-200 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default OfficePage
