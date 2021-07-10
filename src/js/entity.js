const hasEntityState = state => {
  return 'id' in state
    && 'x' in state
    && 'y' in state
    && 'width' in state
    && 'height' in state;
}

export const isEntity = (entity) => {
  return hasEntityState(entity) &&
    typeof entity.update === 'function' &&
    typeof entity.setProximity === 'function';
}

export const create = args => {
  if(hasEntityState(args)) return args;
  throw new Error('entity.create failed from args: \n' + JSON.stringify(args));
}

export const isCloseToEntity = (entity) => (entityOther) => {
  if(entityOther.id === entity.id) return false;
  
  const distX = Math.abs(entity.x - entityOther.x);
  const distY = Math.abs(entity.y - entityOther.y);
  if (distX < 51 && distY < 51) return true;
  return false;
};