import { getTurbulenceLevels as getWeatherLevels } from '../weather';
import { getBadges, getHistoryRecords, setBadges } from './score';
import { isVictory } from '../victory';

export const Badges = Object.freeze({
  BlueSky1: 'BlueSky1',
});

/**
 * @typedef ProgressbarDisp
 * @property {Number} height
 * @property {Number} y
 * @property {Number} cornerRadiusY
 * @property {String} colorGradient
 */

/**
 * display settings for the badge progressbar
 * @param {Number} badgeLevel
 * @returns {ProgressbarDisp}
 */
export const getProgressbarDisp = (badgeLevel) => {
  switch (badgeLevel) {
    case 1:
      return {
        height: 16.094793,
        y: 142.14111,
        cornerRadiusY: 0.8,
        colorGradient: 'matrix(0.86182329,0,0,0.52921473,-25.179715,74.188352)',
      };
    case 2:
      return {
        height: 31.75,
        y: 126.26604,
        cornerRadiusY: 0.8,
        colorGradient: 'matrix(0.86182329,0,0,0.30684513,-25.184109,109.34432)',
      };
    case 3:
      return {
        height: 47.625,
        y: 110.39104,
        cornerRadiusY: 0.8,
        colorGradient: 'matrix(0.86182329,0,0,0.4602677,-25.184109,85.008467)',
      };
    case 4:
      return {
        height: 63.5,
        y: 94.516045,
        cornerRadiusY: 0.8,
        colorGradient: 'matrix(0.86182329,0,0,0.61369025,-25.184109,60.672618)',
      };
    case 5:
      return {
        height: 79.375,
        y: 78.641045,
        cornerRadiusY: 0.8,
        colorGradient: 'matrix(0.86182329,0,0,0.76711281,-25.184109,36.336764)',
      };
    case 6:
      return {
        height: 101.86458,
        y: 56.151463,
        cornerRadiusY: 0.8,
        colorGradient: 'matrix(0.86182329,0,0,0.98446164,-25.184109,1.8609655)',
      };
    default:
      return {
        height: 0,
        y: 0,
        cornerRadiusY: 0.8,
        colorGradient: 'matrix(0.86182329,0,0,0.98446164,-25.184109,1.8609655)',
      };
  }
};

export const getBadgeLevelBlueSky = () => {
  const badges = getBadges();
  if (badges.find((x) => x === Badges.BlueSky1)) return 1;
  return null;
};

export const isAchievedBlueSky = () => {
  if (hasHistoryBadgeBlueSky()) return true;

  const isTurbulentLevel = (record) =>
    !!getWeatherLevels().find((level) => level === record.level);
  const isPass = (record) => isVictory(record.historyScore);
  const hasNonZeroProp = (prop) => (record) => !!record?.historyScore?.[prop];

  const weatherLevelsCompleted = getHistoryRecords()
    .filter(isTurbulentLevel)
    .filter(isPass);
  const noWeatherTurbulence = !weatherLevelsCompleted.find(
    hasNonZeroProp('turbulence')
  );
  const noWakeTurbulence = !getHistoryRecords().find(hasNonZeroProp('wake'));

  if (
    noWakeTurbulence &&
    noWeatherTurbulence &&
    weatherLevelsCompleted.length === 2
  ) {
    return true;
  }

  return false;
};

export const isNewAchievementBlueSky = () => {
  const isBlueSky = isAchievedBlueSky();
  const hasPreviousBadge = hasHistoryBadgeBlueSky();
  return isBlueSky && !hasPreviousBadge;
};

export const setBadgeBlueSky = () => {
  if (hasHistoryBadgeBlueSky()) return;

  const badges = getBadges();
  badges.push(Badges.BlueSky1);
  setBadges(badges);
};

// PRIVATE ////////////////////////////////////////////////////////

const hasHistoryBadgeBlueSky = () => {
  const badges = getBadges() || [];
  return !!badges.find((badge) => badge === Badges.BlueSky1);
};
