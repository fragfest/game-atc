import { getTurbulenceLevels } from '../weather';
import { getHistoryRecords } from './score';

export const Badges = Object.freeze({
  BlueSky: 'BlueSky',
});

export const isAchievedBlueSky = () => {
  const isTurbulentLevel = (record) =>
    !!getTurbulenceLevels().find(
      (turbulentLevel) => turbulentLevel === record.level
    );
  const turbulentLevelsCompleted = getHistoryRecords().filter(isTurbulentLevel);
  const haveTurbulence = !!turbulentLevelsCompleted.find(
    (record) => record.historyScore.turbulence !== 0
  );
  if (!haveTurbulence && turbulentLevelsCompleted.length === 2) return true;
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
