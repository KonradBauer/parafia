import { Link } from 'react-router-dom'
import {
  Clock,
  BookOpen,
  FileText,
  Phone,
  Calendar,
  MapPin,
  ArrowRight,
  ChevronRight,
  Church,
  Loader2
} from 'lucide-react'
import { useMassTimes, useAnnouncements, useEvents, useGallery, useParishInfo } from '../hooks/useApi'

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })
}

const getMediaUrl = (url) => url

// Hero Section
function HeroSection() {
  const { data: massTimes, loading } = useMassTimes()

  // Grupuj godziny mszy według typu dnia
  const sundayMasses = massTimes?.filter(m => m.dayType === 'sunday') || []
  const weekdayMasses = massTimes?.filter(m => m.dayType === 'weekday') || []

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border border-gold-400/30 rounded-full" />
          <div className="absolute bottom-20 right-20 w-96 h-96 border border-gold-400/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold-400/10 rounded-full" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-500/20 rounded-full border-2 border-gold-400/50">
              <span className="text-gold-400 text-4xl font-serif">✝</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 text-shadow animate-slide-up">
            Parafia Trójcy
            <span className="block text-gold-400">Przenajświętszej</span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-100 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            w Przystajni
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-lg font-medium text-gold-400 mb-4 flex items-center justify-center gap-2">
              <Clock size={20} />
              Msze Święte
            </h2>
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 size={24} className="animate-spin text-white" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold text-gold-300 mb-2">Niedziele i Święta</h3>
                  <p className="text-primary-100">
                    {sundayMasses.length > 0
                      ? sundayMasses.map(m => m.time).join(', ')
                      : '8:00, 10:00, 12:00, 18:00'}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold text-gold-300 mb-2">Dni powszednie</h3>
                  <p className="text-primary-100">
                    {weekdayMasses.length > 0
                      ? weekdayMasses.map(m => m.time).join(', ')
                      : '7:00, 18:00'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/ogloszenia" className="btn-secondary inline-flex items-center justify-center gap-2">
              <FileText size={20} />
              Ogłoszenia parafialne
            </Link>
            <Link to="/intencje" className="btn-outline border-white text-white hover:bg-white hover:text-primary-500 inline-flex items-center justify-center gap-2">
              <BookOpen size={20} />
              Intencje mszalne
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  )
}

