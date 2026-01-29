const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const { login, verifyToken } = require('./auth');
const { sanitizeMiddleware } = require('./middleware/sanitize');
const { validate, schemas, rules } = require('./utils/validators');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Niedozwolony typ pliku. Dozwolone: JPG, PNG, GIF, WebP'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Apply sanitization to all routes
router.use(sanitizeMiddleware);

// ============ UPLOAD ============
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nie przesłano pliku' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// Delete uploaded file
router.delete('/upload/:filename', verifyToken, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  // Security: prevent path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: 'Nieprawidłowa nazwa pliku' });
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Plik nie istnieje' });
  }
});

// ============ AUTH ============
router.post('/auth/login', schemas.login, validate, (req, res) => {
  const { username, password } = req.body;
  const result = login(username, password);
  if (result.success) {
    res.json({ token: result.token });
  } else {
    res.status(401).json({ error: result.message });
  }
});

router.get('/auth/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ============ ANNOUNCEMENTS ============
router.get('/announcements', (req, res) => {
  const rows = db.prepare('SELECT * FROM announcements ORDER BY date DESC, id DESC').all();
  res.json(rows);
});

router.get('/announcements/:id', [rules.id], validate, (req, res) => {
  const row = db.prepare('SELECT * FROM announcements WHERE id = ?').get(req.params.id);
  if (row) res.json(row);
  else res.status(404).json({ error: 'Nie znaleziono' });
});

router.post('/announcements', verifyToken, schemas.announcement, validate, (req, res) => {
  const { title, date, content } = req.body;
  const result = db.prepare(
    'INSERT INTO announcements (title, date, content) VALUES (?, ?, ?)'
  ).run(title, date, content || null);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/announcements/:id', verifyToken, [rules.id, ...schemas.announcement], validate, (req, res) => {
  const { title, date, content } = req.body;
  db.prepare(
    "UPDATE announcements SET title = ?, date = ?, content = ?, updatedAt = datetime('now') WHERE id = ?"
  ).run(title, date, content || null, req.params.id);
  res.json({ id: parseInt(req.params.id), ...req.body });
});

router.delete('/announcements/:id', verifyToken, [rules.id], validate, (req, res) => {
  db.prepare('DELETE FROM announcements WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ INTENTIONS (RICH TEXT ENTRIES) ============
router.get('/intentions', (req, res) => {
  const rows = db.prepare('SELECT * FROM intention_entries ORDER BY createdAt DESC').all();
  res.json(rows);
});

router.get('/intentions/latest', (req, res) => {
  const row = db.prepare('SELECT * FROM intention_entries ORDER BY createdAt DESC LIMIT 1').get();
  res.json(row || null);
});

router.get('/intentions/:id', [rules.id], validate, (req, res) => {
  const row = db.prepare('SELECT * FROM intention_entries WHERE id = ?').get(req.params.id);
  if (row) res.json(row);
  else res.status(404).json({ error: 'Nie znaleziono' });
});

router.post('/intentions', verifyToken, schemas.intentionEntry, validate, (req, res) => {
  const { content } = req.body;
  const result = db.prepare(
    'INSERT INTO intention_entries (content) VALUES (?)'
  ).run(content);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/intentions/:id', verifyToken, [rules.id, ...schemas.intentionEntry], validate, (req, res) => {
  const { content } = req.body;
  db.prepare(
    "UPDATE intention_entries SET content = ?, updatedAt = datetime('now') WHERE id = ?"
  ).run(content, req.params.id);
  res.json({ id: parseInt(req.params.id), ...req.body });
});

router.delete('/intentions/:id', verifyToken, [rules.id], validate, (req, res) => {
  db.prepare('DELETE FROM intention_entries WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ MASS TIMES ============
router.get('/mass-times', (req, res) => {
  const rows = db.prepare('SELECT * FROM mass_times ORDER BY dayType, time').all();
  res.json(rows);
});

router.post('/mass-times', verifyToken, schemas.massTime, validate, (req, res) => {
  const { time, dayType, description } = req.body;
  const result = db.prepare(
    'INSERT INTO mass_times (time, dayType, description) VALUES (?, ?, ?)'
  ).run(time, dayType, description || null);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/mass-times/:id', verifyToken, [rules.id, ...schemas.massTime], validate, (req, res) => {
  const { time, dayType, description } = req.body;
  db.prepare(
    'UPDATE mass_times SET time = ?, dayType = ?, description = ? WHERE id = ?'
  ).run(time, dayType, description || null, req.params.id);
  res.json({ id: parseInt(req.params.id), ...req.body });
});

router.delete('/mass-times/:id', verifyToken, [rules.id], validate, (req, res) => {
  db.prepare('DELETE FROM mass_times WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ PRIESTS ============
router.get('/priests', (req, res) => {
  const rows = db.prepare('SELECT * FROM priests ORDER BY id').all();
  res.json(rows);
});

router.post('/priests', verifyToken, schemas.priest, validate, (req, res) => {
  const { name, role, phone, photo } = req.body;
  const result = db.prepare(
    'INSERT INTO priests (name, role, phone, photo) VALUES (?, ?, ?, ?)'
  ).run(name, role, phone || null, photo || null);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/priests/:id', verifyToken, [rules.id, ...schemas.priest], validate, (req, res) => {
  const { name, role, phone, photo } = req.body;
  db.prepare(
    'UPDATE priests SET name = ?, role = ?, phone = ?, photo = ? WHERE id = ?'
  ).run(name, role, phone || null, photo || null, req.params.id);
  res.json({ id: parseInt(req.params.id), ...req.body });
});

router.delete('/priests/:id', verifyToken, [rules.id], validate, (req, res) => {
  db.prepare('DELETE FROM priests WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ PRIESTS FROM PARISH ============
router.get('/priests-from-parish', (req, res) => {
  const rows = db.prepare('SELECT * FROM priests_from_parish ORDER BY ordinationYear').all();
  res.json(rows);
});

router.post('/priests-from-parish', verifyToken, schemas.priestFromParish, validate, (req, res) => {
  const { name, ordinationYear, orderName, notes } = req.body;
  const result = db.prepare(
    'INSERT INTO priests_from_parish (name, ordinationYear, orderName, notes) VALUES (?, ?, ?, ?)'
  ).run(name, ordinationYear, orderName || null, notes || null);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/priests-from-parish/:id', verifyToken, [rules.id, ...schemas.priestFromParish], validate, (req, res) => {
  const { name, ordinationYear, orderName, notes } = req.body;
  db.prepare(
    'UPDATE priests_from_parish SET name = ?, ordinationYear = ?, orderName = ?, notes = ? WHERE id = ?'
  ).run(name, ordinationYear, orderName || null, notes || null, req.params.id);
  res.json({ id: parseInt(req.params.id), ...req.body });
});

router.delete('/priests-from-parish/:id', verifyToken, [rules.id], validate, (req, res) => {
  db.prepare('DELETE FROM priests_from_parish WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ GALLERY CATEGORIES ============
router.get('/gallery-categories', (req, res) => {
  // Get categories with first photo as cover image
  const rows = db.prepare(`
    SELECT gc.*,
      (SELECT g.imageUrl FROM gallery g WHERE g.categoryId = gc.id ORDER BY g.date DESC, g.id DESC LIMIT 1) as coverImage
    FROM gallery_categories gc
    ORDER BY gc.createdAt DESC, gc.name
  `).all();
  res.json(rows);
});

router.post('/gallery-categories', verifyToken, schemas.galleryCategory, validate, (req, res) => {
  const { name } = req.body;

  // Check if category with same name exists
  const existing = db.prepare('SELECT id FROM gallery_categories WHERE name = ?').get(name);
  if (existing) {
    return res.status(400).json({ error: 'Kategoria o tej nazwie już istnieje' });
  }

  const result = db.prepare(
    'INSERT INTO gallery_categories (name) VALUES (?)'
  ).run(name);
  res.json({ id: result.lastInsertRowid, name });
});

router.put('/gallery-categories/:id', verifyToken, [rules.id, ...schemas.galleryCategory], validate, (req, res) => {
  const { name } = req.body;

  // Check if category with same name exists (other than current)
  const existing = db.prepare('SELECT id FROM gallery_categories WHERE name = ? AND id != ?').get(name, req.params.id);
  if (existing) {
    return res.status(400).json({ error: 'Kategoria o tej nazwie już istnieje' });
  }

  db.prepare(
    'UPDATE gallery_categories SET name = ? WHERE id = ?'
  ).run(name, req.params.id);
  res.json({ id: parseInt(req.params.id), name });
});

router.delete('/gallery-categories/:id', verifyToken, [rules.id], validate, (req, res) => {
  // Check if category has photos
  const photosCount = db.prepare('SELECT COUNT(*) as count FROM gallery WHERE categoryId = ?').get(req.params.id);
  if (photosCount.count > 0) {
    return res.status(400).json({
      error: `Nie można usunąć kategorii - zawiera ${photosCount.count} zdjęć. Najpierw przenieś lub usuń zdjęcia.`
    });
  }

  db.prepare('DELETE FROM gallery_categories WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ GALLERY ============
router.get('/gallery', (req, res) => {
  const categoryId = req.query.categoryId;
  let rows;
  if (categoryId && categoryId !== 'all') {
    rows = db.prepare(`
      SELECT g.*, gc.name as categoryName
      FROM gallery g
      LEFT JOIN gallery_categories gc ON g.categoryId = gc.id
      WHERE g.categoryId = ?
      ORDER BY g.date DESC, g.id DESC
    `).all(categoryId);
  } else {
    rows = db.prepare(`
      SELECT g.*, gc.name as categoryName
      FROM gallery g
      LEFT JOIN gallery_categories gc ON g.categoryId = gc.id
      ORDER BY g.date DESC, g.id DESC
    `).all();
  }
  res.json(rows);
});

router.post('/gallery', verifyToken, schemas.galleryItem, validate, (req, res) => {
  const { title, description, imageUrl, date, categoryId } = req.body;
  const result = db.prepare(
    'INSERT INTO gallery (title, description, imageUrl, date, categoryId) VALUES (?, ?, ?, ?, ?)'
  ).run(title, description || null, imageUrl || null, date || null, categoryId || null);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/gallery/:id', verifyToken, [rules.id, ...schemas.galleryItem], validate, (req, res) => {
  const { title, description, imageUrl, date, categoryId } = req.body;
  db.prepare(
    'UPDATE gallery SET title = ?, description = ?, imageUrl = ?, date = ?, categoryId = ? WHERE id = ?'
  ).run(title, description || null, imageUrl || null, date || null, categoryId || null, req.params.id);
  res.json({ id: parseInt(req.params.id), ...req.body });
});

router.delete('/gallery/:id', verifyToken, [rules.id], validate, (req, res) => {
  db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ HISTORY ============
router.get('/history', (req, res) => {
  const rows = db.prepare('SELECT * FROM history ORDER BY year DESC, id DESC').all();
  res.json(rows);
});

router.post('/history', verifyToken, schemas.historyItem, validate, (req, res) => {
  const { year, title, content, imageUrl } = req.body;
  const result = db.prepare(
    'INSERT INTO history (year, title, content, imageUrl) VALUES (?, ?, ?, ?)'
  ).run(year, title, content, imageUrl || null);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/history/:id', verifyToken, [rules.id, ...schemas.historyItem], validate, (req, res) => {
  const { year, title, content, imageUrl } = req.body;
  db.prepare(
    'UPDATE history SET year = ?, title = ?, content = ?, imageUrl = ? WHERE id = ?'
  ).run(year, title, content, imageUrl || null, req.params.id);
  res.json({ id: parseInt(req.params.id), ...req.body });
});

router.delete('/history/:id', verifyToken, [rules.id], validate, (req, res) => {
  db.prepare('DELETE FROM history WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ EVENTS ============
router.get('/events', (req, res) => {
  const rows = db.prepare('SELECT * FROM events ORDER BY date').all();
  // Filter to show only future events
  const today = new Date().toISOString().split('T')[0];
  const futureEvents = rows.filter(e => e.date >= today);
  res.json(futureEvents);
});

router.get('/events/all', verifyToken, (req, res) => {
  const rows = db.prepare('SELECT * FROM events ORDER BY date DESC').all();
  res.json(rows);
});

router.post('/events', verifyToken, schemas.event, validate, (req, res) => {
  const { title, date, time, description } = req.body;
  const result = db.prepare(
    'INSERT INTO events (title, date, time, description) VALUES (?, ?, ?, ?)'
  ).run(title, date, time || null, description || null);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/events/:id', verifyToken, [rules.id, ...schemas.event], validate, (req, res) => {
  const { title, date, time, description } = req.body;
  db.prepare(
    'UPDATE events SET title = ?, date = ?, time = ?, description = ? WHERE id = ?'
  ).run(title, date, time || null, description || null, req.params.id);
  res.json({ id: parseInt(req.params.id), ...req.body });
});

router.delete('/events/:id', verifyToken, [rules.id], validate, (req, res) => {
  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ PARISH INFO ============
router.get('/parish-info', (req, res) => {
  const row = db.prepare('SELECT * FROM parish_info WHERE id = 1').get();
  res.json(row || {});
});

router.put('/parish-info', verifyToken, schemas.parishInfo, validate, (req, res) => {
  const { address, phone, email, officeHoursWeekday, officeHoursWeekend, bankAccount } = req.body;
  db.prepare(`
    UPDATE parish_info SET
      address = ?, phone = ?, email = ?,
      officeHoursWeekday = ?, officeHoursWeekend = ?, bankAccount = ?,
      updatedAt = datetime('now')
    WHERE id = 1
  `).run(address, phone, email, officeHoursWeekday, officeHoursWeekend, bankAccount);
  res.json({ id: 1, ...req.body });
});

// ============ ABOUT SECTION ============
router.get('/about-section', (req, res) => {
  const row = db.prepare('SELECT * FROM about_section WHERE id = 1').get();
  res.json(row || {});
});

router.put('/about-section', verifyToken, schemas.aboutSection, validate, (req, res) => {
  const { title, subtitle, content, imageUrl, stat1Label, stat1Value, stat2Label, stat2Value, stat3Label, stat3Value } = req.body;
  db.prepare(`
    UPDATE about_section SET
      title = ?, subtitle = ?, content = ?, imageUrl = ?,
      stat1Label = ?, stat1Value = ?, stat2Label = ?, stat2Value = ?, stat3Label = ?, stat3Value = ?,
      updatedAt = datetime('now')
    WHERE id = 1
  `).run(
    title || 'Nasza Parafia',
    subtitle || 'O nas',
    content || null,
    imageUrl || null,
    stat1Label || 'lat historii',
    stat1Value || '500+',
    stat2Label || 'parafian',
    stat2Value || '1000+',
    stat3Label || 'Msze dziennie',
    stat3Value || '4'
  );
  res.json({ id: 1, ...req.body });
});

// ============ HISTORY ABOUT SECTION ============
router.get('/history-about', (req, res) => {
  const row = db.prepare('SELECT * FROM history_about WHERE id = 1').get();
  res.json(row || {});
});

router.put('/history-about', verifyToken, schemas.historyAbout, validate, (req, res) => {
  const { title, subtitle, content, imageUrl } = req.body;
  db.prepare(`
    UPDATE history_about SET
      title = ?, subtitle = ?, content = ?, imageUrl = ?,
      updatedAt = datetime('now')
    WHERE id = 1
  `).run(
    title || 'Parafia Trójcy Przenajświętszej',
    subtitle || 'O parafii',
    content || null,
    imageUrl || null
  );
  res.json({ id: 1, ...req.body });
});

// ============ CONTACT MESSAGES ============
router.get('/contact-messages', verifyToken, (req, res) => {
  const rows = db.prepare('SELECT * FROM contact_messages ORDER BY createdAt DESC').all();
  res.json(rows);
});

router.post('/contact-messages', schemas.contactMessage, validate, (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const result = db.prepare(
    'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)'
  ).run(name, email, phone || null, subject, message);
  res.json({ id: result.lastInsertRowid, success: true });
});

router.put('/contact-messages/:id/read', verifyToken, [rules.id], validate, (req, res) => {
  db.prepare('UPDATE contact_messages SET isRead = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.delete('/contact-messages/:id', verifyToken, [rules.id], validate, (req, res) => {
  db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
