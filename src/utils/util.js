export const SERVER = import.meta.env.PROD ? 'https://192.168.1.101:8004' : 'https://192.168.1.106:8004';

const prefix = 'guide-viewer';
export const lastGame = `${prefix}-game`;
export const lastGuide = `${prefix}-guide`;
export const lastScroll = `${prefix}-scroll`;
export const lastZoom = `${prefix}-zoom`;
export const recentGuideKey = `${prefix}-recent-guides`;

// From https://stackoverflow.com/a/17323608/2303432
export function mod(n, m) {
  return ((n % m) + m) % m;
}

// From https://www.freecodecamp.org/news/javascript-debounce-example/
export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export async function loadServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });

      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
        window.location.reload();
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
}
