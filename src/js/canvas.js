const drawSquare = (canvasObj, positionObj) => {
  const { ctx, width, height } = canvasObj;
  const { x, y } = positionObj;
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = 'darkslategrey';
  ctx.fillRect(x, y, 10, 10);
}

const update = (deltaTime, positionObj) => {
  const delta = deltaTime ? (0.01 * deltaTime) : 0;
  return { x: positionObj.x += delta, y: positionObj.y += delta};
}

export default {
  drawSquare,
  update,
}