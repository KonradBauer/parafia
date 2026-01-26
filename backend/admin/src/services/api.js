const API_URL = '/api'

function getAuthHeaders() {
  const token = localStorage.getItem('admin_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('admin_token')
    window.location.href = '/admin'
    throw new Error('Sesja wygasla')
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || data.errors?.[0]?.msg || 'Wystapil blad')
  }

  return data
}

async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Blad uploadu')
  }

  return response.json()
}

const api = {
  // Auth
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  verifyAuth: () => request('/auth/verify'),

  // Upload
  uploadFile,

  // Announcements
  getAnnouncements: () => request('/announcements'),
  getAnnouncement: (id) => request(`/announcements/${id}`),
  createAnnouncement: (data) =>
    request('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  updateAnnouncement: (id, data) =>
    request(`/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAnnouncement: (id) =>
    request(`/announcements/${id}`, { method: 'DELETE' }),

  // Intentions
  getIntentions: () => request('/intentions'),
  getIntention: (id) => request(`/intentions/${id}`),
  createIntention: (data) =>
    request('/intentions', { method: 'POST', body: JSON.stringify(data) }),
  updateIntention: (id, data) =>
    request(`/intentions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteIntention: (id) =>
    request(`/intentions/${id}`, { method: 'DELETE' }),

  // Mass Times
  getMassTimes: () => request('/mass-times'),
  createMassTime: (data) =>
    request('/mass-times', { method: 'POST', body: JSON.stringify(data) }),
  updateMassTime: (id, data) =>
    request(`/mass-times/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMassTime: (id) =>
    request(`/mass-times/${id}`, { method: 'DELETE' }),

  // Priests
  getPriests: () => request('/priests'),
  createPriest: (data) =>
    request('/priests', { method: 'POST', body: JSON.stringify(data) }),
  updatePriest: (id, data) =>
    request(`/priests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePriest: (id) =>
    request(`/priests/${id}`, { method: 'DELETE' }),

  // Priests from Parish
  getPriestsFromParish: () => request('/priests-from-parish'),
  createPriestFromParish: (data) =>
    request('/priests-from-parish', { method: 'POST', body: JSON.stringify(data) }),
  updatePriestFromParish: (id, data) =>
    request(`/priests-from-parish/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePriestFromParish: (id) =>
    request(`/priests-from-parish/${id}`, { method: 'DELETE' }),

  // Gallery Categories
  getGalleryCategories: () => request('/gallery-categories'),
  createGalleryCategory: (data) =>
    request('/gallery-categories', { method: 'POST', body: JSON.stringify(data) }),
  updateGalleryCategory: (id, data) =>
    request(`/gallery-categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGalleryCategory: (id) =>
    request(`/gallery-categories/${id}`, { method: 'DELETE' }),

  // Gallery
  getGallery: () => request('/gallery'),
  createGalleryItem: (data) =>
    request('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  updateGalleryItem: (id, data) =>
    request(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGalleryItem: (id) =>
    request(`/gallery/${id}`, { method: 'DELETE' }),

  // History
  getHistory: () => request('/history'),
  createHistoryItem: (data) =>
    request('/history', { method: 'POST', body: JSON.stringify(data) }),
  updateHistoryItem: (id, data) =>
    request(`/history/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHistoryItem: (id) =>
    request(`/history/${id}`, { method: 'DELETE' }),

  // Events
  getEvents: () => request('/events/all'),
  createEvent: (data) =>
    request('/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) =>
    request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id) =>
    request(`/events/${id}`, { method: 'DELETE' }),

  // Parish Info
  getParishInfo: () => request('/parish-info'),
  updateParishInfo: (data) =>
    request('/parish-info', { method: 'PUT', body: JSON.stringify(data) }),

  // Contact Messages
  getMessages: () => request('/contact-messages'),
  markMessageRead: (id) =>
    request(`/contact-messages/${id}/read`, { method: 'PUT' }),
  deleteMessage: (id) =>
    request(`/contact-messages/${id}`, { method: 'DELETE' }),

  // About Section
  getAboutSection: () => request('/about-section'),
  updateAboutSection: (data) =>
    request('/about-section', { method: 'PUT', body: JSON.stringify(data) }),

  // History About Section
  getHistoryAbout: () => request('/history-about'),
  updateHistoryAbout: (data) =>
    request('/history-about', { method: 'PUT', body: JSON.stringify(data) }),
}

export default api
