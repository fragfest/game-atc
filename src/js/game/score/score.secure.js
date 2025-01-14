////////////////////////////////////////////////////////
// NOTE run code obfuscator on this file before prod deploy
// Goal is to create difficulty in setting localStorage.
////////////////////////////////////////////////////////

import { EncryptStorage } from 'encrypt-storage';
let encryptStorage;

// set the key on the global window object in unexpected places
// prior to calls to setScore() in score.js
const x = '06d6dd1b-76bb-4e0f-9d66-6dd80e324211';

export const setScoreSecure = (score) => {
  if (!encryptStorage) {
    encryptStorage = new EncryptStorage(window[x], { prefix: 'atc-ffo' });
  }
  encryptStorage.setItem('score', score);
  encryptStorage = null;
  window[x] = null;
};

export const getScoreSecure = () => {
  const score = getScoreBasicSecure();
  encryptStorage = null;
  return score;
};

export const getScoreBasicSecure = () => {
  if (!encryptStorage) {
    encryptStorage = new EncryptStorage(
      '8c329fcb-0fb7-4401-a9f6-65332dcdb21b',
      { prefix: 'atc-ffo' }
    );
  }
  const cipher = encryptStorage.getItem('score', { prefix: 'atc-ffo' });
  if (!cipher) return null;

  const score = encryptStorage.decryptValue(cipher);
  return score;
};
