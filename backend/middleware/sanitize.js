const sanitizeHtml = require('sanitize-html');

// Allowed HTML tags for rich content fields (content, description, notes)
const ALLOWED_HTML_CONFIG = {
  allowedTags: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li', 'a', 'h3', 'h4'],
  allowedAttributes: {
    'a': ['href', 'target', 'rel']
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    'a': (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        rel: 'noopener noreferrer',
        target: '_blank'
      }
    })
  }
};

// Fields that can contain HTML
const HTML_FIELDS = ['content', 'description', 'notes', 'intention', 'message'];

// Fields that should remain unchanged (URLs, dates, etc.)
const SKIP_FIELDS = ['imageUrl', 'photo', 'date', 'startDate', 'endDate', 'time', 'createdAt', 'updatedAt'];

/**
 * Sanitize a single value
 */
function sanitizeValue(value, fieldName) {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value !== 'string') {
    return value;
  }

  // Skip fields that shouldn't be modified
  if (SKIP_FIELDS.includes(fieldName)) {
    return value.trim();
  }

  // HTML fields - sanitize but allow certain tags
  if (HTML_FIELDS.includes(fieldName)) {
    return sanitizeHtml(value, ALLOWED_HTML_CONFIG).trim();
  }

  // All other string fields - strip ALL HTML tags
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj, parentKey = '') {
  if (Array.isArray(obj)) {
    return obj.map((item, index) => sanitizeObject(item, parentKey));
  }

  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value, key);
    }
    return sanitized;
  }

  return sanitizeValue(obj, parentKey);
}

/**
 * Express middleware to sanitize req.body
 */
function sanitizeMiddleware(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
}

module.exports = {
  sanitizeMiddleware,
  sanitizeValue,
  sanitizeObject,
  ALLOWED_HTML_CONFIG
};
