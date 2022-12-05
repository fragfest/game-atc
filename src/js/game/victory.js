import { ScoreEvents, subscribeScore, ScoreGoals } from './score';
import { setGameLoopState } from './game';

export const setup = (router) => {
  subscribeScore(ScoreEvents.ScoreEV, (score) => {
    if (score.departures >= ScoreGoals.Departures) {
      console.log('victory conditions met')
      // TODO publish events and save progress
    }
    if (score.failed >= 1) {
      // router.push('/victory');
      setGameLoopState(false);
    }
  });
}