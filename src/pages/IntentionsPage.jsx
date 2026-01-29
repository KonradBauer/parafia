import { BookOpen, Clock, Loader2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useIntentions } from '../hooks/useApi'

function IntentionsPage() {
  const { data: intention, loading, error } = useIntentions()

  return (
    <>
      <PageHeader
        title="Intencje Mszalne"
        subtitle="Aktualne intencje mszalne"
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
          ) : intention ? (
            <div className="max-w-4xl mx-auto">
              {intention.title && (
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary-600 dark:text-primary-300 text-center mb-8">
                  {intention.title}
                </h2>
              )}

              <div
                className="intentions-content bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8"
                dangerouslySetInnerHTML={{ __html: intention.content }}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <BookOpen size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Brak intencji</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Intencje zostaną dodane wkrótce
              </p>
            </div>
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
