import { type CreatureStates } from 'game/utils/Types';
import { type GameContext } from 'game/Game';
import Creature from './Creature';
import {
  angleBetweenPoints,
  distanceBetweenPoints,
} from 'game/utils/Math';
import {
  mapMoveDirectionToTextureOrientation,
  getMoveStepForSpeed,
} from 'game/creature/CreatureHelpers';
import { AssetNames } from 'game/assets/AssetsLoaderHelpers';

const PlayerNoticeDistance = 5;
const PlayerAttackDistance = 1.3;

class Enemy extends Creature {
  state: CreatureStates;
  initialPosition: { x: number; y: number; z: number };
  context: GameContext;
  enemy: boolean;
  shouldTriggerAttack: boolean;
  attackTriggered: boolean;
  attackRadius: number;
  alive: boolean;
  experience: number;
  gold: number;
  deadElapsedTime: number;

  constructor(
    context: GameContext,
    {
      color,
      position,
      experience,
      gold,
    }: {
      color: string;
      position: { x: number; y: number; z: number };
      experience: number;
      gold: number;
    },
  ) {
    super({
      debug: context.debug,
      maxAnisotropy: context.maxAnisotropy,
      name: 'Enemy 1',
      color,
      speed: 20,
      health: 20,
      attack: 10,
      defence: 1,
    });

    this.context = context;
    this.initialPosition = position;
    this.$.position.set(position.x, position.y, position.z);
    this.state = 'idle';
    this.enemy = true;
    this.shouldTriggerAttack = false;
    this.attackTriggered = false;
    this.attackRadius = 1.3;
    this.alive = true;
    this.experience = experience;
    this.gold = gold;
    this.deadElapsedTime = 0;

    const spriteData =
      context.assetsLoader.assets[AssetNames.Nightborne];
    this.sprite.setAssetPath(spriteData.assetPath);
    this.sprite.setAnimations(spriteData.objects[0]);
    this.sprite.playContinuous('idle');
  }
  setState(newState: CreatureStates) {
    if (newState === this.state) return;

    if (newState === 'idle') {
      this.sprite.playContinuous('idle');
    } else if (newState === 'walking') {
      this.sprite.playContinuous('run');
    } else if (newState === 'chase') {
      this.sprite.playContinuous('run');
    } else if (newState === 'attack') {
      this.sprite.playContinuous('attack');
    } else if (newState === 'dying') {
      this.sprite.playAndStop('dying');
      this.alive = false;
      this.creatureEffects?.add('experience', this.experience);
    }

    this.state = newState;
  }
  animate(delta: number) {
    super.animate(delta);

    if (!this.context.map) return;

    const playerPosition = this.context.map.getPosition();
    const distanceToPlayer = distanceBetweenPoints(
      playerPosition,
      this.$.position,
    );
    const playerAlive = this.context?.player?.alive;
    const distanceToInitialPosition = distanceBetweenPoints(
      this.$.position,
      this.initialPosition,
    );

    switch (this.state) {
      case 'idle':
        if (
          this.alive &&
          playerAlive &&
          distanceToPlayer < PlayerNoticeDistance
        ) {
          this.setState('chase');
        }
        break;
      case 'chase':
        if (distanceToPlayer > PlayerNoticeDistance || !playerAlive) {
          this.setState('walking');
        } else if (distanceToPlayer < PlayerAttackDistance) {
          this.setState('attack');
        } else {
          const radians = angleBetweenPoints(
            this.$.position,
            playerPosition,
          );

          this.moveInDirection(radians);
          this.turn(mapMoveDirectionToTextureOrientation(radians));
        }
        break;
      case 'attack': {
        const attackAnimationFinished =
          this.sprite.animationFrame ===
          this.sprite.animationFrames.length - 1;

        if (attackAnimationFinished) {
          this.shouldTriggerAttack = false;
          this.attackTriggered = false;
        } else if (
          this.sprite.animationFrame >=
            Math.round(0.75 * this.sprite.animationFrames.length) &&
          !this.shouldTriggerAttack &&
          !this.attackTriggered
        ) {
          this.shouldTriggerAttack = true;
        }

        if (distanceToPlayer > PlayerNoticeDistance || !playerAlive) {
          this.setState('walking');
        }
        if (
          playerAlive &&
          distanceToPlayer < PlayerNoticeDistance &&
          distanceToPlayer > PlayerAttackDistance
        ) {
          this.attackTriggered = false;
          this.shouldTriggerAttack = false;
          this.setState('chase');
        }
        break;
      }
      case 'walking': {
        if (
          distanceToInitialPosition < getMoveStepForSpeed(this.speed)
        ) {
          this.$.position.x = this.initialPosition.x;
          this.$.position.z = this.initialPosition.z;
          this.setState('idle');
        } else {
          const radians = angleBetweenPoints(
            this.$.position,
            this.initialPosition,
          );

          this.moveInDirection(radians);
          this.turn(mapMoveDirectionToTextureOrientation(radians));
        }
        break;
      }
      case 'dying': {
        if (
          this.sprite.animationFrame ===
          this.sprite.animationFrames.length - 1
        ) {
          this.setState('dead');
        }
        break;
      }
      case 'dead': {
        this.deadElapsedTime += delta;

        // @ts-ignore
        if (!isNaN(this.sprite$?.material?.opacity)) {
          const opacity = Math.max(0, (4 - this.deadElapsedTime) / 2);
          // @ts-ignore
          this.sprite$.material.opacity = opacity;
          if (opacity === 0) {
            this.setState('to_remove');
          }
        }
        break;
      }
    }
  }
}

export default Enemy;
