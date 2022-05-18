// NOTE: key & values must match
export const ScoreEvents = Object.freeze({
  ScoreEV: 'ScoreEV',
});

/**
 * @typedef {Object} Score
 * @property {number} scoreTotal
 */
export const Score = Object.freeze({
  scoreTotal: 0,
});

// TODO save score to session and load in setup or start new game
let isSetup = false;
export const setup = () => {
  if (isSetup) return;
  isSetup = true;

  _scoreTotal = 0;
};

/**
 * @callback scoreCB
 * @param {Score}
 */

/**
 * @param {ScoreEvents} scoreEvent
 * @param {scoreCB} cb
 */
export const subscribe = (scoreEvent, cb) => {
  if (!ScoreEvents[scoreEvent]) throw new Error('unknown score event: ' + scoreEvent);
  document.addEventListener(scoreEvent, (ev) => {
    cb(ev.detail.score);
  });
};

export const planeLandSuccess = () => {
  _scoreTotal += 10;
  const score = { ...Score, scoreTotal: _scoreTotal };
  publishScore(score);
  return 10;
};

export const planeLeaveFail = () => {
  _scoreTotal -= 10;
  const score = { ...Score, scoreTotal: _scoreTotal };
  publishScore(score);
  return -10;
};

// PRIVATE //////////////////////////////////////////////////
let _scoreTotal = 0;

/**
 * @param {Score} score
 */
const publishScore = (score) => {
  const scoreEvent = ScoreEvents.ScoreEV; // TODO might be needed when specified in a future func arg
  if (!ScoreEvents[scoreEvent]) throw new Error('unknown score event: ' + scoreEvent);
  document.dispatchEvent(new CustomEvent(scoreEvent, { detail: { score } }));
};