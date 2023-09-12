import NightbornSprite from '/sprites/nightborne.json?url'
import { SpriteData, AssetNames } from './AssetsLoaderHelpers'

class AssetsLoader {
  load: Promise<unknown>;
  assets: Record<string, SpriteData>;

  constructor() {
    let resolve: ((value?: unknown) => void) | null = null;
    this.load = new Promise((r: (value?: unknown) => void) => (resolve = r));
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
}

export default AssetsLoader;
