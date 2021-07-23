export const convertToPosRad = rad => (rad >= 0) ? rad : (2 * Math.PI + rad); 
export const convertToSmallRad = rad => (rad < 2 * Math.PI) ? rad : (rad - 2 * Math.PI);
export const convertToSmallDegrees = degrees => (degrees <= 360) ? degrees : (degrees - 360);

// zero degrees is east on the Canvas
export const radToDegrees = rad => (Number(rad) * 180 / Math.PI) + 90;
export const degreesToRad = degrees => (Number(degrees) - 90) * Math.PI / 180;
export const inputHeadingToRad = heading => convertToPosRad(degreesToRad(heading));

