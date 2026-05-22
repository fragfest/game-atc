import { ScreenSizes } from '../utils';

export const draw = (layerObj, screenSize, width, height) => {
  const isSmall =
    screenSize === ScreenSizes.Small || screenSize === ScreenSizes.VerySmall;
  const isVerySmall = ScreenSizes.VerySmall;

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
  let lineWidth = 1.2;
  let font = '11px Arial';
  if (isSmall) {
    lineWidth = 0.8;
    font = '11px Arial';
  }
  if (isVerySmall) {
    lineWidth = 0.8;
    font = '10px Arial';
  }
  layerObj.ctx.lineWidth = lineWidth;

  layerObj.ctx.moveTo(startX, startY - markerLength / 2);
  layerObj.ctx.lineTo(startX, startY + markerLength / 2);
  layerObj.ctx.moveTo(startX + length, startY - markerLength / 2);
  layerObj.ctx.lineTo(startX + length, startY + markerLength / 2);

  layerObj.ctx.fillStyle = 'greenyellow';
  layerObj.ctx.font = font;
  layerObj.ctx.fillText(
    '3 miles',
    startX + labelOffset,
    startY - markerLength / 2 - 3
  );
  layerObj.ctx.stroke();
};
