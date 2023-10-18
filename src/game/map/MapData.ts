import {
  generateMapFromFragments,
  generateColumn,
} from './Generators';

let MapData = generateMapFromFragments([
  // Floors
  {
    size: { x: 30, z: 10 },
    ids: ['2', '3', '4'],
  },
  // Grass isle
  {
    size: { x: 6, z: 6 },
    offset: { x: 3, z: 1 },
    ids: ['5', '6', '7', '8', '9', '10', '11', '12', '13'],
    fillFunction: (ids, x, z, size) => {
      let id = ids[4];
      if (
        typeof size?.x !== 'number' ||
        typeof size?.z !== 'number' ||
        typeof z !== 'number'
      ) {
        return { id: ids[0] };
      }
      if (x === 0 && z === 0) {
        id = ids[0];
      }
      if (x > 0 && x < size?.x - 1 && z === 0) {
        id = ids[1];
      }
      if (x === size.x - 1 && z === 0) {
        id = ids[2];
      }
      if (z > 0 && z < size.z - 1 && x === 0) {
        id = ids[3];
      }
      if (z < size.z - 1 && z > 0 && x === size.x - 1) {
        id = ids[5];
      }
      if (z === size.z - 1 && x === 0) {
        id = ids[6];
      }
      if (z === size.z - 1 && x > 0 && x < size.x - 1) {
        id = ids[7];
      }
      if (z === size.z - 1 && x === size.x - 1) {
        id = ids[8];
      }

      return { id };
    },
  },
  // Catacomb tiles
  // {
  //   size: { x: 1, z: 2 },
  //   offset: { x: 5, z: 5 },
  //   ids: ['c3', 'c4'],
  //   // fillFunction: (ids, x, z, size) => {
  //   // }
  // },
  // {
  //   size: { x: 1, z: 2 },
  //   offset: { x: 6, z: 5 },
  //   ids: ['c5'],
  //   // fillFunction: (ids, x, z, size) => {
  //   // }
  // },
  // Wall left
  {
    size: { x: 30, z: 1 },
    ids: ['c0'],
  },
  // Wall top
  {
    size: { x: 1, z: 10 },
    offset: { x: 30, z: 0 },
    ids: ['c0'],
    r: 90,
  },
  // Wall bottom
  {
    size: { x: 1, z: 10 },
    ids: ['c0'],
    r: 90,
  },
  // Wall right
  {
    size: { x: 30, z: 1 },
    offset: { x: 0, z: 10 },
    ids: ['c0'],
  },
  // Hangings
  {
    size: { x: 30, z: 1 },
    offset: { x: 0, z: 0.01 },
    ids: ['c1'],
    fillFunction: (ids, x) => ({ id: x % 5 === 4 ? ids[0] : null }),
  },
]);

// Columns
MapData = [...MapData, ...generateColumn(4, 2, 'c2', 0.5)];
MapData = [...MapData, ...generateColumn(9, 2, 'c2', 0.5)];
MapData = [...MapData, ...generateColumn(14, 2, 'c2', 0.5)];
MapData = [...MapData, ...generateColumn(19, 2, 'c2', 0.5)];
MapData = [...MapData, ...generateColumn(24, 2, 'c2', 0.5)];

export { MapData };
