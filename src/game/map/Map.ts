import * as THREE from 'three';
import { pointInDirection } from 'game/utils/Math';
import { getMoveStepForSpeed } from 'game/creature/CreatureHelpers';
import { type GameContext } from 'game/Game';
import {
  type Point,
  type TiledMap,
  TilesetLayer,
} from 'game/utils/Types';
import Sprite from 'game/sprite/Sprite';
import {
  createTextureFromTileset,
  createTileMesh,
  cropLayerData,
  findTilesetLink,
  getTilePosition,
} from './MapHelpers';
import TiledObject from './TiledObject';

class Map {
  context: GameContext;
  tiledMap: TiledMap | undefined;
  collisionLayer: TilesetLayer | undefined;
  sprites: Sprite[];
  $: THREE.Group;
  walls: THREE.Group;
  floors: THREE.Group;
  initialPosition: Point;
  onPositionUpdate: (newPosition: Point) => void;

  constructor(
    context: GameContext,
    {
      initialPosition,
      onPositionUpdate,
    }: {
      initialPosition: Point;
      onPositionUpdate: (newPosition: Point) => void;
    },
  ) {
    this.context = context;
    this.tiledMap = context.assetsLoader.tiledMap;
    this.onPositionUpdate = onPositionUpdate;
    // Sprites to animate
    this.sprites = [];
    this.$ = new THREE.Group();
    this.walls = new THREE.Group();
    this.$.add(this.walls);
    this.floors = new THREE.Group();
    this.$.add(this.floors);

    this.setPosition(initialPosition);
    this.initialPosition = initialPosition;
    this.buildWorld();
  }
  private buildWorld() {
    if (!this.tiledMap) return;

    const { layers, tilesets, width, tileheight, tilewidth } =
      this.tiledMap;

    const objectRoots: Record<string, TilesetLayer> = {};
    const objectDefinitions = layers.find(
      (l) => l.name === 'Objects' && l.type === 'group',
    );
    for (
      let objectIdx = 0;
      objectIdx < (objectDefinitions?.layers?.length || 0);
      objectIdx++
    ) {
      const objectLayer = objectDefinitions?.layers?.[objectIdx];
      if (!objectLayer) {
        continue;
      }
      const objectName = objectLayer.name;
      const tileLayer = objectLayer.layers?.find(
        (l) => l.name !== 'Root',
      );
      const rootLayer = objectLayer.layers?.find(
        (l) => l.name === 'Root',
      );
      const rootDataId = rootLayer?.data?.findIndex((d) => d > 0);
      const tileId =
        rootDataId !== undefined && rootDataId > -1
          ? rootLayer?.data?.[rootDataId]
          : undefined;
      const nameParts = tileLayer?.name?.split('_') || [];
      const layerWidth = Number(nameParts?.[1]) || 0;
      const layerHeight = Number(nameParts?.[2]) || 0;
      const croppedData = cropLayerData(
        tileLayer?.data,
        width,
        layerWidth,
        layerHeight,
      );
      if (
        !tileLayer ||
        !rootLayer ||
        !tileId ||
        !tileId ||
        !layerWidth ||
        !layerHeight
      ) {
        continue;
      }
      objectRoots[tileId] = {
        name: objectName,
        data: croppedData,
        width: layerWidth,
        height: layerHeight,
      };
    }

    for (let layerIdx = 0; layerIdx < layers.length; layerIdx++) {
      const layer = layers[layerIdx];

      if (layer.name.toLowerCase().startsWith('collision')) {
        this.collisionLayer = layer;
        if (!this.context.debug) {
          continue;
        }
      }

      if (layer?.data?.length === undefined) {
        continue;
      }

      if (layer.name.toLowerCase().startsWith('object')) {
        for (
          let dataIdx = 0;
          dataIdx < layer.data.length;
          dataIdx++
        ) {
          const tileId: number = layer.data[dataIdx];
          const tiledObject = objectRoots['' + tileId];

          if (tiledObject) {
            const position = getTilePosition(
              dataIdx,
              width,
              layerIdx,
            );
            const newObject = new TiledObject(this.context, {
              position,
              tileheight,
              tilewidth,
              width: tiledObject.width,
              height: tiledObject.height,
              data: tiledObject.data,
              tilesets,
            });
            this.$.add(newObject.$);
          }
        }
      } else {
        for (
          let dataIdx = 0;
          dataIdx < layer.data.length;
          dataIdx++
        ) {
          const tileId: number = layer.data[dataIdx];
          const tilesetLink = findTilesetLink(tileId, tilesets);
          const tileset =
            tilesetLink?.source &&
            this.context.assetsLoader.tiledTileset?.[
              tilesetLink?.source
            ];
          const tileRelativeId =
            tileId - (tilesetLink?.firstgid || 0);

          if (
            tileId === 0 ||
            !tilesetLink ||
            !tileset ||
            !tileset.imageData
          ) {
            if (tileId !== 0) {
              console.error('Invalid tileset for tileId ', tileId);
            }
            continue;
          }

          if (!tileset.textures?.[tileRelativeId]) {
            const newTexture = createTextureFromTileset({
              maxAnisotropy: this.context.maxAnisotropy,
              tileset,
              tileId: tileRelativeId,
            });

            if (!tileset.textures) {
              tileset.textures = {};
            }

            if (newTexture) {
              tileset.textures[tileRelativeId] = newTexture;
            }
          }
          const texture = tileset.textures[tileRelativeId];
          if (!texture) return;
          const position = getTilePosition(dataIdx, width, layerIdx);
          const mesh = createTileMesh({
            texture,
            position,
          });

          this.floors.add(mesh);
        }
      }
    }
  }
  private setPosition({ x, z }: { x: number; z: number }) {
    this.$.position.set(-x, 0, -z);
    this.onPositionUpdate({ x, z });
  }
  private isPositionValid(toPosition: { x: number; z: number }) {
    const mapWidth = this.tiledMap?.width || 0;
    const x = Math.floor(toPosition.x);
    const z = Math.floor(toPosition.z);
    const dataIdx = mapWidth * z + x;
    const data = this.collisionLayer?.data?.[dataIdx] || 0;
    return data <= 0;
  }
  isPlayerInRadius(
    position: { x: number; z: number },
    radius: number,
  ) {
    const playerPos = this.getPosition();
    const diffX = playerPos.x - position.x;
    const diffZ = playerPos.z - position.z;
    const playerDistance = Math.sqrt(diffX * diffX + diffZ * diffZ);

    return playerDistance < radius;
  }
  getPosition() {
    return { x: -this.$.position.x, z: -this.$.position.z } as Point;
  }
  movePlayerInDirection = (direction: number, speed: number) => {
    const radius = getMoveStepForSpeed(speed);
    const currentPosition = this.getPosition();
    const { x, z } = pointInDirection(
      currentPosition,
      direction,
      radius,
    );
    const shortenPos = (a: number, b: number) => a + (b - a) / 3;

    if (this.isPositionValid({ x, z })) {
      this.setPosition({ x, z });
    } else if (this.isPositionValid({ x, z: currentPosition.z })) {
      this.setPosition({
        x: shortenPos(currentPosition.x, x),
        z: currentPosition.z,
      });
    } else if (this.isPositionValid({ x: currentPosition.x, z })) {
      this.setPosition({
        x: currentPosition.x,
        z: shortenPos(currentPosition.z, z),
      });
    }
  };
  restart() {
    this.setPosition(this.initialPosition);
  }
  animate(delta: number) {
    this.sprites.forEach((sprite) => {
      sprite.animate(delta);
    });
  }
}

export default Map;
