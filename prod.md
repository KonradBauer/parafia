# Produkcja — stan wdrożenia

## VPS
- **IP:** 157.173.96.140
- **System:** Linux
- **Serwer WWW:** Apache (reverse proxy)
- **Process manager:** PM2
- **Katalog projektu:** `/var/www/parafia/`

## Co zostało zrobione

### Etap 1 — Przygotowanie VPS
- Sklonowano repo do `/var/www/parafia/`
- Utworzono `.env` (root) z `VITE_API_URL=http://157.173.96.140/api`
- Utworzono `backend/.env` z konfiguracją produkcyjną (PORT, NODE_ENV, JWT_SECRET, CORS_ORIGINS)
- Zainstalowano zależności npm (root, backend, admin)
- Utworzono katalog `backend/logs/`

### Etap 2 — Build
- Zbudowano frontend (`npm run build:frontend`) — wynik w `dist/`
- Zbudowano panel admina (`npm run build:backend`) — wynik w `backend/admin-dist/`
- Skopiowano frontend do `backend/public/`

### Etap 3 — Backend (PM2)
- Uruchomiono backend: `pm2 start server.js --name parafia-cms --env NODE_ENV=production`
- Zapisano konfigurację: `pm2 save`
- Ustawiono autostart: `pm2 startup` (systemd)
- **Uwaga:** `ecosystem.config.js` nie działał (tryb cluster powodował error) — uruchomiono ręcznie w trybie fork

### Etap 4 — Apache
- Włączono moduły: `proxy`, `proxy_http`, `rewrite`, `headers`
- Utworzono VirtualHost: `/etc/apache2/sites-available/000-parafia.conf`
  - `ServerName 157.173.96.140`
  - Proxy na `http://127.0.0.1:3001/`
  - Nagłówki bezpieczeństwa (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- Wyłączono nadmiarowy `kbauer.pl.conf` (duplikat na porcie 80)
- Reorganizacja VHostów: `000-parafia.conf` (default), `001-kbauer.conf`, `kbauer.pl-le-ssl.conf`

### Etap 5 — Weryfikacja
- Frontend: `http://157.173.96.140/` — działa
- API: `http://157.173.96.140/api/announcements` — działa
- Panel admina: `http://157.173.96.140/admin` — działa
- kbauer.pl — bez zmian, działa

## Znane problemy
- Rate limiter (500 req/15min w produkcji) — może się wyczerpać przy intensywnej pracy w panelu. Restart: `pm2 restart parafia-cms`
- `ecosystem.config.js` — tryb cluster nie działał, backend uruchomiony bezpośrednio przez `pm2 start server.js`

## Do zrobienia (po odpowiedzi klienta)

### Domena: parafia-trojcy-przenajswietszej-przystajn.pl

#### 1. DNS — u dostawcy domeny
Ustawić rekordy A:

| Typ | Nazwa | Wartość |
|-----|-------|---------|
| A | @ | IP_VPS |
| A | www | IP_VPS |

Jeśli ten sam VPS → `157.173.96.140`. Jeśli nowy VPS — nowe IP.

#### 2. Apache VirtualHost
```bash
nano /etc/apache2/sites-available/parafia-domena.conf
```

```apache
<VirtualHost *:80>
    ServerName parafia-trojcy-przenajswietszej-przystajn.pl
    ServerAlias www.parafia-trojcy-przenajswietszej-przystajn.pl

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3001/
    ProxyPassReverse / http://127.0.0.1:3001/

    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"

    ErrorLog ${APACHE_LOG_DIR}/parafia-domena-error.log
    CustomLog ${APACHE_LOG_DIR}/parafia-domena-access.log combined
</VirtualHost>
```

```bash
a2ensite parafia-domena.conf && systemctl reload apache2
```

#### 3. HTTPS (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d parafia-trojcy-przenajswietszej-przystajn.pl -d www.parafia-trojcy-przenajswietszej-przystajn.pl
```

Certbot automatycznie skonfiguruje SSL i przekierowanie HTTP → HTTPS.

#### 4. Aktualizacja konfiguracji aplikacji
```bash
# Frontend .env
nano /var/www/parafia/.env
```
```
VITE_API_URL=https://parafia-trojcy-przenajswietszej-przystajn.pl/api
```

```bash
# Backend .env — zmienić CORS_ORIGINS
nano /var/www/parafia/backend/.env
```
```
CORS_ORIGINS=https://parafia-trojcy-przenajswietszej-przystajn.pl,https://www.parafia-trojcy-przenajswietszej-przystajn.pl
```

#### 5. Przebudowa i restart
```bash
cd /var/www/parafia && npm run build:frontend
cp -r dist/* backend/public/
pm2 restart parafia-cms
```

---

### Wdrożenie na nowy (czysty) VPS

Jeśli klient ma osobny VPS, przed krokami powyżej zainstalować:

```bash
# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# PM2
sudo npm install -g pm2

# Apache
sudo apt install -y apache2
sudo a2enmod proxy proxy_http rewrite headers
```

Potem wykonać Etapy 1–5 z sekcji "Co zostało zrobione" (z nowym IP/domeną w konfiguracji).

---

### Bezpieczeństwo
- [ ] Zmiana hasła admina na silniejsze
- [ ] Rozważenie ograniczenia dostępu do `/admin` (np. po IP)

### Utrzymanie
- [ ] Konfiguracja backupów bazy SQLite (cron)
- [ ] Monitoring logów (`/var/www/parafia/backend/logs/`)
- [ ] Naprawa `ecosystem.config.js` (opcjonalnie — obecna konfiguracja PM2 działa)
