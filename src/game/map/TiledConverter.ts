const findPosition = (index: number) => ({});

const findTileset = (id: number, tilesets: any) => {
  for (let i = tilesets.length - 1; i > -1; i--) {
    const tileset = tilesets[i];

    if (tileset.firstgid <= id) {
      return tileset;
    }
  }
};

// eslint-disable-next-line
const TiledConverter = (tiledMap: any) => {
  if (!tiledMap || !tiledMap.layers || !tiledMap.tilesets) {
    console.error(
      "Error while converting tiled map. Map doesn't exist or is broken.",
    );

    return;
  }
  const { layers, tilesets, width } = tiledMap;
  const layers2 = [layers[0], layers[1]];
  const returnTiles = [];
  let i = false;

  for (let layerIdx = 0; layerIdx < layers2.length; layerIdx++) {
    const layer = layers[layerIdx];

    for (let dataIdx = 0; dataIdx < layer.data.length; dataIdx++) {
      const tileId = layer.data[dataIdx];
      const tileset = findTileset(tileId, tilesets);

      if (tileId === 0 || !tileset) continue;

      if (!tileset && !i) {
        i = true;
        console.log(tileId, tileset, tilesets);
      }

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
