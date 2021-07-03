export const create = (id, x, y, width, height) => ({ id, x, y, width, height });

export const isCloseToEntity = (ctx, entity) => entityOther => {
  if (entityOther.id === entity.id) {
    return;
  }

  const distX = Math.abs(entity.x - entityOther.x);
  const distY = Math.abs(entity.y - entityOther.y);
  if (distX < 51 && distY < 51) {
    ctx.clearRect(entity.x - 1, entity.y - 1, entity.width + 2, entity.height + 2)
    ctx.fillStyle = 'red';
    ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
  }
};