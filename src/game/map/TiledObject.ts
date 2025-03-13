import * as THREE from 'three';
import { GameContext } from 'game/Game';
import { Point, TilesetLink } from 'game/utils/Types';
import { findTilesetLink } from './MapHelpers';
import createCustomPhongMaterial from 'game/materials/CustomPhongMaterial';

class TiledObject {
  $: THREE.Mesh;
  context: GameContext;

  constructor(
    context: GameContext,
    {
      position,
      tilewidth,
      tileheight,
      width = 0,
      height = 0,
      data,
      tilesets,
    }: {
      position: Point;
      tilewidth: number;
      tileheight: number;
      width?: number;
      height?: number;
      data?: number[];
      tilesets: TilesetLink[];
    },
  ) {
    this.context = context;

    const canvas = document.createElement('canvas');
    const newTexture = new THREE.CanvasTexture(canvas);
    newTexture.anisotropy = context.maxAnisotropy;
    newTexture.magFilter = THREE.NearestFilter;
    newTexture.minFilter = THREE.LinearMipMapLinearFilter;

    const geometrySprite = new THREE.PlaneGeometry(width, height);
    const materialSprite = createCustomPhongMaterial({
      map: newTexture,
      transparent: true,
      shininess: 0,
      flatShading: true,
    });
    this.$ = new THREE.Mesh(geometrySprite, materialSprite);
    this.$.position.set(
      position.x + 0.5,
      height / 2 - 0.5,
      position.z + 0.5,
    );
    this.$.rotation.y = Math.PI / 4;

    const ctx = canvas.getContext('2d');
    canvas.width = tilewidth * width;
    canvas.height = tileheight * height;
    if (!ctx) {
      console.error('Failed to retrieve context 2d from canvas');
      return;
    }
    ctx.imageSmoothingEnabled = false;

    if (data) {
      for (let i = 0; i < data.length; i++) {
        const tileId: number = data[i];
        const tilesetLink = findTilesetLink(tileId, tilesets);
        const tileset =
          tilesetLink?.source &&
          this.context.assetsLoader.tiledTileset?.[
            tilesetLink?.source
          ];
        const tileRelativeId = tileId - (tilesetLink?.firstgid || 0);

        if (!tileset || !tileset.imageData) {
          continue;
        }

        const tilesetX =
          (tileRelativeId % tileset.columns) * tilewidth;
        const tilesetY =
          Math.floor(tileRelativeId / tileset.columns) * tileheight;
        const destinationX = (i % width) * tilewidth;
        const destinationY = Math.floor(i / width) * tileheight;

        ctx.drawImage(
          tileset.imageData,
          tilesetX,
          tilesetY,
          tileset.tilewidth,
          tileset.tileheight,
          destinationX,
          destinationY,
          tileset.tilewidth,
          tileset.tileheight,
        );
      }
    }
  }
  animate() {}
}

export default TiledObject;
