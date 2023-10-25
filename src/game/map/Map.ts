import * as THREE from 'three';
import TilesetManager from './TilesetManager';
import { pointInDirection } from 'game/utils/Math';
import { getMoveStepForSpeed } from 'game/creature/CreatureHelpers';
import { type GameContext } from 'game/Game';
import {
  type Point,
  type MapCell,
  type MapTile,
  type TiledMap,
  TilesetLink,
} from 'game/utils/Types';
import Sprite from 'game/sprite/Sprite';
import { AssetNames } from 'game/assets/AssetsLoaderHelpers';
import TiledConverter from './TiledConverter';
import {
  createTextureFromTileset,
  createTileMesh,
  findTileset,
  findTilesetLink,
  getTilePosition,
} from './MapHelpers';

class Map {
  context: GameContext;
  tiledMap: TiledMap | undefined;
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

    const { layers, tilesets, width } = this.tiledMap;

    for (let layerIdx = 0; layerIdx < layers.length; layerIdx++) {
      const layer = layers[layerIdx];

      for (let dataIdx = 0; dataIdx < layer.data.length; dataIdx++) {
        const tileId = layer.data[dataIdx];
        const tilesetLink = findTilesetLink(tileId, tilesets);
        const tileset =
          tilesetLink?.source &&
          this.context.assetsLoader.tiledTileset?.[
            tilesetLink?.source
          ];
        const tileRelativeId = tileId - (tilesetLink?.firstgid || 0);

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
  private getPosTileObjectByPosition(x: number, z: number) {
    // return this.mapTiles.filter(
    //   ({ cell }) => cell.x === x && cell.z === z,
    // );
  }
  private getPosTileObjectsByRange(
    x1: number,
    x2: number,
    z1: number,
    z2: number,
  ) {
    // return this.mapTiles.filter(
    //   ({ cell }) =>
    //     cell.x >= x1 && cell.x <= x2 && cell.z >= z1 && cell.z <= z2,
    // );
  }
  private setPosition({ x, z }: { x: number; z: number }) {
    this.$.position.set(-x, 0, -z);
    this.onPositionUpdate({ x, z });
  }
  private isPositionValid(toPosition: { x: number; z: number }) {
    return true;
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
