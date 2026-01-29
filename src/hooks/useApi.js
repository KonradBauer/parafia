import { useState, useEffect, useCallback } from 'react';

export function useApi(apiFunction, dependencies = [], options = {}) {
  const { immediate = true, initialData = null } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [...dependencies, immediate]);

  return { data, loading, error, execute, setData };
}

export function useAnnouncements() {
  return useApi(async () => {
    const { getAnnouncements } = await import('../services/api');
    return getAnnouncements();
  });
}

export function useIntentions() {
  return useApi(async () => {
    const { getLatestIntention } = await import('../services/api');
    return getLatestIntention();
  });
}

export function useMassTimes() {
  return useApi(async () => {
    const { getMassTimes } = await import('../services/api');
    return getMassTimes();
  });
}

export function usePriests() {
  return useApi(async () => {
    const { getPriests } = await import('../services/api');
    return getPriests();
  });
}

export function usePriestsFromParish() {
  return useApi(async () => {
    const { getPriestsFromParish } = await import('../services/api');
    return getPriestsFromParish();
  });
}

export function useGalleryCategories() {
  return useApi(async () => {
    const { getGalleryCategories } = await import('../services/api');
    return getGalleryCategories();
  });
}

export function useGallery(categoryId = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { getGallery } = await import('../services/api');
        const result = await getGallery(categoryId);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  return { data, loading, error };
}

export function useHistory() {
  return useApi(async () => {
    const { getHistory } = await import('../services/api');
    return getHistory();
  });
}

export function useEvents() {
  return useApi(async () => {
    const { getEvents } = await import('../services/api');
    return getEvents();
  });
}

export function useParishInfo() {
  return useApi(async () => {
    const { getParishInfo } = await import('../services/api');
    return getParishInfo();
  });
}

export function useAboutSection() {
  return useApi(async () => {
    const { getAboutSection } = await import('../services/api');
    return getAboutSection();
  });
}

export function useHistoryAbout() {
  return useApi(async () => {
    const { getHistoryAbout } = await import('../services/api');
    return getHistoryAbout();
  });
}

export default useApi;
