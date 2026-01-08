import { getAllTurbulenceLevels } from '../weather';
import { getBadges, getHistoryRecords, setBadges } from './score';
import { getIdleTimerLevels, isVictory } from '../victory';
import { getMaydayLevels } from './mayday';

export const BadgesTypes = Object.freeze({
  MayDay: 'MayDay',
  PushingTin: 'PushingTin',
  BlueSky: 'BlueSky',
});

export const Badges = Object.freeze({
  MayDay4: 'MayDay4',
  MayDay3: 'MayDay3',
  MayDay2: 'MayDay2',
  MayDay1: 'MayDay1',
  PushingTin5: 'PushingTin5',
  PushingTin4: 'PushingTin4',
  PushingTin3: 'PushingTin3',
  PushingTin2: 'PushingTin2',
  PushingTin1: 'PushingTin1',
  BlueSky4: 'BlueSky4',
  BlueSky3: 'BlueSky3',
  BlueSky2: 'BlueSky2',
  BlueSky1: 'BlueSky1',
});

/**
 *
 * @param {Badges} badge
 * @returns {BadgesTypes}
 */
export const getBadgesType = (badgeArg) => {
  const badge = Object.keys(Badges).find((x) => x === badgeArg);
  if (!badge) return null;

  if (Badges[badge] === Badges.MayDay4) return BadgesTypes.MayDay;
  if (Badges[badge] === Badges.MayDay3) return BadgesTypes.MayDay;
  if (Badges[badge] === Badges.MayDay2) return BadgesTypes.MayDay;
  if (Badges[badge] === Badges.MayDay1) return BadgesTypes.MayDay;

  if (Badges[badge] === Badges.PushingTin5) return BadgesTypes.PushingTin;
  if (Badges[badge] === Badges.PushingTin4) return BadgesTypes.PushingTin;
  if (Badges[badge] === Badges.PushingTin3) return BadgesTypes.PushingTin;
  if (Badges[badge] === Badges.PushingTin2) return BadgesTypes.PushingTin;
  if (Badges[badge] === Badges.PushingTin1) return BadgesTypes.PushingTin;

  if (Badges[badge] === Badges.BlueSky4) return BadgesTypes.BlueSky;
  if (Badges[badge] === Badges.BlueSky3) return BadgesTypes.BlueSky;
  if (Badges[badge] === Badges.BlueSky2) return BadgesTypes.BlueSky;
  if (Badges[badge] === Badges.BlueSky1) return BadgesTypes.BlueSky;
  return null;
};

/**
 * get badge level from Badges enum
 * @param {Badges} badge
 * @returns {Number} badge level
 */
export const getBadgeLevel = (badge) => {
  const badgeFound = Object.keys(Badges).find((x) => x === badge);
  if (!badgeFound) return null;

  if (Badges[badgeFound] === Badges.MayDay4) return 4;
  if (Badges[badgeFound] === Badges.MayDay3) return 3;
  if (Badges[badgeFound] === Badges.MayDay2) return 2;
  if (Badges[badgeFound] === Badges.MayDay1) return 1;

  if (Badges[badgeFound] === Badges.PushingTin5) return 5;
  if (Badges[badgeFound] === Badges.PushingTin4) return 4;
  if (Badges[badgeFound] === Badges.PushingTin3) return 3;
  if (Badges[badgeFound] === Badges.PushingTin2) return 2;
  if (Badges[badgeFound] === Badges.PushingTin1) return 1;

  if (Badges[badgeFound] === Badges.BlueSky4) return 4;
  if (Badges[badgeFound] === Badges.BlueSky3) return 3;
  if (Badges[badgeFound] === Badges.BlueSky2) return 2;
  if (Badges[badgeFound] === Badges.BlueSky1) return 1;
  return null;
};

export const BadgeTextDisp = Object.freeze({
  none: { title: '', desc: 'future achievement', goals: [] },
  mayday: {
    title: 'Mayday',
    desc: 'emergencies',
    goals: ['resolve maydays'],
  },
  pushingtin: {
    title: 'Pushing Tin',
    desc: 'minimal delays',
    goals: ['no delay penalties', 'minimum runway idle time'],
  },
  bluesky: {
    title: 'Blue Sky',
    desc: 'avoid turbulence',
    goals: ['no wake turbulence', 'no weather turbulence'],
  },
});

/**
 * @param {BadgesTypes} badgeType
 * @returns {Number} return highest badge level completed from badges & score histories
 */
export const getBadgeLevelCompleted = (badgeType) => {
  if (!badgeType) return console.error('badgeType missing');

  const levelComplete = getBadgeLevelAllHistories(badgeType);
  if (!levelComplete.score && !levelComplete.badge) return null;
  if (levelComplete.score > levelComplete.badge) {
    return levelComplete.score;
  }
  return levelComplete.badge;
};

