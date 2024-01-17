export const setup = () => {
  messagesEventsAbortArr = [];
};

export const destroy = () => {
  messagesEventsAbortArr.forEach((controller) => controller.abort());
};

// key & values must match
export const MessageEvents = Object.freeze({
  MessageLandingErrorEV: 'MessageLandingErrorEV',
  MessageAllEV: 'MessageAllEV',
  MessageProximityEV: 'MessageProximityEV',
});

/**
 * @param {MessageEvents} messageEV
 * @param {string | PlaneErrorObj | ProximityObj} msg
 */
export const publishMessage = (messageEV, msg) => {
  if (!MessageEvents[messageEV])
    throw new Error('unknown message event: ' + messageEV);

  if (messageEV === MessageEvents.MessageLandingErrorEV) {
    const obj = { ...PlaneErrorObj, ...msg };
    document.dispatchEvent(new CustomEvent(messageEV, { detail: obj }));
  }

  if (messageEV === MessageEvents.MessageAllEV) {
    document.dispatchEvent(new CustomEvent(messageEV, { detail: msg }));
  }

  if (messageEV === MessageEvents.MessageProximityEV) {
    const obj = { ...ProximityObj, ...msg };
    document.dispatchEvent(new CustomEvent(messageEV, { detail: obj }));
  }
};

/**
 * @param {MessageEvents} messageEV
 * @param {Function<string | PlaneErrorObj>} cb
 */
export const subscribeMessage = (messageEV, cb) => {
  if (!MessageEvents[messageEV])
    throw new Error('unknown message event: ' + messageEV);

  const controller = new AbortController();
  const signal = controller.signal;
  messagesEventsAbortArr.push(controller);

  document.addEventListener(
    messageEV,
    (ev) => {
      if (messageEV === MessageEvents.MessageLandingErrorEV) cb(ev.detail);
      if (messageEV === MessageEvents.MessageAllEV) cb(ev.detail);
      if (messageEV === MessageEvents.MessageProximityEV) cb(ev.detail);
    },
    { signal }
  );
};

// PRIVATE ///////////////////////////////////////////////////////////////

let messagesEventsAbortArr = [];

/**
 * @typedef {Object} PlaneErrorObj
 * @property {string} id
 * @property {string} msg
 */
const PlaneErrorObj = Object.freeze({
  id: '',
  msg: '',
});

/**
 * @typedef {Object} ProximityObj
 * @property {string} id
 * @property {string} msg
 * @property {number} scoreDecrease
 */
const ProximityObj = Object.freeze({
  id: '123|456',
  msg: '',
  scoreDecrease: -1,
});
