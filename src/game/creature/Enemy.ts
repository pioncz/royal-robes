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
  name: string;
  context: GameContext;
  enemy: boolean;
  shouldTriggerAttack: boolean;
  attackTriggered: boolean;
  attackRadius: number;
  alive: boolean;
  experience: number;
  gold: number;

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
      color,
      speed: 20,
      health: 20,
      attack: 10,
      defence: 1,
    });

    this.context = context;
    this.initialPosition = position;
    this.$.position.set(position.x, position.y, position.z);
    this.name = 'Enemy 1';
    this.state = 'idle';
    this.enemy = true;
    this.shouldTriggerAttack = false;
    this.attackTriggered = false;
    this.attackRadius = 1.3;
    this.alive = true;
    this.experience = experience;
    this.gold = gold;

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

    if (!this.context.map || !this.alive) return;

    const playerPosition = this.context.map.getPosition();
    const distanceToPlayer = distanceBetweenPoints(
      playerPosition,
      this.$.position,
    );
    const playerAlive = this.context?.player?.alive;

    if (
      distanceToPlayer < PlayerNoticeDistance &&
      this.state === 'idle' &&
      playerAlive
    ) {
      this.setState('chase');
    } else if (
      (distanceToPlayer > PlayerNoticeDistance || !playerAlive) &&
      (this.state === 'chase' || this.state === 'attack')
    ) {
      this.setState('walking');
    } else if (
      playerAlive &&
      distanceToPlayer < PlayerNoticeDistance &&
      distanceToPlayer > PlayerAttackDistance &&
      this.state === 'attack'
    ) {
      this.attackTriggered = false;
      this.shouldTriggerAttack = false;
      this.setState('chase');
    }

    if (this.state === 'chase') {
      const startPosition = this.$.position;
      const playerPosition = this.context.map.getPosition();
      const distance = distanceBetweenPoints(
        startPosition,
        playerPosition,
      );

      if (distance < PlayerAttackDistance) {
        this.setState('attack');
      } else {
        const radians = angleBetweenPoints(
          startPosition,
          playerPosition,
        );

        this.moveInDirection(radians);
        this.turn(mapMoveDirectionToTextureOrientation(radians));
      }
    }
    if (this.state === 'walking') {
      const startPosition = this.$.position;
      const endPosition = this.initialPosition;
      const distance = distanceBetweenPoints(
        startPosition,
        endPosition,
      );
      const moveStep = getMoveStepForSpeed(this.speed);

      if (distance < moveStep) {
        this.$.position.x = endPosition.x;
        this.$.position.z = endPosition.z;
        this.setState('idle');
      } else {
        const radians = angleBetweenPoints(
          startPosition,
          endPosition,
        );

        this.moveInDirection(radians);
        this.turn(mapMoveDirectionToTextureOrientation(radians));
      }
    }
    if (
      this.sprite.animationName === 'attack' &&
      this.sprite.animationFrame >=
        Math.round(0.75 * this.sprite.animationFrames.length) &&
      !this.shouldTriggerAttack &&
      !this.attackTriggered
    ) {
      this.shouldTriggerAttack = true;
    }
    if (
      this.sprite.animationName === 'attack' &&
      this.sprite.animationFrame ===
        this.sprite.animationFrames.length - 1
    ) {
      this.shouldTriggerAttack = false;
      this.attackTriggered = false;
    }
  }
}

export default Enemy;
