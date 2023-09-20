import * as THREE from 'three';
import TilesetManager from './TilesetManager';
import { pointInDirection } from 'game/utils/Math';
import { getMoveStepForSpeed } from 'game/creature/CreatureHelpers';
import { type GameContext } from 'game/Game';
import {
  type Point,
  type MapCell,
  type MapTile,
} from 'game/utils/Types';
import { MapData } from './MapData';
import Sprite from 'game/sprite/Sprite';
import { AssetNames } from 'game/assets/AssetsLoaderHelpers';

const FloorHeight = 0.05;
const WallHeight = 2.5;

class Map {
  mapData: MapCell[];
  sprites: Sprite[];
  $: THREE.Group;
  walls: THREE.Group;
  floors: THREE.Group;
  tilesetManager: TilesetManager;
  mapTiles: MapTile[];
  initialPosition: Point;

  constructor(context: GameContext, position: Point) {
    this.mapData = MapData;
    this.mapTiles = [];

    // Sprites to animate
    this.sprites = [];
    this.$ = new THREE.Group();

    this.walls = new THREE.Group();
    this.$.add(this.walls);

    this.floors = new THREE.Group();
    this.$.add(this.floors);

    this.tilesetManager = new TilesetManager(context.maxAnisotropy);
    const farmTileset =
      context.assetsLoader.tilesets[AssetNames.FarmTileset];
    const catacombTileset =
      context.assetsLoader.tilesets[AssetNames.CatacombsTileset];
    this.tilesetManager
      .load([farmTileset, catacombTileset])
      .then(() => {
        const mapTiles = this.mapData.map((mapCell) => {
          const tile = this.tilesetManager.findTile(mapCell.id);

          if (!tile) {
            console.error('Error, no tile with id', mapCell.id);
          }

          return { tile, cell: mapCell };
        });

        const walls = mapTiles.filter(
          ({ tile }) => tile?.type === 'wall',
        ) as MapTile[];
        const floors = mapTiles.filter(
          ({ tile }) => tile?.type === 'floor',
        ) as MapTile[];

        this.mapTiles = mapTiles.filter((p) => !!p.tile) as MapTile[];
        this.buildWalls(walls);
        this.buildFloors(floors);
      });
    this.setPosition(position);
    this.initialPosition = position;
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
    return this.mapTiles.filter(
      ({ cell }) => cell.x === x && cell.z === z,
    );
  }
  private getPosTileObjectsByRange(
    x1: number,
    x2: number,
    z1: number,
    z2: number,
  ) {
    return this.mapTiles.filter(
      ({ cell }) =>
        cell.x >= x1 && cell.x <= x2 && cell.z >= z1 && cell.z <= z2,
    );
  }
  private setPosition({ x, z }: { x: number; z: number }) {
    this.$.position.set(-x, 0, -z);
  }
  private isPositionValid(toPosition: { x: number; z: number }) {
    const floorDataObjects = this.getPosTileObjectByPosition(
      Math.floor(toPosition.x),
      Math.floor(toPosition.z),
    ).filter((obj) => obj.tile.type === 'floor');

    // Fail fast if there is no floor
    if (!floorDataObjects.length) {
      return false;
    }

    // Check walls collision
    let isValid = true;
    // Get wall objects around toPosition (3x3 square)
    const x1 = Math.floor(toPosition.x) - 1;
    const x2 = Math.floor(toPosition.x) + 1;
    const z1 = Math.floor(toPosition.z) - 1;
    const z2 = Math.floor(toPosition.z) + 1;

    const wallDataObjects = this.getPosTileObjectsByRange(
      x1,
      x2,
      z1,
      z2,
    ).filter((obj) => obj.tile.type === 'wall' && !obj.tile.walkable);

    if (wallDataObjects.length) {
      wallDataObjects.forEach(({ cell }) => {
        if (cell.r === 90) {
          if (
            Math.abs(cell.x - toPosition.x) < 0.6 &&
            toPosition.z + 0.5 >= cell.z &&
            toPosition.z - 1.5 <= cell.z
          ) {
            isValid = false;
          }
        } else {
          if (
            Math.abs(cell.z - toPosition.z) < 0.6 &&
            toPosition.x + 0.5 >= cell.x &&
            toPosition.x - 1.5 <= cell.x
          ) {
            isValid = false;
          }
        }
      });
    }

    // Check creatures collision
    // this.creaturesGroup.children.forEach((creature) => {
    //   const a = toPosition.x - creature.position.x;
    //   const b = toPosition.z - creature.position.z;
    //   const distance = Math.sqrt(a * a + b * b);

    //   if (distance < 1) {
    //     isValid = false;
    //   }
    // });

    return isValid;
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
