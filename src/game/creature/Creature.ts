import Sprite from './Sprite.js';
import { pointInDirection } from './utils/math.js';
import { getMoveStepForSpeed } from './utils/creature.js';
import CreatureEffects, { TextTypes } from './CreatureEffects';

export const States = {
  idle: 'idle',
  walking: 'walking',
  talking: 'talking',
  attack: 'attack',
  chase: 'chase',
  dead: 'dead',
};

class Creature {
  constructor({
    debug = false,
    maxAnisotropy,
    color,
    speed = 100,
    health = 100,
    defence = 10,
    attack = 5,
    creatureEffects = true,
  }) {
    this.speed = speed;
    this.health = health;
    this.defence = defence;
    this.attack = attack;

    this.$ = new THREE.Group();
    this.$.rotation.y = -Math.PI / 4;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = maxAnisotropy;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    this.texture = texture;
    this.sprite = new Sprite(canvas, texture, 10);
    const geometrySprite = new THREE.PlaneGeometry(1, 1);
    const materialSprite = new THREE.MeshBasicMaterial({
      map: texture,
      ...(color ? { color } : {}),
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthTest: false,
    });
    this.sprite$ = new THREE.Mesh(geometrySprite, materialSprite);
    this.$.add(this.sprite$);

    if (debug) {
      const geometrySprite2 = new THREE.CylinderGeometry(
        0.5,
        0.5,
        1,
        32,
      );
      const materialSprite2 = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.2,
        color: '#ff9922',
        depthTest: false,
      });
      this.debug$ = new THREE.Mesh(geometrySprite2, materialSprite2);
      this.debug$.position.set(0, 0, 0);
      this.debug$.rotation.y = -0;
      this.$.add(this.debug$);
    }

    if (creatureEffects) {
      this.creatureEffects = new CreatureEffects({
        debug,
        maxAnisotropy,
      });
      this.$.add(this.creatureEffects.$);
    }
  }
  turn = (orientation) => {
    this.sprite$.scale.x = orientation === 'left' ? 1 : -1;
    if (this.creatureEffects) {
      this.creatureEffects.turn(orientation);
    }
  };
  moveInDirection = (direction) => {
    const radius = getMoveStepForSpeed(this.speed);
    const { x, z } = pointInDirection(
      this.$.position,
      direction,
      radius,
    );

    this.$.position.x = x;
    this.$.position.z = z;
  };
  calculateDamage = (opponent) =>
    Math.max(this.attack - opponent.defence, 0);
  dealDamage = (damage) => {
    this.health = Math.max(this.health - damage, 0);
    if (this.health === 0 && this.setState) {
      this.setState(States.dead);
    }
    if (this.creatureEffects) {
      this.creatureEffects.add(TextTypes.Damage, damage);
    }
  };
  animate(delta) {
    if (this.creatureEffects) {
      this.creatureEffects.animate(delta);
    }
  }
}

export default Creature;
