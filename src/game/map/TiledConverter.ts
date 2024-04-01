import { TiledMap, TilesetLink } from 'game/utils/Types';

const findTileset = (id: number, tilesets: TilesetLink[]) => {
  for (let i = tilesets.length - 1; i > -1; i--) {
    const tileset = tilesets[i];

    if (tileset.firstgid <= id) {
      return tileset;
    }
  }
};

const TiledConverter = (tiledMap?: TiledMap) => {
  if (
    !tiledMap ||
    !tiledMap.layers ||
    !tiledMap.tilesets ||
    !tiledMap.width
  ) {
    console.error(
      "Error while converting tiled map. Map doesn't exist or is broken.",
    );

    return [];
  }

  const { layers, tilesets, width } = tiledMap;
  const layers2 = [layers[0], layers[1]];
  const returnTiles = [];

  for (let layerIdx = 0; layerIdx < layers2.length; layerIdx++) {
    const layer = layers[layerIdx];

    for (let dataIdx = 0; dataIdx < layer.data.length; dataIdx++) {
      const tileId = layer.data[dataIdx];
      const tileset = findTileset(tileId, tilesets);

      if (tileId === 0 || !tileset) continue;

      const z = Math.floor(dataIdx / width);
      const x = dataIdx % width;
      const firstLetter = tileset.source[0];

      returnTiles.push({
        x,
        y: 0.0001 * layerIdx,
        z,
        id: `${firstLetter}${tileId - tileset.firstgid}`,
      });
    }
  }

  return returnTiles;
};

export default TiledConverter;
