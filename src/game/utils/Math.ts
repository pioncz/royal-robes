import { Point } from './Types';

export const degreesToRadians = (degrees: number) =>
  (degrees * Math.PI) / 180;

/**
 * Adjusts the movement direction for isometric view
 * This transforms screen direction into world direction
 */
export const adjustDirectionForIsometric = (direction: number): number => {
  // Adjust by 45 degrees (π/4 radians) to align with isometric grid
  return direction - Math.PI / 4;
};

export const pointInDirection = (
  point: Point,
  direction: number,
  radius: number,
) => {
  // Apply isometric adjustment to the direction
  const isometricDirection = adjustDirectionForIsometric(direction);
  
  const x = point.x + Math.cos(isometricDirection) * radius;
  const z = point.z + Math.sin(isometricDirection) * radius;

  return { x, z };
};

export const angleBetweenPoints = (point1: Point, point2: Point) => {
  // Calculate the angle and then adjust it for isometric view
  const baseAngle = Math.atan2(point2.z - point1.z, point2.x - point1.x);
  return baseAngle;
};

export const distanceBetweenPoints = (
  point1: Point,
  point2: Point,
) => {
  const a = point2.x - point1.x;
  const b = point2.z - point1.z;

  return Math.sqrt(a * a + b * b);
};

export const getObjectsInRadius = <
  T extends { $: { position: Point } },
>(
  originPosition: Point,
  objects: T[],
  radius: number,
) =>
  objects.filter(
    (o: T) =>
      distanceBetweenPoints(originPosition, o.$.position) < radius,
  );
