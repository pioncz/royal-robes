import * as THREE from 'three';
import AssetsLoader from './assets/AssetsLoader';
import Scene from './scene/Scene';
import GameControls from 'game/controls/GameControls';
import {
  degreesToRadians,
  getObjectsInRadius,
} from 'game/utils/Math';
import Map from './map/Map';
import Player from './creature/Player';
import { mapMoveDirectionToTextureOrientation } from './creature/CreatureHelpers';
import Npc from './creature/Npc';
import Enemy from './creature/Enemy';
import EventsEmitted from './utils/EventsEmitter';
import EnemySpawner from './creature/EnemySpawner';
import { PlayerStatistics, Point } from './utils/Types';

const fpsInterval = 1 / 80;
const debug = true;

export type GameContext = {
  debug: boolean;
  maxAnisotropy: number;
  controls?: GameControls;
  assetsLoader: AssetsLoader;
  map?: Map;
  player?: Player;
};

class Main extends EventsEmitted {
  assetsLoader: AssetsLoader;
  loadingAssets: boolean;
  scene?: Scene;
  context: GameContext;
  clock: THREE.Clock;
  lastAnimationTick: number;
  animationFrameId?: number;
  map?: Map;
  player?: Player;
  npc?: Npc;
  enemySpawner?: EnemySpawner;

  constructor({
    containerId,
    name,
    position,
    gold,
    health,
    maxHealth,
    level,
    experience,
    attack,
    defense,
  }: {
    containerId: string;
    name: string;
    position: Point;
    gold: number;
    health: number;
    maxHealth: number;
    level: number;
    experience: number;
    attack: number;
    defense: number;
  }) {
    super();
    this.assetsLoader = new AssetsLoader();
    this.context = {
      debug,
      maxAnisotropy: 0,
      assetsLoader: this.assetsLoader,
    };
    this.loadingAssets = true;
    this.lastAnimationTick = 0;
    this.clock = new THREE.Clock();

    this.assetsLoader.load.then(
      () => {
        // Scene
        this.scene = new Scene(this.context, containerId);
        this.context.maxAnisotropy = this.scene.getMaxAnisotropy();
        this.context.controls = this.scene.controls;

        // Map
        this.map = new Map(this.context, {
          initialPosition: position,
          onPositionUpdate: (newPosition: Point) => {
            this.emit('positionUpdate', newPosition);
          },
        });
        this.scene.$.add(this.map.$);
        this.context.map = this.map;

        // Player
        this.player = new Player(
          this.context,
          {
            name,
            experience,
            gold,
            health,
            maxHealth,
            level,
            attack,
            defense,
          },
          (newStats) => {
            this.emit('playerUpdate', newStats);
          },
        );
        this.scene.$.add(this.player.$);
        this.context.player = this.player;

        // Npc
        this.npc = new Npc(this.context, {
          color: '#00ff00',
          position: { x: 13, y: 0.5, z: 91 },
        });
        this.map.$.add(this.npc.$);

        this.enemySpawner = new EnemySpawner(this.context, {
          amount: 3,
          radius: 2,
          delay: 5,
          origin: { x: 38, z: 92 },
        });

        this.loadingAssets = false;

        // Start main loop
        setTimeout(() => {
          this.animate(0, 0);
        }, 0);
      },
      () => {
        console.log('Assets load error');
      },
    );
  }

  animate(delta: number, elapsed: number) {
    this.animationFrameId = window.requestAnimationFrame(() =>
      this.animate(
        this.clock.getDelta(),
        this.clock.getElapsedTime(),
      ),
    );

    const elapsedDiff = elapsed - this.lastAnimationTick;
    if (
      elapsedDiff < fpsInterval ||
      !this.scene ||
      !this.map ||
      !this.player ||
      !this.enemySpawner ||
      !this.npc
    ) {
      return;
    }
    this.lastAnimationTick = elapsed;

    this.scene.animate();

    const kUp = this.scene.controls.keys.arrowUp;
    const kDown = this.scene.controls.keys.arrowDown;
    const kLeft = this.scene.controls.keys.arrowLeft;
    const kRight = this.scene.controls.keys.arrowRight;
    const kSpace = this.scene.controls.keys.space;

    if (this.player.alive) {
      if (kUp || kDown || kLeft || kRight) {
        this.player.setState('walking');

        let direction = 0;

        if (kUp && kRight) {
          direction = 315;
        } else if (kUp && kLeft) {
          direction = 225;
        } else if (kLeft && kDown) {
          direction = 135;
        } else if (kDown && kRight) {
          direction = 45;
        } else if (kUp) {
          direction = 270;
        } else if (kDown) {
          direction = 90;
        } else if (kRight) {
          direction = 0;
        } else if (kLeft) {
          direction = 180;
        }
        const radians = degreesToRadians(direction);

        this.player.turn(
          mapMoveDirectionToTextureOrientation(radians),
        );

        this.map.movePlayerInDirection(
          degreesToRadians(direction),
          this.player.speed,
        );
      } else if (kSpace) {
        this.player.setState('attack');
      } else {
        this.player.setState('idle');
      }

      // Calculate attacks
      const playerPosition = this.map.getPosition();
      if (
        this.player.shouldTriggerAttack &&
        !this.player.attackTriggered
      ) {
        getObjectsInRadius<Enemy>(
          playerPosition,
          this.enemySpawner.enemies,
          this.player.attackRadius,
        ).forEach((enemy) => {
          if (!enemy.alive) return;

          const damage = this.player!.calculateDamage(enemy);
          enemy.dealDamage(damage);

          if (!enemy.alive) {
            this.player?.receiveExperience(enemy.experience);
            this.player?.receiveLoot({ gold: enemy.gold });
          }

          console.log('Enemy HP: ', enemy.health);
        });
        this.player.attackTriggered = true;
      }
    }

    this.map.animate(delta);
    this.player.animate(delta);
    this.npc.animate(delta);
    this.enemySpawner.animate(delta);
    this.scene.composer.render();
    this.scene.animateFinish();
  }

  restart = (statistics: PlayerStatistics) => {
    this?.player?.restart(statistics);
  };

  remove = () => {
    this.assetsLoader.remove();
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
    this.animationFrameId = undefined;
    if (this.scene) {
      this.scene.remove();
    }
  };
}

export default Main;
