// NOTE: key & values must match
export const MessageEvents = Object.freeze({
  MessageAllEV: 'MessageAllEV',
  MessageProximityEV: 'MessageProximityEV',
});

/**
 * @param {MessageEvents} messageEV
 * @param {string|ProximityObj} msg
 */
export const publishMessage = (messageEV, msg) => {
  if (!MessageEvents[messageEV])
    throw new Error('unknown message event: ' + messageEV);

  if (messageEV === MessageEvents.MessageAllEV) {
    document.dispatchEvent(new CustomEvent(messageEV, { detail: msg }));
  }
  if (messageEV === MessageEvents.MessageProximityEV) {
    const obj = { ...ProximityObj, ...msg };
    document.dispatchEvent(new CustomEvent(messageEV, { detail: obj }));
  }
};

// TODO when un-commented, add EventListener removal code as well
// export const subscribeMessage = (messageEV, cb) => {
//   if (!MessageEvents[messageEV])
//     throw new Error('unknown message event: ' + messageEV);

//   document.addEventListener(messageEV, (ev) => {
//     if (messageEV === MessageEvents.MessageAllEV) cb(ev.detail);
//     if (messageEV === MessageEvents.MessageProximityEV) cb(ev.detail);
//   });
// };

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
