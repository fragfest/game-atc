// NOTE: key & values must match
export const MessageEvents = Object.freeze({
  MessageAllEV: 'MessageAllEV',
});

export const publish = (messageEV, msg) => {
  if (!MessageEvents[messageEV]) throw new Error('unknown message event: ' + messageEV);
  document.dispatchEvent(new CustomEvent(messageEV, { detail: { msg } }));
};

export const subscribe = (messageEV, cb) => {
  if (!MessageEvents[messageEV]) throw new Error('unknown message event: ' + messageEV);
  document.addEventListener(messageEV, (ev) => {
    cb(ev.detail.msg);
  });
};
