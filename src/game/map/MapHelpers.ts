import { TilesetLink } from 'game/utils/Types';

export const findTilesetLink = (
  id: number,
  tilesets: TilesetLink[],
) => {
  for (let i = tilesets.length - 1; i > -1; i--) {
    const tileset = tilesets[i];

    if (tileset.firstgid <= id) {
      return tileset;
    }
  }
};

export const getTilePosition = (
  idx: number,
  width: number,
  layerId: number,
) => ({
  z: Math.floor(idx / width),
  y: 0.0001 * layerId,
  x: idx % width,
});
