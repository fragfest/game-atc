import { getTurbulenceLevels as getWeatherLevels } from '../weather';
import { getBadges, getHistoryRecords, setBadges } from './score';
import { isVictory } from '../victory';

export const Badges = Object.freeze({
  BlueSky1: 'BlueSky1',
  BlueSky2: 'BlueSky2',
});

/**
 * @typedef ProgressbarDisp
 * @property {Number} height
 * @property {Number} y
 * @property {Number} cornerRadiusY
 * @property {String} colorGradient
 */

/**
 * get BlueSky badge level from Badges enum
 * @param {Badges} badge
 * @returns {Number} badge level
 */
export const getBadgeLevelBlueSky = (badge) => {
  const badgeFound = Object.keys(Badges).find((x) => x === badge);
  if (!badgeFound) return null;

  if (Badges[badgeFound] === Badges.BlueSky2) return 2;
  if (Badges[badgeFound] === Badges.BlueSky1) return 1;
  return null;
};

/**
 * @returns {Number} return highest badge level or null if badge not achieved
 */
export const getBadgeLevelCompletedBlueSky = () => {
  const badgeCompleted = getHistoryBadgeBlueSky();
  if (badgeCompleted === Badges.BlueSky2) return 2;
  if (badgeCompleted === Badges.BlueSky1) return 1;

  const levelsBadge2 = getWeatherLevels(2);
  const levelsBadge1 = getWeatherLevels(1);

  // return highest badge level
  if (levelsBadge2.filter(isAchievedBlueSky).length === levelsBadge2.length) {
    return 2;
  }
  if (levelsBadge1.filter(isAchievedBlueSky).length === levelsBadge1.length) {
    return 1;
  }

  return null;
};

export const isNewAchievementBlueSky = () => {
  const isBlueSky = !!getBadgeLevelCompletedBlueSky();
  const hasPreviousBadge = getHistoryBadgeBlueSky();
  return isBlueSky && !hasPreviousBadge;
};

export const setBadgeBlueSky = (badgeLevel) => {
  if (!badgeLevel) {
    console.error('badgeLevel missing');
    return;
  }
  if (badgeLevel <= getBadgeLevelBlueSky(getHistoryBadgeBlueSky())) return;

  const badges = getBadges();
  if (badgeLevel === 2) badges.push(Badges.BlueSky2);
  if (badgeLevel === 1) badges.push(Badges.BlueSky1);
  setBadges(badges);
};

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

// PRIVATE ////////////////////////////////////////////////////////

/**
 * @returns {Badges} return highest badge level already achieved
 */
const getHistoryBadgeBlueSky = () => {
  const badges = getBadges() || [];

  // return highest level in descending order
  if (badges.find((badge) => badge === Badges.BlueSky2)) return Badges.BlueSky2;
  if (badges.find((badge) => badge === Badges.BlueSky1)) return Badges.BlueSky1;
  return null;
};

const isAchievedBlueSky = (gameLevel) => {
  const record = getHistoryRecords().find((x) => x.level === gameLevel);

  const isPass = (record) => isVictory(record.historyScore);
  const hasZeroProp = (prop) => (record) => !record?.historyScore?.[prop];
  const hasTurbulenceZero = hasZeroProp('turbulence');
  const hasWakeZero = hasZeroProp('wake');

  return (
    record && isPass(record) && hasTurbulenceZero(record) && hasWakeZero(record)
  );
};
