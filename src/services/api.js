const API_URL = import.meta.env.VITE_API_URL || '/api';
const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || '';

// Helper to build full image URL
export const getImageUrl = (path) => {
  if (!path) return null;
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Otherwise prepend uploads base URL
  return `${UPLOADS_URL}${path}`;
};

async function fetchApi(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Announcements
export const getAnnouncements = () => fetchApi('/announcements');
export const getAnnouncement = (id) => fetchApi(`/announcements/${id}`);

// Intentions
export const getIntentions = () => fetchApi('/intentions');
export const getIntention = (id) => fetchApi(`/intentions/${id}`);

// Mass Times
export const getMassTimes = () => fetchApi('/mass-times');

// Priests
export const getPriests = () => fetchApi('/priests');

// Priests from Parish
export const getPriestsFromParish = () => fetchApi('/priests-from-parish');

// Gallery Categories
export const getGalleryCategories = () => fetchApi('/gallery-categories');

// Gallery
export const getGallery = (categoryId = null) => {
  const params = categoryId && categoryId !== 'all' ? `?categoryId=${categoryId}` : '';
  return fetchApi(`/gallery${params}`);
};

// History
export const getHistory = () => fetchApi('/history');

// Events
export const getEvents = () => fetchApi('/events');

// Parish Info
export const getParishInfo = () => fetchApi('/parish-info');

// About Section (O nas)
export const getAboutSection = () => fetchApi('/about-section');

// History About Section (O parafii)
export const getHistoryAbout = () => fetchApi('/history-about');

// Contact Messages
export const sendContactMessage = (data) => fetchApi('/contact-messages', {
  method: 'POST',
  body: JSON.stringify(data),
});

export default {
  getAnnouncements,
  getAnnouncement,
  getIntentions,
  getIntention,
  getMassTimes,
  getPriests,
  getPriestsFromParish,
  getGalleryCategories,
  getGallery,
  getHistory,
  getEvents,
  getParishInfo,
  sendContactMessage,
};
