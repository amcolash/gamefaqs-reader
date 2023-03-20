let listener;

export function initNavigation() {
  window.addEventListener('keydown', keyDown);

  if (listener) listener.unsubscribe();
  listener = window.joypad.on('button_press', (e) => {
    if (e.detail.gamepad.index !== 0) return;
    const button = e.detail.index;

    switch (button) {
      case 0: // A (B nintendo)
        document.activeElement?.click();
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
}

export function cleanupNavigation() {
  window.removeEventListener('keydown', keyDown);
  listener.unsubscribe();
}

function keyDown(event) {
  if (!document.querySelector('.keyboard')) {
    let handled = true;
    const activeClasses = document.activeElement?.classList;

    switch (event.key) {
      case 'ArrowDown':
        if (document.activeElement === document.body) {
          focusToIndex(document, 0);
        } else {
          focusItem(document, activeClasses?.contains('guide') || activeClasses?.contains('remove') ? 2 : 1, false, true);
        }
        break;
      case 'ArrowRight':
        if (document.activeElement === document.body) {
          focusToIndex(document, 0);
        } else if (!activeClasses?.contains('remove')) {
          focusItem(document, 1);
        }
        break;

      case 'ArrowUp':
        if (document.activeElement === document.body) {
          focusToIndex(document, 0);
        } else {
          focusItem(document, activeClasses?.contains('guide') || activeClasses?.contains('remove') ? -2 : -1);
        }
        break;
      case 'ArrowLeft':
        if (document.activeElement === document.body) {
          focusToIndex(document, 0);
        } else if (!activeClasses?.contains('guide')) {
          focusItem(document, -1);
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

  if (focusableEls[index]) focusableEls[index].focus();
}

function focusItem(el, dir, shouldWrap, exact) {
  const item = getFocusableItem(el, dir, shouldWrap, exact);
  if (item) item.focus();
}
