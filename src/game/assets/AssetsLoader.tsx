import NightbornSprite from '/sprites/nightborne.json?url'
import { SpriteData, AssetNames } from './AssetsLoaderHelpers'

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

    Promise.all([spritesPromise]).then(() => {
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
