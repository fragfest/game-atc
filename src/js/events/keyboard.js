// NOTE: key & values must match
export const KeyboardEvents = Object.freeze({
  KeyboardArrowDownEV: 'KeyboardArrowDownEV',
  KeyboardArrowUpEV: 'KeyboardArrowUpEV',
  KeyboardLetter_L_EV: 'KeyboardLetter_L_EV',
  KeyboardLetter_H_EV: 'KeyboardLetter_H_EV',
  KeyboardLetter_T_EV: 'KeyboardLetter_T_EV',
});

let isSetup = false;
export const setup = () => {
  if (isSetup) return;
  isSetup = true;

  document.addEventListener('keydown', (ev) => {
    switch (ev.key) {
      case 'ArrowDown':
        ev.preventDefault();
        document.dispatchEvent(new Event(KeyboardEvents.KeyboardArrowDownEV));
        break;
      case 'ArrowUp':
        ev.preventDefault();
        document.dispatchEvent(new Event(KeyboardEvents.KeyboardArrowUpEV));
        break;
      case 'l':
      case 'L':
        ev.preventDefault();
        document.dispatchEvent(new Event(KeyboardEvents.KeyboardLetter_L_EV));
        break;
      case 'h':
      case 'H':
        ev.preventDefault();
        document.dispatchEvent(new Event(KeyboardEvents.KeyboardLetter_H_EV));
        break;
      case 't':
      case 'T':
        ev.preventDefault();
        document.dispatchEvent(new Event(KeyboardEvents.KeyboardLetter_T_EV));
        break;
    }
  });
};

export const subscribe = (keyboardEV, cb) => {
  if (!KeyboardEvents[keyboardEV]) throw new Error('unknown keyboard event: ' + keyboardEV);
  document.addEventListener(keyboardEV, cb);
};
