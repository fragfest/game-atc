import { ScreenSizes } from "./utils";

const hasEntityState = state => {
  return 'id' in state
    && 'x' in state
    && 'y' in state
    && 'altitude' in state;
};

export const hasEntityFuncs = entity => {
  return (
    typeof entity.update === 'function' &&
    typeof entity.draw === 'function'
  );
};

export const distBetweenEntities = entityOne => entityTwo => {
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
  const dist = distBetweenEntities(entityDestination)(entity);
  return dist < distPrev;
};

export const isCloseToWaypoint = waypoint => entity => {
  if (!hasEntityState(waypoint) || !hasEntityState(entity)) {
    console.error('entity is missing required state props');
    return false;
  }
  if (waypoint.id === entity.id) return false;

  const isCloseHorizontal = distBetweenEntities(waypoint)(entity) < 10;
  const distVert = entity.altitude - waypoint.altitude;
  const isAboveWaypoint = distVert >= 0;

  if (isCloseHorizontal && isAboveWaypoint) return true;
  return false;
};

export const getTooCloseDistance = screenSize => {
  if (screenSize === ScreenSizes.Large) return 51;
  if (screenSize === ScreenSizes.Small) return 37;
};

export const isCloseToEntity = screenSize => entity => entityOther => {
  if (!hasEntityState(entity) || !hasEntityState(entityOther)) {
    console.error('entity is missing required state props');
    return false;
  }
  if (entityOther.id === entity.id) return false;
  
  const distMax = getTooCloseDistance(screenSize);
  const isCloseHorizontal = distBetweenEntities(entity)(entityOther) < distMax;

  const distVert = Math.abs(entity.altitude - entityOther.altitude);
  const isCloseVertical = distVert < 1000;
  if (isCloseHorizontal && isCloseVertical) return true;
  return false;
};