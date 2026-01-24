const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'parafia-przystajn-secret-key-2026';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'parafiaprzystajn2026';

// Login handler
function login(username, password) {
  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return { success: true, token };
  }
  return { success: false, message: 'Nieprawidlowa nazwa uzytkownika lub haslo' };
}

// Verify token middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Brak tokena autoryzacji' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Nieprawidlowy lub wygasly token' });
  }
}

// Optional auth - doesn't block if no token, but sets user if present
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Token invalid, but we don't block
    }
  }
  next();
}

module.exports = {
  login,
  verifyToken,
  optionalAuth
};
