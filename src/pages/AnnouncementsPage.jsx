import { Calendar, ChevronRight, FileText, Loader2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useAnnouncements } from '../hooks/useApi'

function AnnouncementsPage() {
  const { data: announcements, loading, error } = useAnnouncements()

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  // Funkcja do renderowania treści Rich Text ze Strapi
  const renderContent = (content) => {
    if (typeof content === 'string') {
      return content.split('\n').map((line, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <ChevronRight
            size={20}
            className="text-gold-600 dark:text-gold-400 mt-0.5 flex-shrink-0"
            aria-hidden="true"
          />
          <span className="text-gray-800 dark:text-gray-200 leading-relaxed text-base">
            {line}
          </span>
        </li>
      ))
    }

    // Rich Text z Strapi (array of blocks)
    if (Array.isArray(content)) {
      return content.map((block, idx) => {
        if (block.type === 'paragraph' && block.children) {
          const text = block.children.map(child => child.text).join('')
          if (!text.trim()) return null
          return (
            <li key={idx} className="flex items-start gap-3">
              <ChevronRight
                size={20}
                className="text-gold-600 dark:text-gold-400 mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-gray-800 dark:text-gray-200 leading-relaxed text-base">
                {text}
              </span>
            </li>
          )
        }
        if (block.type === 'list' && block.children) {
          return block.children.map((item, itemIdx) => (
            <li key={`${idx}-${itemIdx}`} className="flex items-start gap-3">
              <ChevronRight
                size={20}
                className="text-gold-600 dark:text-gold-400 mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-gray-800 dark:text-gray-200 leading-relaxed text-base">
                {item.children?.map(child => child.text).join('')}
              </span>
            </li>
          ))
        }
        return null
      }).filter(Boolean)
    }

    return null
  }

  return (
    <>
      <PageHeader
        title="Ogłoszenia Parafialne"
        subtitle="Bądź na bieżąco z aktualnościami i informacjami z życia parafii"
      />

      <section className="py-12 md:py-16 bg-cream-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={48} className="text-primary-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">Wystąpił błąd podczas ładowania ogłoszeń.</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Spróbuj ponownie
              </button>
            </div>
          ) : announcements && announcements.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-8">
              {announcements.map((announcement, index) => (
                <article
                  key={announcement.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                  aria-labelledby={`announcement-${announcement.id}-title`}
                >
                  <header className="bg-primary-600 dark:bg-primary-700 text-white px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Calendar size={20} className="text-gold-300" aria-hidden="true" />
                        <time className="font-semibold text-white">
                          {formatDate(announcement.date)}
                        </time>
                        {(announcement.isNew || index === 0) && (
                          <span className="bg-gold-400 text-primary-900 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">
                            Najnowsze
                          </span>
                        )}
                      </div>
                      {announcement.week && (
                        <span className="text-gold-200 font-medium text-sm">{announcement.week}</span>
                      )}
                    </div>
                  </header>

                  <div className="p-6 md:p-8">
                    <h2
                      id={`announcement-${announcement.id}-title`}
                      className="text-2xl font-serif font-bold text-primary-600 dark:text-primary-300 mb-5 flex items-center gap-3"
                    >
                      <FileText size={26} className="text-gold-600 dark:text-gold-400" aria-hidden="true" />
                      {announcement.title}
                    </h2>
                    <ul className="space-y-4" role="list">
                      {renderContent(announcement.content)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Brak ogłoszeń do wyświetlenia</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default AnnouncementsPage
