import { VictoryEvents, subscribeVictory } from './victory';

const collision = new Audio('/audio/collision-warning.mp3');
const ding = new Audio('/audio/ding.mp3');
const denied = new Audio('/audio/denied.mp3');

export const SoundType = Object.freeze({
  Collision: 'Collision',
  Ding: 'Ding',
  Fail: 'Fail',
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
