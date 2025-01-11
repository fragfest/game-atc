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

export const getFinalLevel = () => 26;

export const getAirportByLevel = (gameLevel) => {
  if (gameLevel === 0) return Airport.LondonLHR;
  if (gameLevel >= 1 && gameLevel <= 6) return Airport.LondonLHR;
  if (gameLevel >= 7 && gameLevel <= 11) return Airport.NewYorkJFK;
  if (gameLevel >= 12 && gameLevel <= 16) return Airport.TokyoHND;
  if (gameLevel >= 17 && gameLevel <= 21) return Airport.AmsterdamAMS;
  if (gameLevel >= 22 && gameLevel <= 26) return Airport.VancouverYVR;

  throw new Error('unknown level: ' + gameLevel);
};

export const getCityByAirport = (airport) => {
  if (airport === Airport.LondonLHR) return 'london';
  if (airport === Airport.NewYorkJFK) return 'new york';
  if (airport === Airport.TokyoHND) return 'tokyo';
  if (airport === Airport.AmsterdamAMS) return 'amsterdam';
  if (airport === Airport.VancouverYVR) return 'vancouver';
  return '';
};
