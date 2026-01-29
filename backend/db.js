const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('journal_mode = WAL');

// Create tables
function initDatabase() {
  // Announcements
  db.exec(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      week TEXT,
      content TEXT NOT NULL,
      isNew INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Migration: Convert old weekly intentions to monthly (must run BEFORE creating new tables)
  migrateWeeklyToMonthly();

  // Intention months (new monthly structure)
  db.exec(`
    CREATE TABLE IF NOT EXISTS intention_months (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      month INTEGER NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      UNIQUE(year, month)
    )
  `);

  // Intentions (linked to months)
  db.exec(`
    CREATE TABLE IF NOT EXISTS intentions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      monthId INTEGER NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      intention TEXT NOT NULL,
      FOREIGN KEY (monthId) REFERENCES intention_months(id) ON DELETE CASCADE
    )
  `);

  // Mass times
  db.exec(`
    CREATE TABLE IF NOT EXISTS mass_times (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      time TEXT NOT NULL,
      dayType TEXT NOT NULL CHECK(dayType IN ('sunday', 'weekday')),
      description TEXT,
      sortOrder INTEGER DEFAULT 0
    )
  `);

  // Priests (current)
  db.exec(`
    CREATE TABLE IF NOT EXISTS priests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      phone TEXT,
      photo TEXT,
      sortOrder INTEGER DEFAULT 0
    )
  `);

  // Priests from parish
  db.exec(`
    CREATE TABLE IF NOT EXISTS priests_from_parish (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ordinationYear INTEGER NOT NULL,
      orderName TEXT,
      notes TEXT
    )
  `);

  // Migration: Add categoryId to existing gallery table (must run BEFORE creating new tables)
  migrateGalleryCategories();

  // Gallery categories (dynamic)
  db.exec(`
    CREATE TABLE IF NOT EXISTS gallery_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      sortOrder INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Gallery (new installs get categoryId, existing installs get it via migration)
  db.exec(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      imageUrl TEXT,
      date TEXT,
      categoryId INTEGER,
      sortOrder INTEGER DEFAULT 0,
      FOREIGN KEY (categoryId) REFERENCES gallery_categories(id) ON DELETE SET NULL
    )
  `);

  // History
  db.exec(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      imageUrl TEXT,
      sortOrder INTEGER DEFAULT 0
    )
  `);

  // Events
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT,
      description TEXT
    )
  `);

  // Parish info (singleton)
  db.exec(`
    CREATE TABLE IF NOT EXISTS parish_info (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      address TEXT,
      phone TEXT,
      email TEXT,
      officeHoursWeekday TEXT,
      officeHoursWeekend TEXT,
      bankAccount TEXT,
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Insert default parish info if not exists
  const existingInfo = db.prepare('SELECT id FROM parish_info WHERE id = 1').get();
  if (!existingInfo) {
    db.prepare(`
      INSERT INTO parish_info (id, address, phone, email, officeHoursWeekday, officeHoursWeekend, bankAccount)
      VALUES (1, 'ul. Rynek 21, 42-141 Przystajn', '34 319 10 29', 'przystajn@archidiecezja.pl',
              'Poniedzialek - Piatek: 8:00 - 9:00 oraz 16:00 - 17:00',
              'W sprawach pilnych prosimy o kontakt telefoniczny',
              '15 1600 1462 1837 1383 2000 0001')
    `).run();
  }

  // Intention entries (simplified rich text intentions)
  db.exec(`
    CREATE TABLE IF NOT EXISTS intention_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Contact messages
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      isRead INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // About section (singleton for "O nas" / "Nasza parafia" on homepage)
  db.exec(`
    CREATE TABLE IF NOT EXISTS about_section (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      title TEXT DEFAULT 'Nasza Parafia',
      subtitle TEXT DEFAULT 'O nas',
      content TEXT,
      imageUrl TEXT,
      stat1Label TEXT DEFAULT 'lat historii',
      stat1Value TEXT DEFAULT '500+',
      stat2Label TEXT DEFAULT 'parafian',
      stat2Value TEXT DEFAULT '1000+',
      stat3Label TEXT DEFAULT 'Msze dziennie',
      stat3Value TEXT DEFAULT '4',
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Insert default about section if not exists
  const existingAbout = db.prepare('SELECT id FROM about_section WHERE id = 1').get();
  if (!existingAbout) {
    db.prepare(`
      INSERT INTO about_section (id, title, subtitle, content)
      VALUES (1, 'Nasza Parafia', 'O nas',
        'Parafia pw. Trójcy Przenajświętszej w Przystajni to wspólnota wiernych z bogatą historią sięgającą wielu wieków. Nasz kościół jest miejscem modlitwy, spotkania z Bogiem i budowania więzi międzyludzkich.

Zapraszamy wszystkich do uczestnictwa w życiu parafialnym - w Mszach Świętych, nabożeństwach, spotkaniach formacyjnych i wspólnotowych.')
    `).run();
  }

  // History about section (singleton for "O parafii" on history page)
  db.exec(`
    CREATE TABLE IF NOT EXISTS history_about (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      title TEXT DEFAULT 'Parafia Trójcy Przenajświętszej',
      subtitle TEXT DEFAULT 'O parafii',
      content TEXT,
      imageUrl TEXT,
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Insert default history about if not exists
  const existingHistoryAbout = db.prepare('SELECT id FROM history_about WHERE id = 1').get();
  if (!existingHistoryAbout) {
    db.prepare(`
      INSERT INTO history_about (id, title, subtitle, content)
      VALUES (1, 'Parafia Trójcy Przenajświętszej', 'O parafii',
        'Parafia pw. Trójcy Przenajświętszej w Przystajni istnieje od co najmniej 1406 roku i należała do dekanatu lelowskiego w diecezji krakowskiej. Przez wieki była duchowym centrum dla mieszkańców Przystajni i okolicznych wiosek.

Obecny kościół parafialny został wzniesiony w 1752 roku z fundacji D. Zabickiej, a wykończony w 1797 roku. Konsekrowany 29 czerwca 1923 roku przez biskupa Władysława Krynickiego, jest świadectwem wiary pokoleń naszych przodków.')
    `).run();
  }

  console.log('Database initialized successfully');
}

// Migration: Convert weekly intentions to monthly
function migrateWeeklyToMonthly() {
  try {
    // Check if old intention_weeks table exists
    const oldTableExists = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='intention_weeks'
    `).get();

    if (!oldTableExists) return;

    // Check if old intentions table has weekId column
    const intentionsInfo = db.prepare(`PRAGMA table_info(intentions)`).all();
    const hasWeekId = intentionsInfo.some(col => col.name === 'weekId');

    if (!hasWeekId) return; // Already migrated

    // Check if there's data to migrate
    const oldIntentions = db.prepare(`
      SELECT i.id, i.date, i.time, i.intention
      FROM intentions i
      INNER JOIN intention_weeks w ON i.weekId = w.id
    `).all();

    if (oldIntentions.length === 0) {
      // No data to migrate, just drop old tables
      db.exec(`DROP TABLE IF EXISTS intentions`);
      db.exec(`DROP TABLE IF EXISTS intention_weeks`);
      return;
    }

    console.log(`Migrating ${oldIntentions.length} intentions from weekly to monthly...`);

    // Create intention_months table first
    db.exec(`
      CREATE TABLE IF NOT EXISTS intention_months (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        month INTEGER NOT NULL,
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT DEFAULT (datetime('now')),
        UNIQUE(year, month)
      )
    `);

    // Create temporary table for new intentions structure
    db.exec(`
      CREATE TABLE IF NOT EXISTS intentions_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        monthId INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        intention TEXT NOT NULL,
        FOREIGN KEY (monthId) REFERENCES intention_months(id) ON DELETE CASCADE
      )
    `);

    // Migrate each intention
    const insertMonth = db.prepare(`
      INSERT OR IGNORE INTO intention_months (year, month) VALUES (?, ?)
    `);
    const getMonthId = db.prepare(`
      SELECT id FROM intention_months WHERE year = ? AND month = ?
    `);
    const insertIntention = db.prepare(`
      INSERT INTO intentions_new (date, time, intention, monthId) VALUES (?, ?, ?, ?)
    `);

    const migrateTransaction = db.transaction(() => {
      for (const intention of oldIntentions) {
        const date = new Date(intention.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 1-12

        insertMonth.run(year, month);
        const monthRecord = getMonthId.get(year, month);
        insertIntention.run(intention.date, intention.time, intention.intention, monthRecord.id);
      }
    });

    migrateTransaction();

    // Drop old tables and rename new one
    db.exec(`DROP TABLE intentions`);
    db.exec(`DROP TABLE intention_weeks`);
    db.exec(`ALTER TABLE intentions_new RENAME TO intentions`);

    console.log('Migration from weekly to monthly completed successfully');
  } catch (err) {
    // If migration fails (e.g., already migrated), log and continue
    if (!err.message.includes('no such column: weekId') && !err.message.includes('no such table')) {
      console.log('Intentions migration note:', err.message);
    }
  }
}

// Migration: Handle gallery category changes
function migrateGalleryCategories() {
  try {
    // Check if old 'category' column exists in gallery
    const tableInfo = db.prepare(`PRAGMA table_info(gallery)`).all();
    const hasOldCategory = tableInfo.some(col => col.name === 'category');
    const hasCategoryId = tableInfo.some(col => col.name === 'categoryId');

    if (hasOldCategory && !hasCategoryId) {
      console.log('Migrating gallery categories...');

      // Add categoryId column
      db.exec(`ALTER TABLE gallery ADD COLUMN categoryId INTEGER REFERENCES gallery_categories(id) ON DELETE SET NULL`);

      // Note: We don't create default categories - admin will create them manually
      // Old 'category' column is kept for reference but not used

      console.log('Gallery categories migration completed');
    }
  } catch (err) {
    console.log('Gallery migration note:', err.message);
  }
}

// Initialize database on module load
initDatabase();

module.exports = db;
