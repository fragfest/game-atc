import { ScoreEvents, subscribeScore } from './score';

/**
 * @typedef {import('./score.js').Score} Score
 */

// NOTE: key & values must match
export const VictoryEvents = Object.freeze({
  Success: 'Success',
  Failed: 'Failed',
});

/**
 * @param {VictoryEvents} victoryEvent
 * @param {scoreCB} cb
 */
export const subscribeVictory = (victoryEvent, cb) => {
  if (!VictoryEvents[victoryEvent]) throw new Error('unknown victory event: ' + victoryEvent);
  document.addEventListener(victoryEvent, () => cb());
};

/**
 * @typedef {object} Goals
 * @property {number} Departures
 * @property {number} Arrivals
 * @property {number} Failed
 */
export const Goals = Object.freeze({
  Departures: 1,
  Arrivals: 1,
  Failed: 1,
});

export const isDeparturesSuccess = (departuresCount) => departuresCount >= Goals.Departures;
export const isArrivalsSuccess = (arrivalsCount) => arrivalsCount >= Goals.Arrivals;
export const isFailedCondition = (failedCount) => failedCount >= Goals.Failed;
/**
 * @param {Score} score 
 * @returns {Boolean}
 */
export const isVictory = score => isDeparturesSuccess(score.departures) &&
  isArrivalsSuccess(score.arrivals);

export const setup = () => {
  subscribeScore(ScoreEvents.ScoreEV, (score) => {
    if (isFailedCondition(score.failed)) {
      return publishFailed();
    }
    if (isVictory(score)) {
      return publishSuccess();
    }
  });
}

// PRIVATE //////////////////////////////////////////////////

const publishSuccess = () => {
  document.dispatchEvent(new CustomEvent(VictoryEvents.Success));
}

const publishFailed = () => {
  document.dispatchEvent(new CustomEvent(VictoryEvents.Failed));
}