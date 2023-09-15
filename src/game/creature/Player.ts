import * as THREE from 'three';
import Creature from './Creature';
import { type CreatureStates } from 'game/utils/Types';

class Player extends Creature {
  state: CreatureStates;
  shouldTriggerAttack: boolean;
  attackTriggered: boolean;
  attackRadius: number;

  constructor({
    debug,
    maxAnisotropy,
  }: {
    debug: boolean;
    maxAnisotropy: number;
  }) {
    super({ debug, maxAnisotropy, attack: 15, defence: 4 });

    this.$.position.set(0, 0.5, 0);

    const pointLight = new THREE.PointLight('#F9DDFF', 0.5, 8, 2);
    pointLight.position.set(0, 0.8, 0);
    this.$.add(pointLight);

    this.state = 'walking';
    this.shouldTriggerAttack = false;
    this.attackTriggered = false;
    this.attackRadius = 1.3;
  }
  setState(newState: CreatureStates) {
    if (
      newState === this.state ||
      (this.state === 'attack' &&
        this.sprite.animationName === 'attack')
    )
      return;
  }
  animate(delta: number) {
    super.animate(delta);
    this.sprite.animate(delta);

    if (
      this.sprite.animationName === 'attack' &&
      this.sprite.animationFrame >=
        Math.round(0.75 * this.sprite.animationFrames.length) &&
      !this.shouldTriggerAttack
    ) {
      this.shouldTriggerAttack = true;
    }
  }
}

export default Player;
