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

  // Intention weeks
  db.exec(`
    CREATE TABLE IF NOT EXISTS intention_weeks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Intentions (linked to weeks)
  db.exec(`
    CREATE TABLE IF NOT EXISTS intentions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      weekId INTEGER NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      intention TEXT NOT NULL,
      FOREIGN KEY (weekId) REFERENCES intention_weeks(id) ON DELETE CASCADE
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

  // Gallery
  db.exec(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      imageUrl TEXT,
      date TEXT,
      category TEXT DEFAULT 'other',
      sortOrder INTEGER DEFAULT 0
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

  console.log('Database initialized successfully');
}

// Initialize database on module load
initDatabase();

module.exports = db;
