const hasEntityState = state => {
  return 'id' in state
    && 'x' in state
    && 'y' in state
    && 'width' in state
    && 'height' in state
    && 'altitude' in state;
}

export const isEntity = (entity) => {
  return hasEntityState(entity) &&
    typeof entity.update === 'function'
}

export const create = args => {
  if(hasEntityState(args)) return args;
  throw new Error('entity.create failed from args: \n' + JSON.stringify(args));
}

export const isCloseToEntity = (entity) => (entityOther) => {
  if(entityOther.id === entity.id) return false;
  
  const distX = Math.abs(entity.x - entityOther.x);
  const distY = Math.abs(entity.y - entityOther.y);
  const isCloseHorizontal = (distX < 51 && distY < 51);

  const distVert = Math.abs(entity.altitude - entityOther.altitude);
  const isCloseVertical = distVert < 1000;
  if (isCloseHorizontal && isCloseVertical) return true;
  return false;
};