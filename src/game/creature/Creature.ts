import * as THREE from 'three';
import Sprite from 'game/sprite/Sprite';
import { pointInDirection } from 'game/utils/Math';
import { getMoveStepForSpeed } from './CreatureHelpers';
import CreatureEffects from './CreatureEffects';
import {
  type CreatureOrientation,
  type CreatureStates,
} from 'game/utils/Types';

class Creature {
  $: THREE.Group;
  sprite$: THREE.Mesh;
  debug$?: THREE.Mesh;
  sprite: Sprite;
  texture: THREE.Texture;
  speed: number;
  health: number;
  defence: number;
  attack: number;
  creatureEffects?: CreatureEffects;

  constructor({
    debug = false,
    maxAnisotropy,
    color,
    speed = 100,
    health = 100,
    defence = 10,
    attack = 5,
    creatureEffects = true,
  }: {
    debug?: boolean;
    maxAnisotropy: number;
    color?: string;
    speed?: number;
    health?: number;
    defence?: number;
    attack?: number;
    creatureEffects?: boolean;
  }) {
    this.speed = speed;
    this.health = health;
    this.defence = defence;
    this.attack = attack;

    this.$ = new THREE.Group();
    this.$.rotation.y = -Math.PI / 4;

    const canvas = document.createElement('canvas');
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
      this.creatureEffects = new CreatureEffects(maxAnisotropy);
      this.$.add(this.creatureEffects.$);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to retrieve context 2d from canvas');
      return;
    }
    ctx.imageSmoothingEnabled = false;
  }
  turn = (orientation: CreatureOrientation) => {
    if (this.sprite$) {
      this.sprite$.scale.x = orientation === 'left' ? 1 : -1;
    }
    if (this.creatureEffects) {
      this.creatureEffects.turn(orientation);
    }
  };
  moveInDirection = (direction: number) => {
    const radius = getMoveStepForSpeed(this.speed);
    const { x, z } = pointInDirection(
      this.$.position,
      direction,
      radius,
    );

    this.$.position.x = x;
    this.$.position.z = z;
  };
  calculateDamage = (opponent: Creature) =>
    Math.max(this.attack - opponent.defence, 0);
  dealDamage = (damage: number) => {
    this.health = Math.max(this.health - damage, 0);
    if (this.health === 0 && this.setState) {
      this.setState('dead');
    }
    if (this.creatureEffects) {
      this.creatureEffects.add('damage', `-${damage}`);
    }
  };
  setState?(state: CreatureStates) {}
  animate(delta: number) {
    if (this.creatureEffects) {
      this.creatureEffects.animate(delta);
    }
  }
}

export default Creature;
