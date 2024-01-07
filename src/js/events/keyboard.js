// NOTE: key & values must match
export const KeyboardEvents = Object.freeze({
  KeyboardArrowDownEV: 'KeyboardArrowDownEV',
  KeyboardArrowUpEV: 'KeyboardArrowUpEV',
  KeyboardLetter_W_EV: 'KeyboardLetter_W_EV',
  KeyboardLetter_L_EV: 'KeyboardLetter_L_EV',
  KeyboardLetter_H_EV: 'KeyboardLetter_H_EV',
  KeyboardLetter_T_EV: 'KeyboardLetter_T_EV',
});

export const setup = () => {
  keyboardEventsAbortArr = [];
  document.addEventListener('keydown', keyDownFn);
};

export const destroy = () => {
  document.removeEventListener('keydown', keyDownFn);
  keyboardEventsAbortArr.forEach((controller) => controller.abort());
};

export const subscribeKeyboard = (keyboardEV, cb) => {
  if (!KeyboardEvents[keyboardEV]) {
    throw new Error('unknown keyboard event: ' + keyboardEV);
  }

  const controller = new AbortController();
  const signal = controller.signal;

  document.addEventListener(keyboardEV, cb, { signal });
  keyboardEventsAbortArr.push(controller);
};

// PRIVATE ///////////////////////////////////////////////////////////////

let keyboardEventsAbortArr = [];

const keyDownFn = (ev) => {
  switch (ev.key) {
    case 'ArrowDown':
      ev.preventDefault();
      document.dispatchEvent(new Event(KeyboardEvents.KeyboardArrowDownEV));
      break;
    case 'ArrowUp':
      ev.preventDefault();
      document.dispatchEvent(new Event(KeyboardEvents.KeyboardArrowUpEV));
      break;
    case 'w':
    case 'W':
      ev.preventDefault();
      document.dispatchEvent(new Event(KeyboardEvents.KeyboardLetter_W_EV));
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
};
