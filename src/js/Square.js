const entityFns = require('./entity');

module.exports = class Square {
  constructor(layerObj, positionObj) {
    this.id = Math.random();
    this.ctx = layerObj.ctx;
    this.x = positionObj.x;
    this.y = positionObj.y;
    this.timestampPrevMs = 0;
    this.updateIntervalMs = 2000;
    this.speedPixelPerMs = 0.005;
    this.width = 10;
    this.height = 10;
  }

  update(timestamp) {
    const elapsedMs = timestamp - this.timestampPrevMs;
    if(elapsedMs > this.updateIntervalMs) {
      this.timestampPrevMs = timestamp;
      const pixels = (this.speedPixelPerMs * elapsedMs);

      this.ctx.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2)
      this.x += pixels;
      this.y += pixels;
      this.ctx.fillStyle = 'darkslategrey';
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  isCloseToEntity(entityManagerArr) {
    const entity = entityFns.create(this.id, this.x, this.y, this.width, this.height);
    const isEntityClose = entityFns.isCloseToEntity(this.ctx, entity);
    entityManagerArr.forEach(isEntityClose);
  }
}
