const KEY = 'xh_favorites';

export function getFavorites() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  const next = idx === -1 ? [...favs, id] : favs.filter((f) => f !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('xh_favorites_changed'));
  return next.includes(id);
}
