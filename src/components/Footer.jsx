import { Link } from 'react-router-dom'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Youtube,
  Heart,
  ExternalLink
} from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="footer" className="bg-primary-500 dark:bg-gray-950 text-white" role="contentinfo">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center" aria-hidden="true">
                <span className="text-primary-900 text-lg font-serif font-bold">✝</span>
              </div>
              <div>
                <p className="font-serif font-semibold text-lg">Parafia Trójcy</p>
                <p className="text-primary-200 dark:text-gray-400 text-sm">Przenajświętszej</p>
              </div>
            </div>
            <p className="text-primary-200 dark:text-gray-400 text-sm leading-relaxed mb-4">
              Serdecznie zapraszamy na Msze Święte i do uczestnictwa w życiu naszej wspólnoty parafialnej.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/parafiatrojcyprzystajn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-400 dark:bg-gray-800 hover:bg-gold-500 dark:hover:bg-gold-500 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-primary-500"
                aria-label="Facebook parafii (otwiera się w nowej karcie)"
              >
                <Facebook size={20} aria-hidden="true" />
              </a>
              <a
                href="https://www.youtube.com/@ParafiaTrojcyPrzenajswietszej"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-400 dark:bg-gray-800 hover:bg-gold-500 dark:hover:bg-gold-500 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-primary-500"
                aria-label="Kanał YouTube parafii (otwiera się w nowej karcie)"
              >
                <Youtube size={20} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Linki w stopce">
            <h2 className="font-serif font-semibold text-lg mb-4">Nawigacja</h2>
            <ul className="space-y-2" role="list">
              {[
                { name: 'Ogłoszenia', href: '/ogloszenia' },
                { name: 'Intencje mszalne', href: '/intencje' },
                { name: 'Kancelaria', href: '/kancelaria' },
                { name: 'Galeria', href: '/galeria' },
                { name: 'Historia parafii', href: '/historia' },
                { name: 'Cmentarz', href: 'https://przystajn.grobonet.com/grobonet/start.php', external: true },
              ].map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-200 dark:text-gray-400 hover:text-gold-400 transition-colors inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-gold-400 rounded"
                      aria-label={`${link.name} (otwiera się w nowej karcie)`}
                    >
                      {link.name}
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-primary-200 dark:text-gray-400 hover:text-gold-400 transition-colors inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-gold-400 rounded"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="font-serif font-semibold text-lg mb-4">Kontakt</h2>
            <address className="not-italic">
              <ul className="space-y-3" role="list">
                <li>
                  <a
                    href="https://maps.google.com/?q=ul.+Rynek+21,+42-141+Przystajń"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-primary-200 dark:text-gray-400 hover:text-gold-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 rounded"
                    aria-label="Adres parafii: ul. Rynek 21, 42-141 Przystajń (otwiera mapę Google)"
                  >
                    <MapPin size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>ul. Rynek 21<br />42-141 Przystajń</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+48343191029"
                    className="flex items-center gap-3 text-primary-200 dark:text-gray-400 hover:text-gold-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 rounded"
                    aria-label="Zadzwoń do parafii: 34 319 10 29"
                  >
                    <Phone size={18} className="flex-shrink-0" aria-hidden="true" />
                    <span>34 319 10 29</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:przystajn@archidiecezja.pl"
                    className="flex items-center gap-3 text-primary-200 dark:text-gray-400 hover:text-gold-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 rounded"
                    aria-label="Wyślij email do parafii"
                  >
                    <Mail size={18} className="flex-shrink-0" aria-hidden="true" />
                    <span>przystajn@archidiecezja.pl</span>
                  </a>
                </li>
              </ul>
            </address>
          </div>

          {/* Office hours & Bank */}
          <div>
            <h2 className="font-serif font-semibold text-lg mb-4">Kancelaria</h2>
            <div className="flex items-start gap-3 text-primary-200 dark:text-gray-400 mb-4">
              <Clock size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="text-sm">
                <p className="font-medium text-white">Godziny otwarcia:</p>
                <p>Poniedziałek - Piątek</p>
                <p>8:00 - 9:00 oraz 16:00 - 17:00</p>
              </div>
            </div>
            <div className="bg-primary-400/30 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm font-medium text-white mb-1">Numer konta:</p>
              <p className="text-xs text-primary-200 dark:text-gray-400 mb-2">BNP PARIBAS</p>
              <p
                className="text-sm font-mono text-gold-400 break-all select-all"
                aria-label="Numer konta bankowego: 15 1600 1462 1837 1383 2000 0001"
              >
                15 1600 1462 1837 1383 2000 0001
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-400 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-primary-200 dark:text-gray-400">
            <p>© {currentYear} Parafia Trójcy Przenajświętszej w Przystajni</p>
            <p className="flex items-center gap-1">
              Stworzone z <Heart size={14} className="text-burgundy-400" aria-hidden="true" />
              <span className="sr-only">sercem</span> dla wspólnoty parafialnej
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
