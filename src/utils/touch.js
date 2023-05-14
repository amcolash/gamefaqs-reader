const startPos = {
  x: 0,
  y: 0,
  windowX: 0,
  windowY: 0,
  scrolling: false,
};

const onDown = (e) => {
  startPos.x = e.clientX;
  startPos.y = e.clientY;
  startPos.windowX = window.scrollX;
  startPos.windowY = window.scrollY;
  startPos.scrolling = true;
};

const onMove = (e) => {
  if (!startPos.scrolling) return;

  let xDiff = e.clientX - startPos.x;
  let yDiff = e.clientY - startPos.y;

  xDiff = Math.pow(Math.abs(xDiff), 1.25) * (xDiff < 0 ? -1 : 1);
  yDiff = Math.pow(Math.abs(yDiff), 1.25) * (yDiff < 0 ? -1 : 1);

  window.scroll(startPos.windowX - xDiff, startPos.windowY - yDiff);
  e.preventDefault();
};

const onUp = (e) => {
  startPos.scrolling = false;
};

export function initTouchScrolling() {
  window.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
}

export function cleanupTouchScrolling() {
  window.removeEventListener('pointerdown', onDown);
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerup', onUp);
}
