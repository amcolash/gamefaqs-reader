import { cookieKey } from './util';

export async function getCookie() {
  const existing = JSON.parse(localStorage.getItem(cookieKey) || '{}');

  const week = 1000 * 60 * 60 * 24 * 7;
  if (existing.expires && Date.now() + week < new Date(existing.expires)) {
    return existing;
  } else {
    const cookie = await window.electronAPI.cookie();

    if (cookie.err) throw 'Could not get gamefaqs cookie';

    localStorage.setItem(cookieKey, JSON.stringify(cookie));
    return cookie;
  }
}
