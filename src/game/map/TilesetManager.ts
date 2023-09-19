import * as THREE from 'three';
import Sprite from 'game/sprite/Sprite';
import { Tileset } from 'game/utils/Types';

class TilesetManager {
  loadingPromise: Promise<void>;
  loadingPromiseResolve?: () => void;
  maxAnisotropy: number;
  tilesets: Tileset[];

  constructor(maxAnisotropy: number) {
    this.loadingPromise = new Promise((resolve) => {
      this.loadingPromiseResolve = resolve;
    });
    this.maxAnisotropy = maxAnisotropy;
    this.tilesets = [];
  }
  load(tilesets: Tileset[]) {
    this.tilesets = [...tilesets];

    const loader = new THREE.ImageLoader();
    const loadPromises: Promise<void>[] = [];
    this.tilesets.forEach((tileset) => {
      loadPromises.push(
        new Promise((resolve, reject) => {
          loader.load(
            tileset.assetUrl,
            (image) => {
              tileset.asset = image;
              resolve();
            },
            undefined,
            function () {
              console.error('Error while loading tileset asset');
              reject();
            },
          );
        }),
      );
    });

    Promise.all(loadPromises).then(() => {
      this.tilesets.forEach((tileset) => {
        tileset.tiles.forEach((tile) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            console.error(
              'Failed to retrieve context 2d from canvas',
            );
            return;
          }

          if (!tileset.asset) {
            console.error('Tileset asset not loaded');
            return;
          }

          if (tile.frame) {
            const { frame } = tile;
            canvas.width = frame.width;
            canvas.height = frame.height;

            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(
              tileset.asset,
              frame.x,
              frame.y,
              frame.width,
              frame.height,
              0,
              0,
              frame.width,
              frame.height,
            );
            const texture = new THREE.CanvasTexture(canvas);
            texture.anisotropy = this.maxAnisotropy;
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            tile.texture = texture;
          } else if (tile?.frames?.length) {
            canvas.width = tile.frames[0].width;
            canvas.height = tile.frames[0].height;
            ctx.imageSmoothingEnabled = false;
            const texture = new THREE.CanvasTexture(canvas);
            texture.anisotropy = this.maxAnisotropy;
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            const sprite = new Sprite(canvas, texture, 2);
            sprite.setAssetImage(tileset.asset);
            sprite.setAnimations({
              id: tile.id,
              name: tile.id,
              animations: [
                {
                  name: 'main',
                  frames: tile.frames.map((frame) => ({
                    x: frame.x,
                    y: frame.y,
                    width: frame.width,
                    height: frame.height,
                  })),
                },
              ],
            });
            sprite.playContinuous('main');
            tile.sprite = sprite;
            tile.texture = texture;
          }
        });
      });

      this.loadingPromiseResolve?.();
    });

    return this.loadingPromise;
  }
  findTile(id: string) {
    let returnTile;

    for (const tilesetIdx in this.tilesets) {
      const tileset = this.tilesets[tilesetIdx];
      returnTile = tileset.tiles.find((tile) => tile.id === id);

      if (returnTile) {
        return returnTile;
      }
    }
  }
}

export default TilesetManager;
