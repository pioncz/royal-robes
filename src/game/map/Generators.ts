import { MapSize, MapCell } from 'game/utils/Types';

const rand = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const makeArray = (
  length: number, // @ts-ignore
) => Array.from({ length }, (v, i) => i);

type MapFragment = {
  size: MapSize;
  offset?: MapSize;
  ids: string[];
  r?: number;
  fillFunction?: (
    ids: string[],
    x: number,
    z?: number,
    size?: MapSize,
    offset?: MapSize,
  ) => { id: string | null };
};

const generateMapFragment = ({
  size,
  offset,
  ids,
  r,
  fillFunction,
}: MapFragment): MapCell[] => {
  const arraySizeX = makeArray(size.x);
  const mappedToCells = arraySizeX.map((z) => {
    const fillFunctionValue = fillFunction
      ? fillFunction(ids, size.x, z, size, offset)
      : null;
    const id = fillFunction
      ? fillFunctionValue?.id
      : ids[Math.floor(rand(0, ids.length))];

    return {
      x: size.x + (offset?.x || 0),
      y: size.y || 0,
      z: z + (offset?.z || 0),
      id,
      ...(r ? { r } : {}),
    };
  });
  // @ts-ignore
  return mappedToCells.flat().filter((mapPos) => !!mapPos.id);
};

export const generateMapFromFragments = (
  fragments: MapFragment[],
): MapCell[] => {
  return [
    ...fragments.map((fragment) => generateMapFragment(fragment)),
  ].flat();
};

export const generateColumn = (
  x: number,
  z: number,
  id: string,
  width: number,
) => {
  const pos = [];
  const width2 = width / 2;
  pos.push({
    x,
    y: 0,
    z,
    id,
  });
  pos.push({
    x: x + width2,
    y: 0,
    z: z - width2,
    r: 90,
    id,
  });
  pos.push({
    x,
    y: 0,
    z: z + width,
    id,
  });
  pos.push({
    x: x + 3 * width2,
    y: 0,
    z: z - width2,
    r: 90,
    id,
  });
  return pos;
};
