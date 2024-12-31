import { Airport } from '../airports/airports.js';
import { getScore } from '../game/score/score.js';
import { getGoalsByLevel } from '../game/victory.js';
import { getWeatherLevelByGameLevel } from '../game/weather.js';
import { getIntro } from './levelIntro.js';
import { getSpawnByGameLevel } from './levels.js';

/**
 * @typedef {import('../game/weather.js').WeatherFunc} WeatherFunc
 * @typedef {import('./levels.js').LevelFunc} LevelFunc
 * @typedef {import('./levelIntro.js').IntroFunc} IntroFunc
 * @typedef {import('../game/victory.js').GoalsFunc} GoalsFunc
 */

/**
 * @typedef {Object} LevelObj
 * @property {WeatherFunc} weatherFn
 * @property {LevelFunc} levelFn
 * @property {IntroFunc} introFn
 * @property {GoalsFunc} goalFn
 */

/**
 * @returns {LevelObj}
 */
export const getLevelObj = () => {
  const level = getScore().level;
  const weatherFn = getWeatherLevelByGameLevel(level);
  const levelFn = getSpawnByGameLevel(level);
  const introFn = getIntro(level);
  const goalFn = getGoalsByLevel();
  return {
    weatherFn,
    levelFn,
    introFn,
    goalFn,
  };
};

export const getFinalLevel = () => 9;

export const getAirportByLevel = (gameLevel) => {
  if (gameLevel === 0) return Airport.Heathrow;
  if (gameLevel >= 1 && gameLevel <= 6) return Airport.Heathrow;
  if (gameLevel === 7) return Airport.NewYorkJFK;
  if (gameLevel === 8) return Airport.TokyoHND;
  if (gameLevel === 9) return Airport.Amsterdam;

  throw new Error('unknown level: ' + gameLevel);
};
