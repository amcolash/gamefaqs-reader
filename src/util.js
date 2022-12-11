export const SERVER = 'http://192.168.1.106:7000';

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