/**
 * @param {BadgesTypes} badgeType
 * @returns {Boolean} true if score level completed greater than badge level completed
 */
export const isNewAchievement = (badgeType) => {
  if (!badgeType) return console.error('badgeType missing');

  const levelComplete = getBadgeLevelAllHistories(badgeType);
  if (!levelComplete.score && !levelComplete.badge) return false;
  if (levelComplete.score > levelComplete.badge) {
    return true;
  }
  return false;
};

export const setBadgeMayDay = (badgeLevel) => {
  if (!badgeLevel) return console.error('badgeLevel missing');

  if (badgeLevel <= getBadgeLevel(getHistoryBadge(BadgesTypes.MayDay))) {
    return;
  }

  const badges = getBadges();
  if (badgeLevel === 4) badges.push(Badges.MayDay4);
  if (badgeLevel === 3) badges.push(Badges.MayDay3);
  if (badgeLevel === 2) badges.push(Badges.MayDay2);
  if (badgeLevel === 1) badges.push(Badges.MayDay1);
  setBadges(badges);
};

export const setBadgePushingTin = (badgeLevel) => {
  if (!badgeLevel) return console.error('badgeLevel missing');

  if (badgeLevel <= getBadgeLevel(getHistoryBadge(BadgesTypes.PushingTin))) {
    return;
  }

  const badges = getBadges();
  if (badgeLevel === 5) badges.push(Badges.PushingTin5);
  if (badgeLevel === 4) badges.push(Badges.PushingTin4);
  if (badgeLevel === 3) badges.push(Badges.PushingTin3);
  if (badgeLevel === 2) badges.push(Badges.PushingTin2);
  if (badgeLevel === 1) badges.push(Badges.PushingTin1);
  setBadges(badges);
};

export const setBadgeBlueSky = (badgeLevel) => {
  if (!badgeLevel) return console.error('badgeLevel missing');

  if (badgeLevel <= getBadgeLevel(getHistoryBadge(BadgesTypes.BlueSky))) {
    return;
  }

  const badges = getBadges();
  if (badgeLevel === 4) badges.push(Badges.BlueSky4);
  if (badgeLevel === 3) badges.push(Badges.BlueSky3);
  if (badgeLevel === 2) badges.push(Badges.BlueSky2);
  if (badgeLevel === 1) badges.push(Badges.BlueSky1);
  setBadges(badges);
};

/**
 * @typedef ProgressbarDisp
 * @property {Number} height
 * @property {Number} y
 * @property {Number} cornerRadiusY
 * @property {String} colorGradient
 */

/**
 * display settings for the badge progressbar
 * @param {BadgesTypes} badgeType
 * @param {Number} badgeLevel
 * @returns {ProgressbarDisp}
 */
