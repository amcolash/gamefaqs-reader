export const SERVER = import.meta.env.PROD ? 'https://home.amcolash.com:8004' : 'https://localhost:8004';

export const deckSize = 1280;

const prefix = 'guide-viewer';
export const lastGame = `${prefix}-game`;
export const lastGuide = `${prefix}-guide`;
export const lastScroll = `${prefix}-scroll`;
export const lastZoom = `${prefix}-zoom`;
export const recentGuideKey = `${prefix}-recent-guides`;
export const introKey = `${prefix}-intro`;

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

// From https://www.geeksforgeeks.org/javascript-throttling/
export function throttle(func, timeout = 300) {
  let prev = 0;
  return (...args) => {
    let now = new Date().getTime();

    if (now - prev > timeout) {
      prev = now;
      return func(...args);
    }
  };
}

// Trigger onchange, from: https://stackoverflow.com/a/62111884/2303432
export function updateInputValue(input, newValue) {
  const valueSetter = Object.getOwnPropertyDescriptor(input, 'value').set;
  const prototype = Object.getPrototypeOf(input);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(input, newValue);
  } else {
    valueSetter.call(input, newValue);
  }
  input.dispatchEvent(new Event('input', { bubbles: true }));
}
