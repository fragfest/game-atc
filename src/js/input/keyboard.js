// NOTE: key & values must match
export const KeyboardEvents = Object.freeze({
  KeyboardArrowDownEV: 'KeyboardArrowDownEV',
  KeyboardArrowUpEV: 'KeyboardArrowUpEV'
});

let isSetup = false;
export const setup = () => {
  if (isSetup) return;
  isSetup = true;

  document.addEventListener('keydown', (ev) => {
    switch (ev.key) {
      case 'ArrowDown':
        document.dispatchEvent(new Event(KeyboardEvents.KeyboardArrowDownEV));
        break;
      case 'ArrowUp':
        document.dispatchEvent(new Event(KeyboardEvents.KeyboardArrowUpEV));
        break;
    }
  });
};

export const subscribe = (keyboardEV, cb) => {
  if (!KeyboardEvents[keyboardEV]) throw new Error('unknown keyboard event: ' + keyboardEV);
  document.addEventListener(keyboardEV, cb);
};