export const getProgressbarDisp = (badgeType, badgeLevel) => {
  let progressLevel = 0;

  if (badgeType === BadgesTypes.MayDay) {
    if (badgeLevel === 1) progressLevel = 1;
    if (badgeLevel === 2) progressLevel = 2;
    if (badgeLevel === 3) progressLevel = 4;
    if (badgeLevel === 4) progressLevel = 6;
  }

  if (badgeType === BadgesTypes.PushingTin) {
    if (badgeLevel === 1) progressLevel = 1;
    if (badgeLevel === 2) progressLevel = 2;
    if (badgeLevel === 3) progressLevel = 3;
    if (badgeLevel === 4) progressLevel = 4;
    if (badgeLevel === 5) progressLevel = 6;
  }

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

// PRIVATE ////////////////////////////////////////////////////////////////////////

/**
 * @param {BadgesTypes} badgeType
 * @returns {Object} return badge & score histories
 */
const getBadgeLevelAllHistories = (badgeType) => {
  if (!badgeType) return console.error('badgeType missing');

  const badgeCompleted = getHistoryBadge(badgeType);
  const badgeLevelCompleted = getBadgeLevel(badgeCompleted);
  const badgeLevelFromScore = getBadgeLevelFromScore(badgeType);

  return {
    badge: badgeLevelCompleted,
    score: badgeLevelFromScore,
  };
};

/**
 * @param {BadgesTypes} badgeType
 * @returns {Badges} return highest badge level already achieved
 */
const getHistoryBadge = (badgeType) => {
  const badges = getBadges() || [];
  // always return the highest badge for a BadgesTypes

  if (badgeType === BadgesTypes.MayDay) {
    if (badges.find((x) => x === Badges.MayDay4)) return Badges.MayDay4;
    if (badges.find((x) => x === Badges.MayDay3)) return Badges.MayDay3;
    if (badges.find((x) => x === Badges.MayDay2)) return Badges.MayDay2;
    if (badges.find((x) => x === Badges.MayDay1)) return Badges.MayDay1;
  }

  if (badgeType === BadgesTypes.PushingTin) {
    if (badges.find((x) => x === Badges.PushingTin5)) return Badges.PushingTin5;
    if (badges.find((x) => x === Badges.PushingTin4)) return Badges.PushingTin4;
    if (badges.find((x) => x === Badges.PushingTin3)) return Badges.PushingTin3;
    if (badges.find((x) => x === Badges.PushingTin2)) return Badges.PushingTin2;
    if (badges.find((x) => x === Badges.PushingTin1)) return Badges.PushingTin1;
  }

  if (badgeType === BadgesTypes.BlueSky) {
    if (badges.find((x) => x === Badges.BlueSky4)) return Badges.BlueSky4;
    if (badges.find((x) => x === Badges.BlueSky3)) return Badges.BlueSky3;
    if (badges.find((x) => x === Badges.BlueSky2)) return Badges.BlueSky2;
    if (badges.find((x) => x === Badges.BlueSky1)) return Badges.BlueSky1;
  }

  return null;
};

/**
 * @param {BadgesTypes} badgeType
 * @returns {Number} badge level based on score history
 */
const getBadgeLevelFromScore = (badgeType) => {
  let badgeLevelFromScore = 0;
  // always return the highest score for a BadgesTypes

  if (badgeType === BadgesTypes.MayDay) {
    const levelsArr = getMaydayLevels();
    const maydayLevelsPassed = levelsArr.filter(isAchievedMayday).length;

    if (maydayLevelsPassed >= 4) badgeLevelFromScore = 4;
    else if (maydayLevelsPassed >= 3) badgeLevelFromScore = 3;
    else if (maydayLevelsPassed >= 2) badgeLevelFromScore = 2;
    else if (maydayLevelsPassed >= 1) badgeLevelFromScore = 1;
  }

  if (badgeType === BadgesTypes.PushingTin) {
    const levelsArr = getIdleTimerLevels();
    const idleTimerLevelsPassed = levelsArr.filter(isAchievedPushingTin).length;

    if (idleTimerLevelsPassed >= 12) badgeLevelFromScore = 5;
    else if (idleTimerLevelsPassed >= 9) badgeLevelFromScore = 4;
    else if (idleTimerLevelsPassed >= 6) badgeLevelFromScore = 3;
    else if (idleTimerLevelsPassed >= 3) badgeLevelFromScore = 2;
    else if (idleTimerLevelsPassed >= 1) badgeLevelFromScore = 1;
  }

  if (badgeType === BadgesTypes.BlueSky) {
    const levelsArr = getAllTurbulenceLevels();
    const weatherLevelsPassed = levelsArr.filter(isAchievedBlueSky).length;

    if (weatherLevelsPassed >= 10) badgeLevelFromScore = 4;
    else if (weatherLevelsPassed >= 6) badgeLevelFromScore = 3;
    else if (weatherLevelsPassed >= 3) badgeLevelFromScore = 2;
    else if (weatherLevelsPassed >= 1) badgeLevelFromScore = 1;
  }

  return badgeLevelFromScore;
};

const isAchievedMayday = (gameLevel) => {
  const record = getHistoryRecords().find((x) => x.level === gameLevel);
  if (!record) return false;

  const isPass = (record) => isVictory(record?.historyScore);
  const hasMaydayNonZero = (record) => record?.historyScore?.mayday >= 1;

  return isPass(record) && hasMaydayNonZero(record);
};

/**
 * @param {Number} gameLevel
 * @returns {Boolean}
 */
const isAchievedPushingTin = (gameLevel) => {
  const record = getHistoryRecords().find((x) => x.level === gameLevel);
  if (!record) return false;

  const isPass = (record) => isVictory(record?.historyScore);
  const hasIdleZero = (record) => record?.historyScore?.idle === 0;
  const hasDelaysZero = (record) => record?.historyScore?.delayed === 0;

  return isPass(record) && hasIdleZero(record) && hasDelaysZero(record);
};

/**
 * @param {Number} gameLevel
 * @returns {Boolean}
 */
const isAchievedBlueSky = (gameLevel) => {
  const record = getHistoryRecords().find((x) => x.level === gameLevel);
  if (!record) return false;

  const isPass = (record) => isVictory(record?.historyScore);
  const hasZeroProp = (prop) => (record) => !record?.historyScore?.[prop];
  const hasTurbulenceZero = hasZeroProp('turbulence');
  const hasWakeZero = hasZeroProp('wake');

  return isPass(record) && hasTurbulenceZero(record) && hasWakeZero(record);
};
