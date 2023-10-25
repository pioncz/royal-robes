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
  findTileset,
  findTilesetLink,
  getTilePosition,
} from './MapHelpers';

const FloorHeight = 0.05;
const WallHeight = 2.5;

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

    // this.tilesetManager = new TilesetManager(context.maxAnisotropy);
    // const farmTileset =
    //   context.assetsLoader.tilesets[AssetNames.FarmTileset];
    // const catacombTileset =
    //   context.assetsLoader.tilesets[AssetNames.CatacombsTileset];
    // const beastWaterTileset =
    //   context.assetsLoader.tilesets[AssetNames.BeastWaterTileset];
    // const grasslandGroundTileset =
    //   context.assetsLoader.tilesets[
    //     AssetNames.GrasslandGroundTileset
    //   ];
    // this.tilesetManager
    //   .load([
    //     farmTileset,
    //     catacombTileset,
    //     beastWaterTileset,
    //     grasslandGroundTileset,
    //   ])
    //   .then(() => {
    //     const mapTiles = this.mapData.map((mapCell) => {
    //       const tile = this.tilesetManager.findTile(mapCell.id);

    //       if (!tile) {
    //         console.error('Error, no tile with id', mapCell.id);
    //       }

    //       return { tile, cell: mapCell };
    //     });

    //     const walls = mapTiles.filter(
    //       ({ tile }) => tile?.type === 'wall',
    //     ) as MapTile[];
    //     const floors = mapTiles.filter(
    //       ({ tile }) => tile?.type === 'floor',
    //     ) as MapTile[];

    //     this.mapTiles = mapTiles.filter((p) => !!p.tile) as MapTile[];
    //     this.buildWalls(walls);
    //     this.buildFloors(floors);
    //   });
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
          // texture
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            console.error(
              'Failed to retrieve context 2d from canvas',
            );
            return;
          }

          const x =
            (tileRelativeId % tileset.columns) * tileset.tilewidth;
          const y =
            Math.floor(tileRelativeId / tileset.columns) *
            tileset.tileheight;

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
          newTexture.anisotropy = this.context.maxAnisotropy;
          newTexture.magFilter = THREE.NearestFilter;
          newTexture.minFilter = THREE.LinearMipMapLinearFilter;

          if (!tileset.textures) {
            tileset.textures = {};
          }

          tileset.textures[tileRelativeId] = newTexture;
          // texture end
        }
        const texture = tileset.textures[tileRelativeId];

        // mesh
        const geometryPlane = new THREE.BoxGeometry(
          1,
          FloorHeight,
          1,
        );
        const materialPlane = new THREE.MeshPhongMaterial({
          map: texture,
          transparent: true,
          shininess: 0,
          flatShading: true,
        });
        const meshPosition = getTilePosition(
          dataIdx,
          width,
          layerIdx,
        );
        const floor = new THREE.Mesh(geometryPlane, materialPlane);
        floor.position.x = meshPosition.x + 0.5;
        floor.position.y = meshPosition.y - FloorHeight;
        floor.position.z = meshPosition.z + 0.5;
        this.floors.add(floor);
        // mesh end
      }
    }
  }
  private buildWalls(mapTiles: MapTile[]) {
    mapTiles.forEach(({ cell, tile }) => {
      const width = tile?.size?.width || 1;
      const height = tile?.size?.height || WallHeight;
      const geometryPlane = new THREE.BoxGeometry(
        width,
        height,
        0.01,
      );
      if (tile.sprite) {
        this.sprites.push(tile.sprite);
      }

      const materialPlane = new THREE.MeshPhongMaterial({
        ...(tile.texture ? { map: tile.texture } : {}),
        ...(!tile.texture || tile.color
          ? { color: tile.color || '#049ef4' }
          : {}),
        transparent: true,
        shininess: 0,
        flatShading: true,
      });
      const wall = new THREE.Mesh(geometryPlane, materialPlane);

      wall.position.x = cell.x;
      wall.position.y = cell.y + WallHeight / 2 - FloorHeight;
      wall.position.z = cell.z;
      if (cell.r) {
        wall.rotation.set(0, (cell.r * Math.PI) / 180, 0);
        wall.position.z = cell.z + 0.5;
      } else {
        wall.position.x += 0.5;
      }
      this.walls.add(wall);

      if (tile.light) {
        const color = tile.light.color || '#F9DDFF';
        const intensity = tile.light.intensity || 0.5;
        const distance = tile.light.distance || 8;
        const decay = tile.light.decay || 2;

        const light = new THREE.PointLight(
          color,
          intensity,
          distance,
          decay,
        );
        light.position.set(0, 0, 0.01 * (cell?.r ? -1 : 1));
        wall.add(light);
      }
    });
  }
  private buildFloors(mapTiles: MapTile[]) {
    mapTiles.forEach(({ cell, tile }) => {
      const geometryPlane = new THREE.BoxGeometry(1, FloorHeight, 1);
      const materialPlane = new THREE.MeshPhongMaterial({
        ...(tile.texture ? { map: tile.texture } : {}),
        ...(!tile.texture || tile.color
          ? { color: tile.color || '#049ef4' }
          : {}),
        transparent: true,
        shininess: 0,
        flatShading: true,
      });
      const floor = new THREE.Mesh(geometryPlane, materialPlane);

      floor.position.x = cell.x + 0.5;
      floor.position.y = -FloorHeight;
      floor.position.z = cell.z + 0.5;
      this.floors.add(floor);
    });
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
