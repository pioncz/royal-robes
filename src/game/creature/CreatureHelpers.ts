export const mapMoveDirectionToTextureScale = (radians: number) =>
  Math.abs(radians) <= 1.58 || Math.abs(radians) >= 5.497 ? 1 : -1;

export const mapMoveDirectionToTextureOrientation = (
  radians: number,
) =>
  Math.abs(radians) <= 1.58 || Math.abs(radians) >= 5.497
    ? 'left'
    : 'right';

export const getMoveStepForSpeed = (speed: number) => 0.001 * speed;
