import { Point } from './Types';

export const degreesToRadians = (degrees: number) =>
  (degrees * Math.PI) / 180;

export const pointInDirection = (
  point: Point,
  direction: number,
  radius: number,
) => {
  const x = point.x + Math.cos(direction) * radius;
  const z = point.z + Math.sin(direction) * radius;

  return { x, z };
};

export const angleBetweenPoints = (point1: Point, point2: Point) =>
  Math.atan2(point2.z - point1.z, point2.x - point1.x);

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
