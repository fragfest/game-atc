const hasEntityState = state => {
  return 'id' in state
    && 'x' in state
    && 'y' in state
    && 'altitude' in state;
};

export const hasEntityUpdate = entity => {
  return (
    typeof entity.update === 'function' &&
    typeof entity.updateDestroy === 'function' &&
    typeof entity.draw === 'function'
  );
};

export const distBetweenEntities = entityOne => entityTwo => {
  const x = entityOne.x - entityTwo.x;
  const y = entityOne.y - entityTwo.y;
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};
export const isEntityGettingCloser = entityDestination => entity => {
  if (!Object.hasOwn(entity, 'distPrev')) return false;
  if (entityDestination.id === entity.id) return false;

  const dist = distBetweenEntities(entityDestination)(entity);
  return dist < entity.distPrev;
};

export const isCloseToWaypoint = waypoint => entity => {
  if (!hasEntityState(waypoint) || !hasEntityState(entity)) {
    console.error('entity is missing required state props');
    return false;
  }
  if (waypoint.id === entity.id) return false;

  const distX = Math.abs(waypoint.x - entity.x);
  const distY = Math.abs(waypoint.y - entity.y);
  const isCloseHorizontal = distX < 10 && distY < 10;

  const distVert = entity.altitude - waypoint.altitude;
  const isAboveWaypoint = distVert >= 0;

  if (isCloseHorizontal && isAboveWaypoint) return true;
  return false;
};

export const isCloseToEntity = entity => entityOther => {
  if (!hasEntityState(entity) || !hasEntityState(entityOther)) {
    console.error('entity is missing required state props');
    return false;
  }
  if (entityOther.id === entity.id) return false;

  const distX = Math.abs(entity.x - entityOther.x);
  const distY = Math.abs(entity.y - entityOther.y);
  const isCloseHorizontal = (distX < 51 && distY < 51);

  const distVert = Math.abs(entity.altitude - entityOther.altitude);
  const isCloseVertical = distVert < 1000;
  if (isCloseHorizontal && isCloseVertical) return true;
  return false;
};