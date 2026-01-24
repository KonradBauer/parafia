const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Błąd walidacji',
      details: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

/**
 * Common validation rules
 */
const rules = {
  id: param('id').isInt({ min: 1 }).withMessage('Nieprawidłowe ID'),

  requiredString: (field, maxLength = 500) =>
    body(field)
      .trim()
      .notEmpty().withMessage(`Pole ${field} jest wymagane`)
      .isLength({ max: maxLength }).withMessage(`Pole ${field} może mieć max ${maxLength} znaków`),

  optionalString: (field, maxLength = 500) =>
    body(field)
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isLength({ max: maxLength }).withMessage(`Pole ${field} może mieć max ${maxLength} znaków`),

  requiredDate: (field) =>
    body(field)
      .trim()
      .notEmpty().withMessage(`Pole ${field} jest wymagane`)
      .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage(`Pole ${field} musi być w formacie YYYY-MM-DD`),

  optionalDate: (field) =>
    body(field)
      .optional({ nullable: true, checkFalsy: true })
      .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage(`Pole ${field} musi być w formacie YYYY-MM-DD`),

  optionalTime: (field) =>
    body(field)
      .optional({ nullable: true, checkFalsy: true })
      .matches(/^\d{2}:\d{2}$/).withMessage(`Pole ${field} musi być w formacie HH:MM`),

  requiredTime: (field) =>
    body(field)
      .trim()
      .notEmpty().withMessage(`Pole ${field} jest wymagane`)
      .matches(/^\d{2}:\d{2}$/).withMessage(`Pole ${field} musi być w formacie HH:MM`),

  optionalEmail: (field) =>
    body(field)
      .optional({ nullable: true, checkFalsy: true })
      .isEmail().withMessage('Nieprawidłowy adres email'),

  requiredEmail: (field) =>
    body(field)
      .trim()
      .notEmpty().withMessage('Email jest wymagany')
      .isEmail().withMessage('Nieprawidłowy adres email'),

  optionalPhone: (field) =>
    body(field)
      .optional({ nullable: true, checkFalsy: true })
      .matches(/^[\d\s\-+()]{6,20}$/).withMessage('Nieprawidłowy numer telefonu'),

  optionalUrl: (field) =>
    body(field)
      .optional({ nullable: true, checkFalsy: true })
      .isURL({ protocols: ['http', 'https'], require_protocol: false })
      .withMessage('Nieprawidłowy adres URL'),

  optionalInt: (field, min = 0, max = 9999) =>
    body(field)
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min, max }).withMessage(`Pole ${field} musi być liczbą od ${min} do ${max}`),

  requiredInt: (field, min = 0, max = 9999) =>
    body(field)
      .notEmpty().withMessage(`Pole ${field} jest wymagane`)
      .isInt({ min, max }).withMessage(`Pole ${field} musi być liczbą od ${min} do ${max}`),

  boolean: (field) =>
    body(field)
      .optional()
      .isBoolean().withMessage(`Pole ${field} musi być wartością logiczną`)
};

/**
 * Validation schemas for each entity
 */
const schemas = {
  // Announcements
  announcement: [
    rules.requiredString('title', 200),
    rules.requiredDate('date'),
    rules.optionalString('week', 100),
    rules.optionalString('content', 10000),
    rules.boolean('isNew')
  ],

  // Intentions
  intentionWeek: [
    rules.requiredDate('startDate'),
    rules.requiredDate('endDate'),
    body('intentions')
      .optional()
      .isArray().withMessage('Intencje muszą być tablicą'),
    body('intentions.*.date')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Data intencji musi być w formacie YYYY-MM-DD'),
    body('intentions.*.time')
      .optional()
      .matches(/^\d{2}:\d{2}$/).withMessage('Godzina intencji musi być w formacie HH:MM'),
    body('intentions.*.intention')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Intencja może mieć max 1000 znaków')
  ],

  // Mass Times
  massTime: [
    rules.requiredTime('time'),
    body('dayType')
      .trim()
      .notEmpty().withMessage('Typ dnia jest wymagany')
      .isIn(['sunday', 'weekday', 'holiday']).withMessage('Nieprawidłowy typ dnia'),
    rules.optionalString('description', 200),
    rules.optionalInt('sortOrder', 0, 999)
  ],

  // Priests
  priest: [
    rules.requiredString('name', 200),
    rules.requiredString('role', 200),
    rules.optionalPhone('phone'),
    rules.optionalUrl('photo'),
    rules.optionalInt('sortOrder', 0, 999)
  ],

  // Priests from parish
  priestFromParish: [
    rules.requiredString('name', 200),
    rules.requiredInt('ordinationYear', 1800, 2100),
    rules.optionalString('orderName', 200),
    rules.optionalString('notes', 2000)
  ],

  // Gallery
  galleryItem: [
    rules.requiredString('title', 200),
    rules.optionalString('description', 2000),
    rules.optionalUrl('imageUrl'),
    rules.optionalDate('date'),
    body('category')
      .optional({ nullable: true, checkFalsy: true })
      .isIn(['events', 'church', 'parish', 'other']).withMessage('Nieprawidłowa kategoria'),
    rules.optionalInt('sortOrder', 0, 999)
  ],

  // History
  historyItem: [
    rules.requiredInt('year', 0, 2100),
    rules.requiredString('title', 200),
    rules.requiredString('content', 10000),
    rules.optionalUrl('imageUrl'),
    rules.optionalInt('sortOrder', 0, 999)
  ],

  // Events
  event: [
    rules.requiredString('title', 200),
    rules.requiredDate('date'),
    rules.optionalTime('time'),
    rules.optionalString('description', 5000)
  ],

  // Parish Info
  parishInfo: [
    rules.optionalString('address', 500),
    rules.optionalPhone('phone'),
    rules.optionalEmail('email'),
    rules.optionalString('officeHoursWeekday', 200),
    rules.optionalString('officeHoursWeekend', 200),
    rules.optionalString('bankAccount', 100)
  ],

  // Contact Messages
  contactMessage: [
    rules.requiredString('name', 200),
    rules.requiredEmail('email'),
    rules.optionalPhone('phone'),
    rules.requiredString('subject', 200),
    rules.requiredString('message', 5000)
  ],

  // Auth
  login: [
    rules.requiredString('username', 100),
    rules.requiredString('password', 100)
  ]
};

module.exports = {
  validate,
  rules,
  schemas
};
