import * as THREE from 'three';
import Creature from './Creature';
import { type CreatureStates } from 'game/utils/Types';
import { type GameContext } from 'game/Game';
import { AssetNames } from 'game/assets/AssetsLoaderHelpers';

class Player extends Creature {
  state: CreatureStates;
  shouldTriggerAttack: boolean;
  attackTriggered: boolean;
  attackRadius: number;

  constructor(context: GameContext) {
    super({
      debug: context.debug,
      maxAnisotropy: context.maxAnisotropy,
      attack: 15,
      defence: 4,
    });

    this.$.position.set(0, 0.5, 0);

    const pointLight = new THREE.PointLight('#F9DDFF', 0.5, 8, 2);
    pointLight.position.set(0, 0.8, 0);
    this.$.add(pointLight);

    this.state = 'idle';
    this.shouldTriggerAttack = false;
    this.attackTriggered = false;
    this.attackRadius = 1.3;

    const spriteData =
      context.assetsLoader.assets[AssetNames.Nightborne];
    this.sprite.setAssetPath(spriteData.assetPath);
    this.sprite.setAnimations(spriteData.objects[0]);
    this.sprite.playContinuous('idle');
  }
  setState(newState: CreatureStates) {
    if (
      newState === this.state ||
      (this.state === 'attack' &&
        this.sprite.animationName === 'attack')
    )
      return;

    if (newState === 'idle') {
      this.sprite.playContinuous('idle');
    } else if (newState === 'attack') {
      this.sprite.playOnce('attack');
    } else if (newState === 'walking') {
      this.sprite.playContinuous('run');
    }

    if (newState !== 'attack') {
      this.shouldTriggerAttack = false;
      this.attackTriggered = false;
    }

    this.state = newState;
  }
  animate(delta: number) {
    super.animate(delta);

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
