const _0x2c9a5b = _0x45b1;
(function (_0x2f3ac3, _0x10e703) {
  const _0x11ab1e = _0x45b1,
    _0x513a97 = _0x2f3ac3();
  while (!![]) {
    try {
      const _0x3edc7f =
        (parseInt(_0x11ab1e(0x196)) / 0x1) *
          (parseInt(_0x11ab1e(0x1a6)) / 0x2) +
        parseInt(_0x11ab1e(0x1a8)) / 0x3 +
        (parseInt(_0x11ab1e(0x1a4)) / 0x4) *
          (-parseInt(_0x11ab1e(0x1a0)) / 0x5) +
        (-parseInt(_0x11ab1e(0x195)) / 0x6) *
          (-parseInt(_0x11ab1e(0x19b)) / 0x7) +
        -parseInt(_0x11ab1e(0x1a3)) / 0x8 +
        (parseInt(_0x11ab1e(0x19a)) / 0x9) *
          (-parseInt(_0x11ab1e(0x194)) / 0xa) +
        (parseInt(_0x11ab1e(0x1a7)) / 0xb) * (parseInt(_0x11ab1e(0x197)) / 0xc);
      if (_0x3edc7f === _0x10e703) break;
      else _0x513a97['push'](_0x513a97['shift']());
    } catch (_0x483439) {
      _0x513a97['push'](_0x513a97['shift']());
    }
  }
})(_0x2b18, 0x80ff7);
function _0x45b1(_0x3152fa, _0x50e95f) {
  const _0x2b183a = _0x2b18();
  return (
    (_0x45b1 = function (_0x45b1c3, _0xdbc01) {
      _0x45b1c3 = _0x45b1c3 - 0x194;
      let _0x2134ec = _0x2b183a[_0x45b1c3];
      return _0x2134ec;
    }),
    _0x45b1(_0x3152fa, _0x50e95f)
  );
}
import { default as _0x154403 } from 'jwt-encode';
import { EncryptStorage } from 'encrypt-storage';
let encryptStorage;
const jwtKey = _0x2c9a5b(0x19f),
  x = '06d6dd1b-76bb-4e0f-9d66-6dd80e324211';
export const getBadgesJwt = () => {
  const _0x44b114 = getBadgesArrSecure() || [];
  return _0x154403(_0x44b114, jwtKey);
};
export const getBadgesArrSecure = () => {
  const _0x4f5fae = _0x2c9a5b;
  !encryptStorage &&
    (encryptStorage = new EncryptStorage(
      '8c329fcb-0fb7-4401-a9f6-65332dcdb21b',
      { prefix: _0x4f5fae(0x19c) }
    ));
  const _0x1bf991 = encryptStorage['getItem']('badges', {
    prefix: _0x4f5fae(0x19c),
  });
  if (!_0x1bf991) return null;
  const _0x4df50e = encryptStorage[_0x4f5fae(0x1a5)](_0x1bf991);
  return (encryptStorage = null), _0x4df50e;
};
export const setBadgesArrSecure = (_0x589bcb) => {
  const _0x26a468 = _0x2c9a5b;
  !encryptStorage &&
    (encryptStorage = new EncryptStorage(window[x], {
      prefix: _0x26a468(0x19c),
    })),
    encryptStorage[_0x26a468(0x198)](_0x26a468(0x199), _0x589bcb),
    (encryptStorage = null),
    (window[x] = null);
};
export const setHistorySecure = (_0x483812) => {
  const _0x41db29 = _0x2c9a5b;
  !encryptStorage &&
    (encryptStorage = new EncryptStorage(window[x], {
      prefix: _0x41db29(0x19c),
    })),
    encryptStorage[_0x41db29(0x198)](_0x41db29(0x19d), _0x483812),
    (encryptStorage = null),
    (window[x] = null);
};
function _0x2b18() {
  const _0x13471b = [
    'history-records',
    'getItem',
    '005f70ef-e7c9-49ef-98a2-df9b1052e6c4',
    '37475xVtNEf',
    'score',
    '8c329fcb-0fb7-4401-a9f6-65332dcdb21b',
    '5741736BXEuqS',
    '484Stupqb',
    'decryptValue',
    '810916rgdhKh',
    '33ZzxCKx',
    '782583zzjgSZ',
    '10EwnSNN',
    '10128TiGWCh',
    '1GEMrie',
    '6694284XqaThI',
    'setItem',
    'badges',
    '2396151WGjjAd',
    '329TIKjGe',
    'atc-ffo',
  ];
  _0x2b18 = function () {
    return _0x13471b;
  };
  return _0x2b18();
}
export const getHistoryJwt = () => {
  const _0x230fa2 = getHistorySecure() || [];
  return _0x154403(_0x230fa2, jwtKey);
};
export const getHistorySecure = () => {
  const _0x2e3979 = _0x2c9a5b;
  !encryptStorage &&
    (encryptStorage = new EncryptStorage(_0x2e3979(0x1a2), {
      prefix: 'atc-ffo',
    }));
  const _0x4ae4af = encryptStorage[_0x2e3979(0x19e)](_0x2e3979(0x19d), {
    prefix: 'atc-ffo',
  });
  if (!_0x4ae4af) return null;
  const _0x1f6471 = encryptStorage[_0x2e3979(0x1a5)](_0x4ae4af);
  return (encryptStorage = null), _0x1f6471;
};
export const setScoreSecure = (_0xdec458) => {
  const _0x51da92 = _0x2c9a5b;
  !encryptStorage &&
    (encryptStorage = new EncryptStorage(window[x], {
      prefix: _0x51da92(0x19c),
    })),
    encryptStorage[_0x51da92(0x198)](_0x51da92(0x1a1), _0xdec458),
    (encryptStorage = null),
    (window[x] = null);
};
export const getScoreSecure = () => {
  const _0xabce65 = getScoreBasicSecure();
  return (encryptStorage = null), _0xabce65;
};
export const getScoreBasicSecure = () => {
  const _0x438ec8 = _0x2c9a5b;
  !encryptStorage &&
    (encryptStorage = new EncryptStorage(
      '8c329fcb-0fb7-4401-a9f6-65332dcdb21b',
      { prefix: _0x438ec8(0x19c) }
    ));
  const _0x4b7fb0 = encryptStorage[_0x438ec8(0x19e)]('score', {
    prefix: _0x438ec8(0x19c),
  });
  if (!_0x4b7fb0) return null;
  const _0x1fb974 = encryptStorage['decryptValue'](_0x4b7fb0);
  return _0x1fb974;
};
