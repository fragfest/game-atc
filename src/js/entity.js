const hasEntityState = state => {
  return 'id' in state
    && 'x' in state
    && 'y' in state
    && 'altitude' in state;
};

export const hasEntityUpdate = (entity) => {
  return typeof entity.update === 'function'
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