import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Facebook, Youtube } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useParishInfo } from '../hooks/useApi'
import { sendContactMessage } from '../services/api'

function ContactPage() {
  const { data: parishInfo } = useParishInfo()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await sendContactMessage(formData)
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 5000)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Wystapil blad podczas wysylania wiadomosci. Sprobuj ponownie.')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Domyślne wartości jeśli API nie zwróci danych
  const contactInfo = {
    address: parishInfo?.address || 'ul. Rynek 21, 42-141 Przystajń',
    phone: parishInfo?.phone || '34 319 10 29',
    email: parishInfo?.email || 'przystajn@archidiecezja.pl',
    officeHoursWeekday: parishInfo?.officeHoursWeekday || 'Poniedziałek - Piątek: 8:00 - 9:00 oraz 16:00 - 17:00',
    officeHoursWeekend: parishInfo?.officeHoursWeekend || 'W sprawach pilnych prosimy o kontakt telefoniczny',
    bankAccount: parishInfo?.bankAccount || '15 1600 1462 1837 1383 2000 0001',
  }

  return (
    <>
      <PageHeader
        title="Kontakt"
        subtitle="Skontaktuj się z nami - chętnie odpowiemy na wszystkie pytania"
      />

      <section className="py-12 md:py-16 bg-cream-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-serif font-semibold text-primary-500 dark:text-primary-300 mb-6">
                Informacje kontaktowe
              </h2>

              <div className="space-y-4 mb-8">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-500 dark:text-primary-300 mb-1">Adres</h3>
                    <p className="text-gray-600 dark:text-gray-300">{contactInfo.address}</p>
                  </div>
                </a>

                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-500 dark:text-primary-300 mb-1">Telefon</h3>
                    <p className="text-gray-600 dark:text-gray-300">{contactInfo.phone}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Kancelaria parafialna</p>
                  </div>
                </a>

                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-burgundy-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-500 dark:text-primary-300 mb-1">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">{contactInfo.email}</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-primary-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-500 dark:text-primary-300 mb-1">Godziny kancelarii</h3>
                    <p className="text-gray-600 dark:text-gray-300">{contactInfo.officeHoursWeekday}</p>
                  </div>
                </div>
              </div>

              {/* Social media */}
              <div className="mb-8">
                <h3 className="font-semibold text-primary-500 dark:text-primary-300 mb-3">Śledź nas</h3>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/parafiatrojcyprzystajn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#1877F2] rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                    aria-label="Facebook"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href="https://www.youtube.com/@ParafiaTrojcyPrzenajswietszej"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#FF0000] rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                    aria-label="YouTube"
                  >
                    <Youtube size={24} />
                  </a>
                </div>
              </div>

              {/* Bank account */}
              <div className="bg-primary-500 dark:bg-primary-600 text-white rounded-xl p-6">
                <h3 className="font-semibold mb-3">Numer konta parafialnego</h3>
                <p className="text-primary-200 text-sm mb-2">BNP PARIBAS</p>
                <p className="font-mono text-gold-400 break-all">
                  {contactInfo.bankAccount}
                </p>
                <p className="text-primary-200 text-sm mt-3">
                  Parafia Rzymskokatolicka pw. Trójcy Przenajświętszej w Przystajni
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-serif font-semibold text-primary-500 dark:text-primary-300 mb-6">
                  Napisz do nas
                </h2>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-primary-500 dark:text-primary-300 mb-2">
                      Wiadomość wysłana!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Imię i nazwisko *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Jan Kowalski"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="jan@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="123 456 789"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Temat *
                      </label>
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Wybierz temat...</option>
                        <option value="general">Pytanie ogólne</option>
                        <option value="sacraments">Sakramenty</option>
                        <option value="documents">Dokumenty</option>
                        <option value="mass-intentions">Intencje mszalne</option>
                        <option value="cemetery">Sprawy cmentarne</option>
                        <option value="other">Inne</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Wiadomość *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Treść wiadomości..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Send size={18} />
                      Wyślij wiadomość
                    </button>

                    <p className="text-gray-500 dark:text-gray-400 text-xs text-center">
                      * Pola wymagane. Twoje dane będą wykorzystane wyłącznie w celu odpowiedzi na wiadomość.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="max-w-6xl mx-auto mt-12">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d638.5!2d18.6927899!3d50.8852467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471094fb81cc1137%3A0x422881b2072afd88!2sKo%C5%9Bci%C3%B3%C5%82%20Przenaj%C5%9Bwi%C4%99tszej%20Tr%C3%B3jcy%20w%20Przystajni!5e0!3m2!1spl!2spl!4v1706300000000!5m2!1spl!2spl"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokalizacja Kościoła Przenajświętszej Trójcy w Przystajni"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage
