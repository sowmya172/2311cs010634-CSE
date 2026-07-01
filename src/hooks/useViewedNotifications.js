import { useState, useEffect } from 'react';

export function useViewedNotifications() {
  const [viewedIds, setViewedIds] = useState(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('viewedNotifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setViewedIds(new Set(parsed));
        }
      } catch (e) {
        console.error("Failed to parse viewed notifications", e);
      }
    }
  }, []);

  const markAsViewed = (id) => {
    setViewedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const isViewed = (id) => {
    return viewedIds.has(id);
  };

  return { viewedIds, markAsViewed, isViewed };
}
