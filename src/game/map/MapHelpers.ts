import * as THREE from 'three';
import { TiledTileset, TilesetLink } from 'game/utils/Types';

const FloorHeight = 0.05;

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

/**
 * Get the position for a tile in the isometric view
 */
export const getTilePosition = (
  idx: number,
  width: number,
  layerId: number,
) => {
  const tileX = idx % width;
  const tileZ = Math.floor(idx / width);
  
  // Y position is used for stacking different layers
  return new THREE.Vector3(
    tileX,
    0.0001 * layerId,
    tileZ
  );
};

export const createTextureFromTileset = ({
  maxAnisotropy,
  tileset,
  tileId,
}: {
  maxAnisotropy: number;
  tileset: TiledTileset;
  tileId: number;
}) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!tileset.imageData) {
    console.error(
      'Failed to make texture. Tileset imageData is undefined',
    );
    return;
  }
  if (!ctx) {
    console.error('Failed to retrieve context 2d from canvas');
    return;
  }

  const x = (tileId % tileset.columns) * tileset.tilewidth;
  const y = Math.floor(tileId / tileset.columns) * tileset.tileheight;

  canvas.width = tileset.tilewidth;
  canvas.height = tileset.tileheight;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    tileset.imageData,
    x,
    y,
    tileset.tilewidth,
    tileset.tileheight,
    0,
    0,
    tileset.tilewidth,
    tileset.tileheight,
  );
  const newTexture = new THREE.CanvasTexture(canvas);
  newTexture.anisotropy = maxAnisotropy;
  newTexture.magFilter = THREE.NearestFilter;
  newTexture.minFilter = THREE.LinearMipMapLinearFilter;
  return newTexture;
};

/**
 * Create a mesh for a tile with proper isometric positioning
 */
export const createTileMesh = ({
  texture,
  position,
}: {
  texture: THREE.CanvasTexture;
  position: THREE.Vector3;
}) => {
  const geometryPlane = new THREE.BoxGeometry(1, FloorHeight, 1);
  const materialPlane = new THREE.MeshPhongMaterial({
    map: texture,
    transparent: true,
    shininess: 0,
    flatShading: true,
  });
  const floor = new THREE.Mesh(geometryPlane, materialPlane);
  
  // Position the tile, adding 0.5 to center it in its grid space
  floor.position.x = position.x + 0.5;
  floor.position.y = position.y - FloorHeight / 2; // Adjust Y position so bottom of box is at y level
  floor.position.z = position.z + 0.5;

  return floor;
};

export const cropLayerData = (
  layerData: number[] | undefined,
  width: number,
  cropWidth: number,
  cropHeight: number,
) => {
  let croppedData: number[] = [];

  if (!layerData) {
    return [];
  }

  for (let i = 0; i < cropHeight; i++) {
    croppedData = [
      ...croppedData,
      ...layerData.slice(i * width, i * width + cropWidth),
    ];
  }
  return croppedData;
};
