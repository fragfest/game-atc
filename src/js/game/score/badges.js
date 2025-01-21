import { getTurbulenceLevels as getWeatherLevels } from '../weather';
import { getHistoryRecords } from './score';
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

  const badges = JSON.parse(localStorage.getItem('badges')) || [];
  badges.push(Badges.BlueSky);
  localStorage.setItem('badges', JSON.stringify(badges));
};

// PRIVATE ////////////////////////////////////////////////////////

const hasHistoryBadgeBlueSky = () => {
  const badges = JSON.parse(localStorage.getItem('badges')) || [];
  return !!badges.find((badge) => badge === Badges.BlueSky);
};
