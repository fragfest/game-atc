import { VictoryEvents, subscribeVictory } from './victory';
import { subscribeScore, ScoreEvents } from './score';

let collision;
let ding;
let denied;
let takeoff;
let chime;
let pling;
let flick;
let squelch;

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

let isMuted = true;
let oldScore = null;
let isSetup = false;

export const setup = () => {
  if (isSetup) return;
  isSetup = true;

  collision = new Audio('/audio/collision-warning.mp3');
  ding = new Audio('/audio/ding.mp3');
  denied = new Audio('/audio/denied.mp3');
  takeoff = new Audio('/audio/take-off.mp3');
  chime = new Audio('/audio/chime-ping.mp3');
  pling = new Audio('/audio/pling.mp3');
  flick = new Audio('/audio/select-flick.mp3');
  squelch = new Audio('/audio/radio-squelch.mp3');
  setMute(true);

  subscribeScore(ScoreEvents.ScoreEV, (score) => {
    if (oldScore) {
      if (
        score.departures > oldScore.departures ||
        score.arrivals > oldScore.arrivals
      ) {
        play(SoundType.Success);
      }

      if (score.failed > oldScore.failed) {
        play(SoundType.Fail);
      }
    }

    oldScore = { ...score };
  });
};

/**
 * @param {Boolean} isMutedArg
 */
export const setMute = (isMutedArg) => {
  isMuted = !!isMutedArg;
  collision.muted = isMuted;
  ding.muted = isMuted;
  denied.muted = isMuted;
  takeoff.muted = isMuted;
  chime.muted = isMuted;
  pling.muted = isMuted;
  flick.muted = isMuted;
  squelch.muted = isMuted;
};

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
    // TODO Safari only plays squelch after other user-triggered sounds
    return squelch.play();
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
