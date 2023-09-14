import * as THREE from 'three';
import TilesetManager from './TilesetManager';
import { pointInDirection } from 'game/utils/Math';
// import { getMoveStepForSpeed } from 'game/utils/creature';
import { type GameContext } from 'game/Game';
import { type Point, type MapCell } from 'game/utils/Types';
import { MapData } from './MapData';
import Sprite from 'game/sprite/Sprite';

const FloorHeight = 0.05;
const WallHeight = 2.5;

class Map {
  mapData: MapCell[];
  sprites: Sprite[];
  $: THREE.Group;
  walls: THREE.Group;
  floors: THREE.Group;
  tilesetManager: TilesetManager;

  constructor(context: GameContext, position: Point) {
    this.mapData = MapData;

    // Sprites to animate
    this.sprites = [];
    this.$ = new THREE.Group();

    this.walls = new THREE.Group();
    this.$.add(this.walls);

    this.floors = new THREE.Group();
    this.$.add(this.floors);

    this.tilesetManager = new TilesetManager(context.maxAnisotropy);
    this.tilesetManager.load([FarmTiles, CatacombsTiles]).then(() => {
      const posTiles = this.mapData.map((wallMapObject) => {
        const tile = this.tilesetManager.findTile(wallMapObject.id);

        if (!tile) {
          console.error('Error, no tile with id', wallMapObject.id);
        }

        return { tile, data: wallMapObject };
      });

      const walls = posTiles.filter(
        ({ tile }) => tile.type === 'wall',
      );
      const floors = posTiles.filter(
        ({ tile }) => tile.type === 'floor',
      );

      this.posTiles = posTiles;
      this.buildWalls(walls);
      this.buildFloors(floors);
    });
    this.setPosition(position);
  }
  buildWalls(tilesData) {
    tilesData.forEach(({ data, tile }) => {
      const width = tile?.size?.w || 1;
      const height = tile?.size?.h || WallHeight;
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

      wall.position.x = data.x;
      wall.position.y = data.y + WallHeight / 2 - FloorHeight;
      wall.position.z = data.z;
      if (data.r) {
        wall.rotation.set(0, (data.r * Math.PI) / 180, 0);
        wall.position.z = data.z + 0.5;
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
        light.position.set(0, 0, 0.01 * data.r ? -1 : 1);
        wall.add(light);
      }
    });
  }
  buildFloors(tilesData) {
    tilesData.forEach(({ data, tile }) => {
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

      floor.position.x = data.x + 0.5;
      floor.position.y = -FloorHeight;
      floor.position.z = data.z + 0.5;
      this.floors.add(floor);
    });
  }
  getPosTileObjectByPosition(x, z) {
    return this.posTiles.filter(
      ({ data }) => data.x === x && data.z === z,
    );
  }
  getPosTileObjectsByRange(x1, x2, z1, z2) {
    return this.posTiles.filter(
      ({ data }) =>
        data.x >= x1 && data.x <= x2 && data.z >= z1 && data.z <= z2,
    );
  }
  setPosition({ x, z }) {
    this.$.position.set(-x, 0, -z);
  }
  isPositionValid(toPosition) {
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
      wallDataObjects.forEach(({ data }) => {
        if (data.r === 90) {
          if (
            Math.abs(data.x - toPosition.x) < 0.6 &&
            toPosition.z + 0.5 >= data.z &&
            toPosition.z - 1.5 <= data.z
          ) {
            isValid = false;
          }
        } else {
          if (
            Math.abs(data.z - toPosition.z) < 0.6 &&
            toPosition.x + 0.5 >= data.x &&
            toPosition.x - 1.5 <= data.x
          ) {
            isValid = false;
          }
        }
      });
    }

    // Check creatures collision
    this.creaturesGroup.children.forEach((creature) => {
      const a = toPosition.x - creature.position.x;
      const b = toPosition.z - creature.position.z;
      const distance = Math.sqrt(a * a + b * b);

      if (distance < 1) {
        isValid = false;
      }
    });

    return isValid;
  }
  getPosition() {
    return { x: -this.$.position.x, z: -this.$.position.z };
  }
  addCreature(creature) {
    this.creatures.push(creature);
    this.creaturesGroup.add(creature.$);
  }
  isPlayerInRadius(position, radius) {
    const playerPos = this.getPosition();
    const diffX = playerPos.x - position.x;
    const diffZ = playerPos.z - position.z;
    const playerDistance = Math.sqrt(diffX * diffX + diffZ * diffZ);

    return playerDistance < radius;
  }
  movePlayerInDirection = (direction, speed) => {
    const radius = getMoveStepForSpeed(speed);
    const currentPosition = this.getPosition();
    const { x, z } = pointInDirection(
      currentPosition,
      direction,
      radius,
    );
    const shortenPos = (a, b) => a + (b - a) / 3;

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
  animate(delta) {
    this.sprites.forEach((sprite) => {
      sprite.animate(delta);
    });
  }
}

export default Map;
