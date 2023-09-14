import NightbornSprite from '/sprites/nightborne.json?url'
import { AssetNames } from './AssetsLoaderHelpers'
import { SpriteData } from 'game/utils/Types'
import FarmTileset from '/tilesets/FarmTileset.json?url';
import CatacombsTiles from '/tilesets/CatacombsTileset.json?url';

class AssetsLoader {
  load: Promise<unknown>;
  assets: Record<string, SpriteData>;
  reject: ((value?: unknown) => void) | null = null;

  constructor() {
    let resolve: ((value?: unknown) => void) | null = null;
    this.load = new Promise((promiseResolve: (value?: unknown) => void, promiseReject: (value?: unknown) => void) => {
      resolve = promiseResolve;
      this.reject = promiseReject;
    });
    this.assets = {};

    const spritesPromise = new Promise((resolve: (value?: unknown) => void) => {
      fetch(NightbornSprite)
        .then((response) => response.json())
        .then((spriteData) => {
          this.assets[AssetNames.Nightborne] = spriteData;
          resolve();
        });
    });

    const farmTilesetPromise = new Promise((resolve: (value?: unknown) => void) => {
      fetch(FarmTileset)
        .then((response) => response.json())
        .then((spriteData) => {
          this.assets[AssetNames.FarmTileset] = spriteData;
          resolve();
        });
    });

    const catacombTilesetPromise = new Promise((resolve: (value?: unknown) => void) => {
      fetch(CatacombsTiles)
        .then((response) => response.json())
        .then((spriteData) => {
          this.assets[AssetNames.FarmTileset] = spriteData;
          resolve();
        });
    });

    Promise.all([spritesPromise, farmTilesetPromise, catacombTilesetPromise]).then(() => {
      if (resolve) {
        resolve();
      }
    });
  }

  remove() {
    if (this.reject) {
      this.reject();
    }
  }
}

export default AssetsLoader;
