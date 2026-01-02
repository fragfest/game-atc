import { isAircraft } from './types';
import { ScreenSizes, isWithinDist } from './utils';

// entity type ////////////////////////////////////////////////
const hasEntityState = (state) => {
  return 'id' in state && 'x' in state && 'y' in state && 'altitude' in state;
};

export const hasEntityFuncs = (entity) => {
  return (
    typeof entity.update === 'function' &&
    typeof entity.draw === 'function' &&
    typeof entity.updateDestroy === 'function'
  );
};
// END entity type ////////////////////////////////////////////////

export const getHeadingToEntity = (entitySrc) => (entityDest) => {
  const deltaX = entityDest.x - entitySrc.x;
  const deltaY = entityDest.y - entitySrc.y;
  let hdgToDest = Math.atan(deltaY / deltaX);
  if (deltaX < 0) {
    hdgToDest = Math.PI + hdgToDest;
  }
  return hdgToDest;
};

export const distBetweenEntities = (entityOne) => (entityTwo) => {
  const x = entityOne.x - entityTwo.x;
  const y = entityOne.y - entityTwo.y;
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};

/**
 * @param {Object} entityDestination
 * @param {Object} entity
 * @param {Number} distPrev
 * @returns {Boolean}
 */
export const isEntityGettingCloser = (entityDestination, entity, distPrev) => {
  if (entityDestination.id === entity.id) return false;
  return isWithinDist(distPrev, entityDestination, entity);
};

export const isCloseToPlane = (screenSize) => (plane) => (otherObj) => {
  if (!isAircraft(otherObj)) return false;
  return isWithinDist(2.5 * getTooCloseDistance(screenSize), plane, otherObj);
};

export const isCloseToWaypoint = (waypoint) => (entity) => {
  if (!hasEntityState(waypoint) || !hasEntityState(entity)) {
    console.error('entity is missing required state props');
    return false;
  }
  if (waypoint.id === entity.id) return false;

  const isCloseHorizontal = isWithinDist(10, waypoint, entity);
  const distVert = entity.altitude - waypoint.altitude;
  const isAboveWaypoint = distVert >= 0;

  if (isCloseHorizontal && isAboveWaypoint) return true;
  return false;
};

export const getTooCloseDistance = (screenSize) => {
  if (screenSize === ScreenSizes.Large) return 51;
  if (screenSize === ScreenSizes.Small) return 37;
};

export const isCloseToEntity = (screenSize) => (entity) => (entityOther) => {
  if (!hasEntityState(entity) || !hasEntityState(entityOther)) {
    console.error('entity is missing required state props');
    return false;
  }
  if (entityOther.id === entity.id) return false;

  const distMax = getTooCloseDistance(screenSize);
  const isCloseHorizontal = isWithinDist(distMax, entity, entityOther);

  const distVert = Math.abs(entity.altitude - entityOther.altitude);
  const isCloseVertical = distVert < 1000;
  if (isCloseHorizontal && isCloseVertical) return true;
  return false;
};