// Quick Access Cards
function QuickAccessSection() {
  const cards = [
    {
      icon: FileText,
      title: 'Kancelaria',
      description: 'Dokumenty i sakramenty',
      link: '/kancelaria',
      color: 'bg-gold-500',
    },
    {
      icon: BookOpen,
      title: 'Intencje',
      description: 'Intencje mszalne na tydzień',
      link: '/intencje',
      color: 'bg-burgundy-500',
    },
    {
      icon: Phone,
      title: 'Kontakt',
      description: 'Skontaktuj się z parafią',
      link: '/kontakt',
      color: 'bg-primary-400',
    },
  ]

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {cards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="group card flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`${card.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <card.icon size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-primary-500 dark:text-primary-300 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{card.description}</p>
              <span className="mt-4 text-gold-500 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Zobacz więcej
                <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// Announcements Section
function AnnouncementsSection() {
  const { data: allAnnouncements, loading } = useAnnouncements()
  const announcements = allAnnouncements?.slice(0, 3) || []

  return (
    <section className="py-16 md:py-20 bg-cream-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-gold-500 font-medium mb-2">Aktualności</span>
          <h2 className="section-title">Ogłoszenia Parafialne</h2>
          <p className="section-subtitle">
            Bądź na bieżąco z życiem naszej wspólnoty
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={40} className="text-primary-500 animate-spin" />
          </div>
        ) : announcements && announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {announcements.map((item) => (
              <article
                key={item.id}
                className="card group cursor-pointer hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={16} className="text-gold-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.date)}
                  </span>
                  {item.isNew && (
                    <span className="bg-burgundy-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Nowe
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-serif font-semibold text-primary-500 dark:text-primary-300 mb-3 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                  {typeof item.content === 'string' ? item.content : item.content?.[0]?.children?.[0]?.text || ''}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Link
                    to="/ogloszenia"
                    className="text-gold-500 font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Czytaj więcej
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">Brak ogłoszeń</p>
        )}

        <div className="text-center">
          <Link to="/ogloszenia" className="btn-primary inline-flex items-center gap-2">
            Wszystkie ogłoszenia
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// About Section
function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <Church size={120} className="text-primary-300" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-primary-500/10">
                <p className="text-primary-400 text-sm">Zdjęcie kościoła</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gold-500/10 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-500/10 rounded-full -z-10" />
          </div>

          <div>
            <span className="inline-block text-gold-500 font-medium mb-2">O nas</span>
            <h2 className="section-title text-left">Nasza Parafia</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Parafia pw. Trójcy Przenajświętszej w Przystajni to wspólnota wiernych z bogatą historią sięgającą wielu wieków.
              Nasz kościół jest miejscem modlitwy, spotkania z Bogiem i budowania więzi międzyludzkich.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Zapraszamy wszystkich do uczestnictwa w życiu parafialnym - w Mszach Świętych,
              nabożeństwach, spotkaniach formacyjnych i wspólnotowych.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-cream-100 dark:bg-gray-800 rounded-xl">
                <div className="text-3xl font-serif font-bold text-primary-500 dark:text-primary-300">500+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">lat historii</div>
              </div>
              <div className="text-center p-4 bg-cream-100 dark:bg-gray-800 rounded-xl">
                <div className="text-3xl font-serif font-bold text-gold-500 dark:text-gold-400">1000+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">parafian</div>
              </div>
              <div className="text-center p-4 bg-cream-100 dark:bg-gray-800 rounded-xl">
                <div className="text-3xl font-serif font-bold text-burgundy-500 dark:text-burgundy-400">4</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Msze dziennie</div>
              </div>
            </div>

            <Link to="/historia" className="btn-primary inline-flex items-center gap-2">
              Poznaj naszą historię
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Events Section
function EventsSection() {
  const { data: allEvents, loading } = useEvents()
  const events = allEvents?.slice(0, 3) || []

  const formatEventDate = (dateString) => {
    const date = new Date(dateString)
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString('pl-PL', { month: 'short' }).toUpperCase().replace('.', '')
    }
  }

  return (
    <section className="py-16 md:py-20 bg-primary-500 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-gold-400 font-medium mb-2">Kalendarz</span>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
            Nadchodzące Wydarzenia
          </h2>
          <p className="text-primary-200 max-w-2xl mx-auto">
            Ważne daty i uroczystości w naszej parafii
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={40} className="text-white animate-spin" />
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {events.map((event) => {
              const { day, month } = formatEventDate(event.date)
              return (
                <div
                  key={event.id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gold-500 text-primary-900 rounded-xl p-3 text-center min-w-[70px]">
                      <div className="text-2xl font-bold">{day}</div>
                      <div className="text-xs font-medium uppercase">{month}</div>
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-lg mb-1">
                        {event.title}
                      </h3>
                      {event.time && (
                        <p className="text-primary-200 text-sm flex items-center gap-1">
                          <Clock size={14} />
                          {event.time}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-primary-200 py-8">Brak nadchodzących wydarzeń</p>
        )}
      </div>
    </section>
  )
}

// Gallery Preview Section
function GalleryPreviewSection() {
  const { data: allImages, loading } = useGallery()
  const images = allImages?.slice(0, 6) || []

  return (
    <section className="py-16 md:py-20 bg-cream-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-gold-500 font-medium mb-2">Galeria</span>
          <h2 className="section-title">Z życia parafii</h2>
          <p className="section-subtitle">
            Wspomnienia z ważnych wydarzeń i uroczystości
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={40} className="text-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {(images && images.length > 0 ? images : Array(6).fill(null)).map((image, index) => {
              const imageUrl = image ? getMediaUrl(image.image) : null
              return (
                <div
                  key={image?.id || index}
                  className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl overflow-hidden relative group cursor-pointer"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Church size={40} className="text-primary-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/50 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      {image?.title || 'Zobacz'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="text-center">
          <Link to="/galeria" className="btn-outline inline-flex items-center gap-2">
            Zobacz całą galerię
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  const { data: parishInfo } = useParishInfo()

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <span className="inline-block text-gold-500 font-medium mb-2">Kontakt</span>
            <h2 className="section-title text-left">Skontaktuj się z nami</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Zapraszamy do kontaktu z kancelarią parafialną. Chętnie odpowiemy na wszystkie pytania.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-cream-100 dark:bg-gray-800 rounded-xl">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-500 dark:text-primary-300">Adres</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {parishInfo?.address || 'ul. Rynek 21, 42-141 Przystajń'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-cream-100 dark:bg-gray-800 rounded-xl">
                <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-500 dark:text-primary-300">Telefon</h3>
                  <a
                    href={`tel:${parishInfo?.phone || '+48343191029'}`}
                    className="text-gray-600 dark:text-gray-300 hover:text-gold-500 transition-colors"
                  >
                    {parishInfo?.phone || '34 319 10 29'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-cream-100 dark:bg-gray-800 rounded-xl">
                <div className="w-12 h-12 bg-burgundy-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-500 dark:text-primary-300">Kancelaria czynna</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {parishInfo?.officeHoursWeekday || 'Pon - Pt: 8:00 - 9:00 oraz 16:00 - 17:00'}
                  </p>
                </div>
              </div>
            </div>

            <Link to="/kontakt" className="btn-primary inline-flex items-center gap-2">
              Formularz kontaktowy
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="text-primary-300 dark:text-primary-400 mx-auto mb-4" />
              <p className="text-primary-400 dark:text-gray-300">Mapa Google Maps</p>
              <p className="text-primary-300 dark:text-gray-400 text-sm">
                {parishInfo?.address || 'ul. Rynek 21, 42-141 Przystajń'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Main HomePage component
function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickAccessSection />
      <AnnouncementsSection />
      <AboutSection />
      <EventsSection />
      <GalleryPreviewSection />
      <ContactSection />
    </>
  )
}

export default HomePage
