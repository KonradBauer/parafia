const express = require('express');
const db = require('./db');
const { login, verifyToken } = require('./auth');
const { sanitizeMiddleware } = require('./middleware/sanitize');
const { validate, schemas, rules } = require('./utils/validators');

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeMiddleware);

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
  const { title, date, week, content, isNew } = req.body;
  const result = db.prepare(
    'INSERT INTO announcements (title, date, week, content, isNew) VALUES (?, ?, ?, ?, ?)'
  ).run(title, date, week || null, content || null, isNew ? 1 : 0);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/announcements/:id', verifyToken, [rules.id, ...schemas.announcement], validate, (req, res) => {
  const { title, date, week, content, isNew } = req.body;
  db.prepare(
    'UPDATE announcements SET title = ?, date = ?, week = ?, content = ?, isNew = ?, updatedAt = datetime("now") WHERE id = ?'
  ).run(title, date, week || null, content || null, isNew ? 1 : 0, req.params.id);
  res.json({ id: parseInt(req.params.id), ...req.body });
});

router.delete('/announcements/:id', verifyToken, [rules.id], validate, (req, res) => {
  db.prepare('DELETE FROM announcements WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ INTENTIONS ============
router.get('/intentions', (req, res) => {
  const weeks = db.prepare('SELECT * FROM intention_weeks ORDER BY startDate DESC').all();
  const intentions = db.prepare('SELECT * FROM intentions ORDER BY date, time').all();

  const result = weeks.map(week => ({
    ...week,
    intentions: intentions.filter(i => i.weekId === week.id)
  }));
  res.json(result);
});

router.get('/intentions/:id', [rules.id], validate, (req, res) => {
  const week = db.prepare('SELECT * FROM intention_weeks WHERE id = ?').get(req.params.id);
  if (!week) return res.status(404).json({ error: 'Nie znaleziono' });

  const intentions = db.prepare('SELECT * FROM intentions WHERE weekId = ? ORDER BY date, time').all(req.params.id);
  res.json({ ...week, intentions });
});

router.post('/intentions', verifyToken, schemas.intentionWeek, validate, (req, res) => {
  const { startDate, endDate, intentions } = req.body;

  const weekResult = db.prepare(
    'INSERT INTO intention_weeks (startDate, endDate) VALUES (?, ?)'
  ).run(startDate, endDate);
  const weekId = weekResult.lastInsertRowid;

  if (intentions && intentions.length > 0) {
    const insertIntention = db.prepare(
      'INSERT INTO intentions (weekId, date, time, intention) VALUES (?, ?, ?, ?)'
    );
    intentions.forEach(i => {
      insertIntention.run(weekId, i.date, i.time, i.intention);
    });
  }

  res.json({ id: weekId, startDate, endDate, intentions: intentions || [] });
});

router.put('/intentions/:id', verifyToken, [rules.id, ...schemas.intentionWeek], validate, (req, res) => {
  const { startDate, endDate, intentions } = req.body;

  db.prepare('UPDATE intention_weeks SET startDate = ?, endDate = ?, updatedAt = datetime("now") WHERE id = ?')
    .run(startDate, endDate, req.params.id);

  // Delete old intentions and insert new ones
  db.prepare('DELETE FROM intentions WHERE weekId = ?').run(req.params.id);

  if (intentions && intentions.length > 0) {
    const insertIntention = db.prepare(
      'INSERT INTO intentions (weekId, date, time, intention) VALUES (?, ?, ?, ?)'
    );
    intentions.forEach(i => {
      insertIntention.run(req.params.id, i.date, i.time, i.intention);
    });
  }

  res.json({ id: parseInt(req.params.id), startDate, endDate, intentions: intentions || [] });
});

router.delete('/intentions/:id', verifyToken, [rules.id], validate, (req, res) => {
  db.prepare('DELETE FROM intentions WHERE weekId = ?').run(req.params.id);
  db.prepare('DELETE FROM intention_weeks WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ MASS TIMES ============
router.get('/mass-times', (req, res) => {
  const rows = db.prepare('SELECT * FROM mass_times ORDER BY sortOrder, time').all();
  res.json(rows);
});

router.post('/mass-times', verifyToken, schemas.massTime, validate, (req, res) => {
  const { time, dayType, description, sortOrder } = req.body;
  const result = db.prepare(
    'INSERT INTO mass_times (time, dayType, description, sortOrder) VALUES (?, ?, ?, ?)'
  ).run(time, dayType, description || null, sortOrder || 0);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/mass-times/:id', verifyToken, [rules.id, ...schemas.massTime], validate, (req, res) => {
  const { time, dayType, description, sortOrder } = req.body;
  db.prepare(
    'UPDATE mass_times SET time = ?, dayType = ?, description = ?, sortOrder = ? WHERE id = ?'
  ).run(time, dayType, description || null, sortOrder || 0, req.params.id);
  res.json({ id: parseInt(req.params.id), ...req.body });
});

router.delete('/mass-times/:id', verifyToken, [rules.id], validate, (req, res) => {
  db.prepare('DELETE FROM mass_times WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ PRIESTS ============
router.get('/priests', (req, res) => {
  const rows = db.prepare('SELECT * FROM priests ORDER BY sortOrder, id').all();
  res.json(rows);
});

router.post('/priests', verifyToken, schemas.priest, validate, (req, res) => {
  const { name, role, phone, photo, sortOrder } = req.body;
  const result = db.prepare(
    'INSERT INTO priests (name, role, phone, photo, sortOrder) VALUES (?, ?, ?, ?, ?)'
  ).run(name, role, phone || null, photo || null, sortOrder || 0);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/priests/:id', verifyToken, [rules.id, ...schemas.priest], validate, (req, res) => {
  const { name, role, phone, photo, sortOrder } = req.body;
  db.prepare(
    'UPDATE priests SET name = ?, role = ?, phone = ?, photo = ?, sortOrder = ? WHERE id = ?'
  ).run(name, role, phone || null, photo || null, sortOrder || 0, req.params.id);
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

// ============ GALLERY ============
router.get('/gallery', (req, res) => {
  const category = req.query.category;
  let rows;
  if (category && category !== 'all') {
    rows = db.prepare('SELECT * FROM gallery WHERE category = ? ORDER BY sortOrder, date DESC').all(category);
  } else {
    rows = db.prepare('SELECT * FROM gallery ORDER BY sortOrder, date DESC').all();
  }
  res.json(rows);
});

router.post('/gallery', verifyToken, schemas.galleryItem, validate, (req, res) => {
  const { title, description, imageUrl, date, category, sortOrder } = req.body;
  const result = db.prepare(
    'INSERT INTO gallery (title, description, imageUrl, date, category, sortOrder) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(title, description || null, imageUrl || null, date || null, category || 'other', sortOrder || 0);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/gallery/:id', verifyToken, [rules.id, ...schemas.galleryItem], validate, (req, res) => {
  const { title, description, imageUrl, date, category, sortOrder } = req.body;
  db.prepare(
    'UPDATE gallery SET title = ?, description = ?, imageUrl = ?, date = ?, category = ?, sortOrder = ? WHERE id = ?'
  ).run(title, description || null, imageUrl || null, date || null, category || 'other', sortOrder || 0, req.params.id);
  res.json({ id: parseInt(req.params.id), ...req.body });
});

router.delete('/gallery/:id', verifyToken, [rules.id], validate, (req, res) => {
  db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ HISTORY ============
router.get('/history', (req, res) => {
  const rows = db.prepare('SELECT * FROM history ORDER BY year, sortOrder').all();
  res.json(rows);
});

router.post('/history', verifyToken, schemas.historyItem, validate, (req, res) => {
  const { year, title, content, imageUrl, sortOrder } = req.body;
  const result = db.prepare(
    'INSERT INTO history (year, title, content, imageUrl, sortOrder) VALUES (?, ?, ?, ?, ?)'
  ).run(year, title, content, imageUrl || null, sortOrder || 0);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/history/:id', verifyToken, [rules.id, ...schemas.historyItem], validate, (req, res) => {
  const { year, title, content, imageUrl, sortOrder } = req.body;
  db.prepare(
    'UPDATE history SET year = ?, title = ?, content = ?, imageUrl = ?, sortOrder = ? WHERE id = ?'
  ).run(year, title, content, imageUrl || null, sortOrder || 0, req.params.id);
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
