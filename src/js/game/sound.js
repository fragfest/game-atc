import { VictoryEvents, subscribeVictory } from './victory';
import { subscribeScore, ScoreEvents } from './score';

let background;
let collision;
let ding;
let denied;
let takeoff;
let chime;
let pling;
let tock;
let flick;
let squelch;

export const SoundType = Object.freeze({
  Background: 'Background',
  Collision: 'Collision',
  Ding: 'Ding',
  Fail: 'Fail',
  Success: 'Success',
  Takeoff: 'Takeoff',
  Chime: 'Chime',
  Spawn: 'Spawn',
  Set: 'Set',
  Select: 'Select',
});

let isMuted = true;
let oldScore = null;
let isSubscribed = false;
let isBackgroundPlaying = false;

export const setup = () => {
  isBackgroundPlaying = false;

  background = new Audio('/audio/tower-background.mp3');
  collision = new Audio('/audio/collision-warning.mp3');
  ding = new Audio('/audio/ding.mp3');
  denied = new Audio('/audio/denied.mp3');
  takeoff = new Audio('/audio/take-off.mp3');
  chime = new Audio('/audio/chime-ping.mp3');
  pling = new Audio('/audio/pling.mp3');
  tock = new Audio('/audio/select-tock-short.mp3');
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

export const destroy = () => {
  setMute(true);
  stop(SoundType.Background);
  background = null;

  collision = null;
  ding = null;
  denied = null;
  takeoff = null;
  chime = null;
  pling = null;
  tock = null;
  flick = null;
  squelch = null;
};

/**
 * @param {Boolean} isMutedArg
 */
export const setMute = (isMutedArg) => {
  isMuted = !!isMutedArg;

  if (!isBackgroundPlaying && !isMuted) {
    isBackgroundPlaying = true;
    playLoop(SoundType.Background);
  }

  background.muted = isMuted;
  collision.muted = isMuted;
  ding.muted = isMuted;
  denied.muted = isMuted;
  takeoff.muted = isMuted;
  chime.muted = isMuted;
  pling.muted = isMuted;
  tock.muted = isMuted;
  flick.muted = isMuted;
  squelch.muted = isMuted;
};

/**
 * @param {SoundType} soundType
 */
export const playLoop = (soundType) => {
  if (!isSubscribed) {
    isSubscribed = true;
    subscribeVictory(VictoryEvents.Failed, () => {
      stop(SoundType.Collision);
      stop(SoundType.Background);
    });
    subscribeVictory(VictoryEvents.Success, () => {
      stop(SoundType.Collision);
      stop(SoundType.Background);
    });
  }

  if (soundType === SoundType.Background) {
    background.loop = true;
    background.volume = 0.2;
    return background.play();
  }
  if (soundType === SoundType.Collision) {
    collision.loop = true;
    return collision.play();
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
    return takeoff.play();
  }
  if (soundType === SoundType.Chime) {
    return chime.play();
  }
  if (soundType === SoundType.Spawn) {
    // TODO Safari only plays squelch after other user-triggered sounds
    return squelch.play();
  }
  if (soundType === SoundType.Set) {
    return flick.play();
  }
  if (soundType === SoundType.Select) {
    return tock.play();
  }

  console.error('soundType not supported:', soundType);
};

/**
 * @param {SoundType} soundType
 */
export const stop = (soundType) => {
  if (soundType === SoundType.Background) {
    background.pause();
    background.currentTime = 0;
    return;
  }
  if (soundType === SoundType.Collision) {
    collision.pause();
    collision.currentTime = 0;
    return;
  }

  console.error('soundType not supported:', soundType);
};
