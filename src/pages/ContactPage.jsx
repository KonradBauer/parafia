import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Facebook, Youtube } from 'lucide-react'
import PageHeader from '../components/PageHeader'

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // In real app, this would send to backend/email service
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 5000)
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <PageHeader
        title="Kontakt"
        subtitle="Skontaktuj się z nami - chętnie odpowiemy na wszystkie pytania"
      />

      <section className="py-12 md:py-16 bg-cream-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-serif font-semibold text-primary-500 mb-6">
                Informacje kontaktowe
              </h2>

              <div className="space-y-4 mb-8">
                <a
                  href="https://maps.google.com/?q=ul.+Rynek+21,+42-141+Przystajń"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-500 mb-1">Adres</h3>
                    <p className="text-gray-600">ul. Rynek 21</p>
                    <p className="text-gray-600">42-141 Przystajń</p>
                  </div>
                </a>

                <a
                  href="tel:+48343191029"
                  className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-500 mb-1">Telefon</h3>
                    <p className="text-gray-600">34 319 10 29</p>
                    <p className="text-gray-500 text-sm">Kancelaria parafialna</p>
                  </div>
                </a>

                <a
                  href="mailto:przystajn@archidiecezja.pl"
                  className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-burgundy-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-500 mb-1">Email</h3>
                    <p className="text-gray-600">przystajn@archidiecezja.pl</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-primary-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-500 mb-1">Godziny kancelarii</h3>
                    <p className="text-gray-600">Poniedziałek - Piątek</p>
                    <p className="text-gray-600">8:00 - 9:00 oraz 16:00 - 17:00</p>
                  </div>
                </div>
              </div>

              {/* Social media */}
              <div className="mb-8">
                <h3 className="font-semibold text-primary-500 mb-3">Śledź nas</h3>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/parafiatrojcyprzystajn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#1877F2] rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href="https://www.youtube.com/@ParafiaTrojcyPrzenajswietszej"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#FF0000] rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    <Youtube size={24} />
                  </a>
                </div>
              </div>

              {/* Bank account */}
              <div className="bg-primary-500 text-white rounded-xl p-6">
                <h3 className="font-semibold mb-3">Numer konta parafialnego</h3>
                <p className="text-primary-200 text-sm mb-2">BNP PARIBAS</p>
                <p className="font-mono text-gold-400 break-all">
                  15 1600 1462 1837 1383 2000 0001
                </p>
                <p className="text-primary-200 text-sm mt-3">
                  Parafia Rzymskokatolicka pw. Trójcy Przenajświętszej w Przystajni
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-serif font-semibold text-primary-500 mb-6">
                  Napisz do nas
                </h2>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-primary-500 mb-2">
                      Wiadomość wysłana!
                    </h3>
                    <p className="text-gray-600">
                      Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imię i nazwisko *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        placeholder="Jan Kowalski"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                          placeholder="jan@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                          placeholder="123 456 789"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Temat *
                      </label>
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Wiadomość *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
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

                    <p className="text-gray-500 text-xs text-center">
                      * Pola wymagane. Twoje dane będą wykorzystane wyłącznie w celu odpowiedzi na wiadomość.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="max-w-6xl mx-auto mt-12">
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl h-[400px] flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-primary-400 mx-auto mb-4" />
                <p className="text-primary-500 font-medium">Mapa Google</p>
                <p className="text-primary-400 text-sm">ul. Rynek 21, 42-141 Przystajń</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage
