import { ScoreEvents, subscribeScore, ScoreGoals } from './score';

export const setup = () => {
  subscribeScore(ScoreEvents.ScoreEV, (score) => {
    if (score.departures >= ScoreGoals.Departures) {
      console.log('victory condition met')
      // TODO publish events and save progress
    }
  });
}