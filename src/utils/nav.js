import { throttle } from './util';

let buttonListener;
let axisListener;

const throttledXScroll = throttle((x) => {
  const intro = document.querySelector('.intro > div');
  if (intro) intro.scrollBy(x, 0);
  else window.scrollBy(x, 0);
}, 30);

const throttledYScroll = throttle((y) => {
  const intro = document.querySelector('.intro > div');
  if (intro) intro.scrollBy(0, y);
  else window.scrollBy(0, y);
}, 30);

const throttledAxisKeyDown = throttle((e) => keyDown(e), 250);

export function initNavigation() {
  window.addEventListener('keydown', keyDown);

  if (buttonListener) buttonListener.unsubscribe();
  buttonListener = window.joypad.on('button_press', (e) => {
    if (e.detail.gamepad.index !== 0) return;
    const button = e.detail.index;

    switch (button) {
      case 0: // A (B nintendo)
        document.activeElement?.click();
        break;
      case 6: // R1
        window.scrollBy(0, -1000);
        break;
      case 7: // L1
        window.scrollBy(0, 1000);
        break;
      case 12: // Dpad Up
        keyDown({ key: 'ArrowUp', preventDefault: () => {} });
        break;
      case 13: // Dpad Down
        keyDown({ key: 'ArrowDown', preventDefault: () => {} });
        break;
      case 14: // Dpad Left
        keyDown({ key: 'ArrowLeft', preventDefault: () => {} });
        break;
      case 15: // Dpad Right
        keyDown({ key: 'ArrowRight', preventDefault: () => {} });
        break;
    }
  });

  if (axisListener) axisListener.unsubscribe();
  axisListener = window.joypad.on('axis_move', (e) => {
    if (e.detail.gamepad.index !== 0) return;

    // Left stick, horizontal axis
    if (e.detail.axis === 0 && Math.abs(e.detail.axisMovementValue) > 0.2) {
      throttledAxisKeyDown({ key: e.detail.axisMovementValue > 0 ? 'ArrowRight' : 'ArrowLeft', preventDefault: () => {} });
    }

    // Left stick, vertical axis
    if (e.detail.axis === 1 && Math.abs(e.detail.axisMovementValue) > 0.2) {
      throttledAxisKeyDown({ key: e.detail.axisMovementValue > 0 ? 'ArrowDown' : 'ArrowUp', preventDefault: () => {} });
    }

    // Right stick, horizontal axis
    if (e.detail.axis === 2) {
      const scalar = document.querySelector('.guideContent') ? 50 : 20;
      throttledXScroll(e.detail.axisMovementValue * scalar);
    }

    // Right stick, vertical axis
    if (e.detail.axis === 3) {
      const scalar = document.querySelector('.guideContent') ? 50 : 20;
      throttledYScroll(e.detail.axisMovementValue * scalar);
    }
  });
}

export function cleanupNavigation() {
  window.removeEventListener('keydown', keyDown);

  buttonListener.unsubscribe();
  buttonListener = undefined;

  axisListener.unsubscribe();
  axisListener = undefined;
}

function keyDown(event) {
  const dialog = document.querySelector('.dialog');
  const key = event.key;

  if (dialog && key.includes('Arrow')) {
    if (document.activeElement === document.body) {
      focusToIndex(document, 0);
    } else {
      switch (key) {
        case 'ArrowRight':
          focusItem(dialog, 1, false);
          break;
        case 'ArrowLeft':
          focusItem(dialog, -1, false);
          break;
      }
    }

    event.preventDefault();

    return;
  }

  if (!document.querySelector('.keyboard')) {
    let handled = true;
    const activeClasses = document.activeElement?.classList;

    switch (event.key) {
      case 'ArrowUp':
        if (document.activeElement === document.body) {
          focusToIndex(document, 0);
        } else {
          focusItem(document, activeClasses?.contains('recentGuide') || activeClasses?.contains('remove') ? -2 : -1);
        }
        break;

      case 'ArrowDown':
        if (document.activeElement === document.body) {
          focusToIndex(document, 0);
        } else {
          focusItem(document, activeClasses?.contains('recentGuide') || activeClasses?.contains('remove') ? 2 : 1, false, true);
        }
        break;

      case 'ArrowLeft':
        if (document.activeElement === document.body) {
          focusToIndex(document, 0);
        } else if (!activeClasses?.contains('recentGuide')) {
          focusItem(document, -1);
        }
        break;

      case 'ArrowRight':
        if (document.activeElement === document.body) {
          focusToIndex(document, 0);
        } else if (!activeClasses?.contains('remove')) {
          focusItem(document, 1);
        }
        break;

      default:
        handled = false;
        break;
    }

    if (handled) event.preventDefault();
  }
}

function getFocusable(el) {
  return (el || document).querySelectorAll(
    'a[href]:not([disabled]), button:not([disabled]):not(.arrow), textarea:not([disabled]), input[type="text"]:not([disabled]),' +
      'input[type="search"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), ' +
      'select:not([disabled]), [tabindex="0"]:not([disabled])'
  );
}

function getFocusIndex(els, active) {
  const activeElement = active || document.activeElement;

  if (activeElement) {
    for (let i = 0; i < els.length; i++) {
      if (els[i] === activeElement) return i;
    }
  }

  return 0;
}

function getFocusableItem(el, dir, shouldWrap, exact) {
  const focusableEls = getFocusable(el);
  let index = getFocusIndex(focusableEls) + dir;

  if (shouldWrap) {
    if (index >= focusableEls.length) index = 0;
    if (index < 0) index = focusableEls.length - 1;
  } else {
    if (exact && (index < 0 || index > focusableEls.length - 1)) index -= dir;
    else index = Math.max(0, Math.min(index, focusableEls.length - 1));
  }

  return focusableEls[index];
}

function focusToIndex(el, index) {
  const focusableEls = getFocusable(el);
  index = Math.max(0, Math.min(index, focusableEls.length - 1));
  const item = focusableEls[index];

  if (item) item.focus();
}

function focusItem(el, dir, shouldWrap, exact) {
  const item = getFocusableItem(el, dir, shouldWrap, exact);
  if (item) item.focus();
}
