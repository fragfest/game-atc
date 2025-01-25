import { getTurbulenceLevels as getWeatherLevels } from '../weather';
import { getBadges, getHistoryRecords, setBadges } from './score';
import { isVictory } from '../victory';

export const Badges = Object.freeze({
  BlueSky: 'BlueSky',
});

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
  badges.push(Badges.BlueSky);
  setBadges(badges);
};

// PRIVATE ////////////////////////////////////////////////////////

const hasHistoryBadgeBlueSky = () => {
  const badges = getBadges() || [];
  return !!badges.find((badge) => badge === Badges.BlueSky);
};
