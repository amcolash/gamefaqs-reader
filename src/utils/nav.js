import { setIntervalImmediately, throttle } from './util';

let buttonPressListener;
let buttonReleaseListener;
let axisListener;
let scrollRepeatInterval;
let scrollAccel = 1;

let focus = true;

window.electronAPI.onFocusChange((_event, value) => {
  focus = value;
});

const throttledScroll = throttle((x, y) => {
  if (Math.abs(x) < 0.5 && Math.abs(y) < 0.5) scrollAccel = 1;
  else scrollAccel = Math.min(10, scrollAccel + 0.15);

  const scalar = document.querySelector('.guideContent') ? 70 : 30;
  x *= scrollAccel * scalar;
  y *= scrollAccel * scalar;

  const intro = document.querySelector('.intro > div');
  if (intro) intro.scrollBy(x, y);
  else window.scrollBy(x, y);
}, 30);

const throttledAxisKeyDown = throttle((e) => keyDown(e), 250);

export function initNavigation() {
  window.addEventListener('keydown', keyDown);

  if (buttonPressListener) buttonPressListener.unsubscribe();
  buttonPressListener = window.joypad.on('button_press', (e) => {
    if (!focus) return;
    if (e.detail.gamepad.index !== 0) return;

    const button = e.detail.index;

    switch (button) {
      case 0: // A (B nintendo)
        document.activeElement?.click();
        break;
      case 6: // R1
        if (scrollRepeatInterval) clearInterval(scrollRepeatInterval);
        scrollAccel = 0;
        scrollRepeatInterval = setIntervalImmediately(() => {
          scrollAccel = Math.min(20, scrollAccel + 1);
          window.scrollBy(0, -1000 - scrollAccel * 200);
        }, 150);
        break;
      case 7: // L1
        if (scrollRepeatInterval) clearInterval(scrollRepeatInterval);
        scrollAccel = 0;
        scrollRepeatInterval = setIntervalImmediately(() => {
          scrollAccel = Math.min(20, scrollAccel + 1);
          window.scrollBy(0, 1000 + scrollAccel * 200);
        }, 150);
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

  if (buttonReleaseListener) buttonReleaseListener.unsubscribe();
  buttonReleaseListener = window.joypad.on('button_release', (e) => {
    if (!focus) return;
    if (e.detail.gamepad.index !== 0) return;
    const button = e.detail.index;

    switch (button) {
      case 6: // R1
      case 7: // L1
        if (scrollRepeatInterval) clearInterval(scrollRepeatInterval);
        scrollRepeatInterval = undefined;
        break;
    }
  });

  if (axisListener) axisListener.unsubscribe();
  axisListener = window.joypad.on('axis_move', (e) => {
    if (!focus) return;
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
    if (e.detail.axis === 2) throttledScroll(e.detail.axisMovementValue, 0);

    // Right stick, vertical axis
    if (e.detail.axis === 3) throttledScroll(0, e.detail.axisMovementValue);
  });
}

export function cleanupNavigation() {
  window.removeEventListener('keydown', keyDown);

  buttonPressListener.unsubscribe();
  buttonPressListener = undefined;

  axisListener.unsubscribe();
  axisListener = undefined;
}

function keyDown(event) {
  if (!focus) return;

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
