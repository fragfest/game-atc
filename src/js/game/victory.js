import { ScoreEvents, subscribeScore } from './score';

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
  Arrivals: 0,
  Failed: 1,
  // Departures: 10,
  // Arrivals: 8,
  // Failed: 3,
});

export const setup = () => {
  subscribeScore(ScoreEvents.ScoreEV, (score) => {
    if (score.failed >= Goals.Failed) {
      console.log('failed')
      return publishFailed();
    }

    if (
      score.departures >= Goals.Departures &&
      score.arrivals >= Goals.Arrivals
    ) {
      console.log('victory')
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