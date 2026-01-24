const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

// Gallery
export const getGallery = (category = null) => {
  const params = category && category !== 'all' ? `?category=${category}` : '';
  return fetchApi(`/gallery${params}`);
};

// History
export const getHistory = () => fetchApi('/history');

// Events
export const getEvents = () => fetchApi('/events');

// Parish Info
export const getParishInfo = () => fetchApi('/parish-info');

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
  getGallery,
  getHistory,
  getEvents,
  getParishInfo,
  sendContactMessage,
};
