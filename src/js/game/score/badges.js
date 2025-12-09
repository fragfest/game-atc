import { getAllTurbulenceLevels } from '../weather';
import { getBadges, getHistoryRecords, setBadges } from './score';
import { isVictory } from '../victory';

export const BadgesTypes = Object.freeze({
  BlueSky: 'BlueSky',
});

export const Badges = Object.freeze({
  BlueSky1: 'BlueSky1',
  BlueSky2: 'BlueSky2',
  BlueSky3: 'BlueSky3',
  BlueSky4: 'BlueSky4',
});

export const BadgeTextDisp = Object.freeze({
  none: { title: '', desc: 'future achievement', goals: [] },
  bluesky: {
    title: 'Blue Sky',
    desc: 'avoid all turbulence',
    goals: ['no wake turbulence', 'no weather turbulence'],
  },
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

  if (Badges[badgeFound] === Badges.BlueSky4) return 4;
  if (Badges[badgeFound] === Badges.BlueSky3) return 3;
  if (Badges[badgeFound] === Badges.BlueSky2) return 2;
  if (Badges[badgeFound] === Badges.BlueSky1) return 1;
  return null;
};

/**
 * @returns {Number} return highest badge level completed from badges & score histories
 */
export const getBadgeLevelCompletedBlueSky = () => {
  const badgeCompleted = getHistoryBadgeBlueSky();

  const weatherLevels = getAllTurbulenceLevels();
  const weatherLevelsCompleted = weatherLevels.filter(isAchievedBlueSky).length;
  const badgeLevelCompleted = getBadgeLevelBlueSky(badgeCompleted);

  let badgeLevelFromScore = 0;
  if (weatherLevelsCompleted >= 10) badgeLevelFromScore = 4;
  else if (weatherLevelsCompleted >= 7) badgeLevelFromScore = 3;
  else if (weatherLevelsCompleted >= 4) badgeLevelFromScore = 2;
  else if (weatherLevelsCompleted >= 1) badgeLevelFromScore = 1;

  if (!badgeLevelFromScore && !badgeLevelCompleted) return null;
  if (badgeLevelFromScore > badgeLevelCompleted) {
    return badgeLevelFromScore;
  }
  return badgeLevelCompleted;
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
  if (badgeLevel === 4) badges.push(Badges.BlueSky4);
  if (badgeLevel === 3) badges.push(Badges.BlueSky3);
  if (badgeLevel === 2) badges.push(Badges.BlueSky2);
  if (badgeLevel === 1) badges.push(Badges.BlueSky1);
  setBadges(badges);
};

/**
 * display settings for the badge progressbar
 * @param {BadgesTypes} badgeType
 * @param {Number} badgeLevel
 * @returns {ProgressbarDisp}
 */
export const getProgressbarDisp = (badgeType, badgeLevel) => {
  let progressLevel = 0;
  if (badgeType === BadgesTypes.BlueSky) {
    if (badgeLevel === 1) progressLevel = 1;
    if (badgeLevel === 2) progressLevel = 2;
    if (badgeLevel === 3) progressLevel = 4;
    if (badgeLevel === 4) progressLevel = 6;
  }

  switch (progressLevel) {
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

  if (badges.find((badge) => badge === Badges.BlueSky4)) return Badges.BlueSky4;
  if (badges.find((badge) => badge === Badges.BlueSky3)) return Badges.BlueSky3;
  if (badges.find((badge) => badge === Badges.BlueSky2)) return Badges.BlueSky2;
  if (badges.find((badge) => badge === Badges.BlueSky1)) return Badges.BlueSky1;
  return null;
};

const isAchievedBlueSky = (gameLevel) => {
  const record = getHistoryRecords().find((x) => x.level === gameLevel);
  if (!record) return false;

  const isPass = (record) => isVictory(record?.historyScore);
  const hasZeroProp = (prop) => (record) => !record?.historyScore?.[prop];
  const hasTurbulenceZero = hasZeroProp('turbulence');
  const hasWakeZero = hasZeroProp('wake');

  return isPass(record) && hasTurbulenceZero(record) && hasWakeZero(record);
};
