import * as THREE from 'three';
import Creature from './Creature';
import {
  EnemyLoot,
  type CreatureStates,
  type PlayerStatistics,
} from 'game/utils/Types';
import { type GameContext } from 'game/Game';
import { AssetNames } from 'game/assets/AssetsLoaderHelpers';
import Animation from 'game/utils/Animation';
import { getExperienceForLevel } from 'game/utils/Level';

class Player extends Creature {
  state: CreatureStates;
  shouldTriggerAttack: boolean;
  attackTriggered: boolean;
  attackRadius: number;
  alive: boolean;
  onUpdate: (newStats: PlayerStatistics) => void;
  context: GameContext;
  light: THREE.PointLight;
  fadeLightOnDeathAnimation: Animation | null;
  gold: number;
  level: number;
  experience: number;

  constructor(
    context: GameContext,
    {
      gold,
      name,
      experience,
      level,
      health,
      maxHealth,
      attack,
      defense,
    }: {
      gold: number;
      name: string;
      experience: number;
      level: number;
      health: number;
      maxHealth: number;
      attack: number;
      defense: number;
    },
    onUpdate: (newStats: PlayerStatistics) => void,
  ) {
    super({
      name,
      debug: context.debug,
      maxAnisotropy: context.maxAnisotropy,
      attack,
      defense,
      health,
      maxHealth,
    });

    this.$.position.set(0, 0.5, 0);

    this.light = new THREE.PointLight('#F9DDFF', 0.4, 8, 0.1);
    this.light.position.set(0, 0.8, 0);
    this.$.add(this.light);

    this.state = 'idle';
    this.shouldTriggerAttack = false;
    this.attackTriggered = false;
    this.attackRadius = 1.3;
    this.alive = true;
    this.onUpdate = onUpdate;
    this.context = context;
    this.fadeLightOnDeathAnimation = null;
    this.gold = gold;
    this.experience = experience;
    this.level = level;

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
      this.sprite.setFps(10);
      this.sprite.playContinuous('idle');
    } else if (newState === 'attack') {
      this.sprite.setFps(60);
      this.sprite.playOnce('attack');
    } else if (newState === 'walking') {
      this.sprite.setFps(10);
      this.sprite.playContinuous('run');
    } else if (newState === 'dying') {
      this.sprite.setFps(10);
      this.alive = false;
      this.sprite.playAndStop('dying');
      this.fadeLightOnDeathAnimation = new Animation({
        duration: 1,
      });
    } else if (newState === 'dead') {
      this.sprite.setFps(10);
      this.handleUpdate();
    }

    if (newState !== 'attack') {
      this.shouldTriggerAttack = false;
      this.attackTriggered = false;
    }

    this.state = newState;
  }
  dealDamage(value: number) {
    super.dealDamage(value);
    this.handleUpdate();
  }
  handleUpdate() {
    this.onUpdate({
      alive: this.alive,
      gold: this.gold,
      health: this.health,
      maxHealth: this.maxHealth,
      experience: this.experience,
      attack: this.attack,
      defense: this.defense,
      level: this.level,
    });
  }
  restart(statistics: PlayerStatistics) {
    this.state = 'idle';
    this.sprite.playContinuous('idle');
    this.context?.map?.restart();
    this.alive = true;
    this.health = statistics.health;
    this.maxHealth = statistics.maxHealth;
    this.level = statistics.level;
    this.experience = statistics.experience;
    this.gold = statistics.gold;
    this.defense = statistics.defense;
    this.attack = statistics.attack;
    this.creatureHeader.setHealth(this.health);

    this.handleUpdate();
  }
  receiveLoot(loot: EnemyLoot) {
    this.gold += loot?.gold || 0;
    this.handleUpdate();
  }
  levelUp() {
    this.level += 1;
    this.health = this.maxHealth;
    this?.creatureEffects?.add('level_up', `LEVEL UP!`, 2);
  }
  receiveExperience(experience: number) {
    this.experience += experience;
    let experienceForNextLevel = getExperienceForLevel(
      this.level + 1,
    );

    while (experienceForNextLevel <= this.experience) {
      this.levelUp();
      experienceForNextLevel = getExperienceForLevel(this.level + 1);
    }

    this.handleUpdate();
  }
  animate(delta: number) {
    super.animate(delta);

    if (this.fadeLightOnDeathAnimation) {
      this.fadeLightOnDeathAnimation.animate(
        delta,
        ({ progress, finished }) => {
          this.light.intensity = 1 * (1 - progress);

          if (finished) {
            this.fadeLightOnDeathAnimation = null;
            this.setState('dead');
          }
        },
      );
    }

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
