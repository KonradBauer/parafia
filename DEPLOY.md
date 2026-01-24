# Instrukcja Deployu na VPS

## Wymagania

- Node.js >= 18.x
- npm >= 9.x
- PM2 (opcjonalnie, do zarządzania procesem)
- Nginx (reverse proxy)

## 1. Przygotowanie serwera

```bash
# Aktualizacja systemu
sudo apt update && sudo apt upgrade -y

# Instalacja Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalacja PM2 globalnie
sudo npm install -g pm2

# Instalacja Nginx
sudo apt install -y nginx
```

## 2. Klonowanie projektu

```bash
cd /var/www
git clone <repo-url> parafia
cd parafia/backend
```

## 3. Konfiguracja środowiska

```bash
# Skopiuj przykładowy plik .env
cp .env.example .env

# Edytuj plik .env
nano .env
```

**WAŻNE - zmień te wartości:**
- `JWT_SECRET` - wygeneruj nowy klucz: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- `ADMIN_USERNAME` - zmień nazwę użytkownika
- `ADMIN_PASSWORD` - ustaw silne hasło
- `CORS_ORIGINS` - dodaj domenę produkcyjną

## 4. Instalacja i build

```bash
# Instalacja zależności backendu
npm install

# Build panelu admina
npm run build

# Utwórz folder na logi
mkdir -p logs
```

## 5. Uruchomienie z PM2

```bash
# Start aplikacji
pm2 start ecosystem.config.js --env production

# Zapisz konfigurację PM2
pm2 save

# Automatyczny restart po restarcie serwera
pm2 startup
```

### Przydatne komendy PM2

```bash
pm2 status              # Status aplikacji
pm2 logs parafia-cms    # Podgląd logów
pm2 restart parafia-cms # Restart
pm2 stop parafia-cms    # Zatrzymanie
pm2 delete parafia-cms  # Usunięcie
```

## 6. Konfiguracja Nginx

Utwórz plik konfiguracji:

```bash
sudo nano /etc/nginx/sites-available/parafia
```

Zawartość:

```nginx
server {
    listen 80;
    server_name twoja-domena.pl www.twoja-domena.pl;

    # Przekierowanie HTTP na HTTPS (po skonfigurowaniu SSL)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache dla plików statycznych
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        proxy_pass http://localhost:3001;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Uploads
    location /uploads {
        alias /var/www/parafia/backend/uploads;
        expires 30d;
    }

    client_max_body_size 10M;
}
```

Aktywacja:

```bash
sudo ln -s /etc/nginx/sites-available/parafia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 7. SSL z Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d twoja-domena.pl -d www.twoja-domena.pl
```

## 8. Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## 9. Backup bazy danych

Utwórz skrypt backupu:

```bash
nano /var/www/parafia/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/www/parafia/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
cp /var/www/parafia/backend/data.db "$BACKUP_DIR/data_$DATE.db"
# Usuń backupy starsze niż 30 dni
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
```

```bash
chmod +x /var/www/parafia/backup.sh
```

Dodaj do cron (codziennie o 3:00):

```bash
crontab -e
# Dodaj linię:
0 3 * * * /var/www/parafia/backup.sh
```

## 10. Aktualizacja aplikacji

```bash
cd /var/www/parafia
git pull origin main
cd backend
npm install
npm run build
pm2 restart parafia-cms
```

---

## Struktura produkcyjna

```
/var/www/parafia/
├── backend/
│   ├── server.js
│   ├── routes.js
│   ├── auth.js
│   ├── db.js
│   ├── middleware/
│   ├── utils/
│   ├── admin-dist/      ← Zbudowany panel admina
│   ├── public/          ← Zbudowany frontend
│   ├── uploads/         ← Uploadowane pliki
│   ├── logs/            ← Logi PM2
│   ├── data.db          ← Baza SQLite
│   └── .env             ← Konfiguracja (NIE commitować!)
├── backups/             ← Backupy bazy
└── DEPLOY.md
```

## Rozwiązywanie problemów

### Aplikacja nie startuje
```bash
pm2 logs parafia-cms --lines 50
```

### Błąd 502 Bad Gateway
```bash
# Sprawdź czy aplikacja działa
pm2 status
# Sprawdź logi Nginx
sudo tail -f /var/log/nginx/error.log
```

### Problemy z uprawnieniami
```bash
sudo chown -R www-data:www-data /var/www/parafia
sudo chmod -R 755 /var/www/parafia
```

### Reset hasła admina
Edytuj `.env` i ustaw nowe `ADMIN_PASSWORD`, następnie restart:
```bash
pm2 restart parafia-cms
```
