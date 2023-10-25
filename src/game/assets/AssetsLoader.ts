import * as THREE from 'three';
import NightbornSprite from '/sprites/nightborne.json?url';
import {
  makeJsonAssetPromise,
  AssetNames,
  FontPaths,
} from './AssetsLoaderHelpers';
import {
  SpriteData,
  Tileset,
  TiledMap,
  TiledTileset,
} from 'game/utils/Types';
import FarmTileset from '/tilesets/FarmTileset.json?url';
import CatacombsTiles from '/tilesets/CatacombsTileset.json?url';
import BeastWaterTileset from '/tilesets/BeastWaterTileset.json?url';
import GrasslandGroundTileset from '/tilesets/GrasslandGroundTileset.json?url';
import Map from '/maps/map.tmj?url';

class AssetsLoader {
  load: Promise<unknown>;
  assets: Record<string, SpriteData>;
  tilesets: Record<string, Tileset>;
  reject: ((value?: unknown) => void) | null = null;
  tiledMap: TiledMap | undefined;
  tiledTileset: Record<string, TiledTileset>;

  constructor() {
    let resolveAll: ((value?: unknown) => void) | null = null;
    this.load = new Promise(
      (
        promiseResolve: (value?: unknown) => void,
        promiseReject: (value?: unknown) => void,
      ) => {
        resolveAll = promiseResolve;
        this.reject = promiseReject;
      },
    );
    this.assets = {};
    this.tilesets = {};
    this.tiledTileset = {};

    const imageLoader = new THREE.ImageLoader();

    const assetsToLoad = [
      {
        name: AssetNames.Nightborne,
        url: NightbornSprite,
        destination: this.assets,
      },
      {
        name: AssetNames.FarmTileset,
        url: FarmTileset,
        destination: this.tilesets,
      },
      {
        name: AssetNames.CatacombsTileset,
        url: CatacombsTiles,
        destination: this.tilesets,
      },
      {
        name: AssetNames.BeastWaterTileset,
        url: BeastWaterTileset,
        destination: this.tilesets,
      },
      {
        name: AssetNames.GrasslandGroundTileset,
        url: GrasslandGroundTileset,
        destination: this.tilesets,
      },
    ];

    const jsonAssetsPromises = assetsToLoad.map(
      ({ name, url, destination }) =>
        makeJsonAssetPromise({
          assetUrl: url,
          handler: (spriteData) => {
            destination[name] = spriteData;
          },
        }),
    );

    const mapPromise = makeJsonAssetPromise({
      assetUrl: Map,
      handler: (tiledMap: TiledMap, resolve) => {
        this.tiledMap = tiledMap;

        const mapTilesetsPromises = tiledMap.tilesets.map(
          ({ source }) =>
            makeJsonAssetPromise({
              assetUrl: `/tilesets/${source}`,
              handler: (tileset) =>
                (this.tiledTileset[source] = tileset),
            }),
        );

        if (resolve) {
          Promise.all(mapTilesetsPromises).then(() => {
            const imagePromises = [];

            // @ts-ignore
            // eslint-disable-next-line
            for (const [source, tileset] of Object.entries(
              this.tiledTileset,
            )) {
              imagePromises.push(
                new Promise(
                  (
                    imageResolve: (value: void) => void,
                    imageReject: () => void,
                  ) => {
                    imageLoader.load(
                      `/tilesets/${tileset.image}`,
                      (image) => {
                        tileset.imageData = image;
                        imageResolve();
                      },
                      undefined,
                      () => {
                        console.error(
                          'Error while loading tileset asset',
                        );
                        imageReject();
                      },
                    );
                  },
                ),
              );
            }

            Promise.all(imagePromises).then(resolve);
          });
        }
      },
      passResolve: true,
    });

    const fontPromises = Object.entries(FontPaths).map(
      ([fontName, fontPath]) => {
        return new Promise<void>((resolve, reject) => {
          const fontFace = new FontFace(fontName, `url(${fontPath})`);
          fontFace.load().then(() => {
            document.fonts.add(fontFace);
            resolve();
          }, reject);
        });
      },
    );

    Promise.all([
      ...jsonAssetsPromises,
      mapPromise,
      ...fontPromises,
    ]).then(() => {
      if (resolveAll) {
        resolveAll();
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
