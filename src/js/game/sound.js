import { VictoryEvents, subscribeVictory } from './victory';

const collision = new Audio('/audio/collision-warning.mp3');
const ding = new Audio('/audio/ding.mp3');
const denied = new Audio('/audio/denied.mp3');
const takeoff = new Audio('/audio/take-off.mp3');
const chime = new Audio('/audio/chime-ping.mp3');
const pling = new Audio('/audio/pling.mp3');
const flick = new Audio('/audio/select-flick.mp3');

export const SoundType = Object.freeze({
  Collision: 'Collision',
  Ding: 'Ding',
  Fail: 'Fail',
  Success: 'Success',
  Takeoff: 'Takeoff',
  Chime: 'Chime',
  Spawn: 'Spawn',
  Select: 'Select',
});

let isCollisionSubscribed = false;

/**
 * @param {SoundType} soundType
 */
export const playLoop = (soundType) => {
  if (soundType === SoundType.Collision) {
    collision.loop = true;
    collision.play();

    if (isCollisionSubscribed) return;

    isCollisionSubscribed = true;
    subscribeVictory(VictoryEvents.Failed, () => stop(SoundType.Collision));
    subscribeVictory(VictoryEvents.Success, () => stop(SoundType.Collision));
    return;
  }

  console.error('soundType not supported:', soundType);
};

/**
 * @param {SoundType} soundType
 */
export const play = (soundType) => {
  if (soundType === SoundType.Ding) {
    return ding.play();
  }
  if (soundType === SoundType.Fail) {
    return denied.play();
  }
  if (soundType === SoundType.Success) {
    return pling.play();
  }
  if (soundType === SoundType.Takeoff) {
    takeoff.volume = 0.5;
    return takeoff.play();
  }
  if (soundType === SoundType.Chime) {
    return chime.play();
  }
  if (soundType === SoundType.Spawn) {
    const squelch = new Audio('/audio/radio-squelch.mp3');
    return enqueuePlay(squelch);
  }
  if (soundType === SoundType.Select) {
    return flick.play();
  }

  console.error('soundType not supported:', soundType);
};

/**
 * @param {SoundType} soundType
 */
export const stop = (soundType) => {
  if (soundType === SoundType.Collision) {
    collision.pause();
    collision.currentTime = 0;
    return;
  }

  console.error('soundType not supported:', soundType);
};

// PRIVATE ////////////////////////////////////////////////////////////
const playQueue = [];

let lock = false;
setInterval(() => {
  if (playQueue.length && !lock) {
    lock = true;
    const audio = playQueue.pop();
    audio.addEventListener('ended', () => {
      lock = false;
    });
    audio?.play();
  }
}, 10);

const enqueuePlay = (audio) => {
  playQueue.push(audio);
};
