import { ScreenSizes } from '../utils';

export const draw = (layerObj, screenSize, width, height) => {
  const isSmall = screenSize === ScreenSizes.Small;

  // draw lateral 3 mile traffic conflict scale
  const length = isSmall ? 35 : 50;
  const markerLength = isSmall ? 8 : 10;
  const labelOffset = isSmall ? 0 : 9;
  const offsetX = isSmall ? 70 : 100;
  const offsetY = isSmall ? 20 : 30;
  const startX = width - offsetX;
  const startY = height - offsetY;
  layerObj.ctx.strokeStyle = 'greenyellow';
  layerObj.ctx.beginPath();
  // horizontal line
  layerObj.ctx.moveTo(startX, startY);
  layerObj.ctx.lineTo(startX + length, startY);
  // vertical lines
  layerObj.ctx.lineWidth = isSmall ? 0.8 : 1.2;
  layerObj.ctx.moveTo(startX, startY - markerLength / 2);
  layerObj.ctx.lineTo(startX, startY + markerLength / 2);
  layerObj.ctx.moveTo(startX + length, startY - markerLength / 2);
  layerObj.ctx.lineTo(startX + length, startY + markerLength / 2);
  // label
  layerObj.ctx.fillStyle = 'greenyellow';
  layerObj.ctx.font = '11px Arial';
  layerObj.ctx.fillText('3 miles', startX + labelOffset, startY - markerLength / 2 - 3);
  layerObj.ctx.stroke();
}