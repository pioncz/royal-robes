import * as THREE from 'three';
import AssetsLoader from './assets/AssetsLoader';
import Scene from './scene/Scene';
import GameControls from 'game/controls/GameControls';
import {
  degreesToRadians,
  getObjectsInRadius,
  distanceBetweenPoints,
} from 'game/utils/Math';
import Map from './map/Map';

const fpsInterval = 1 / 80;
const debug = true;

export type GameContext = {
  debug: boolean;
  maxAnisotropy: number;
  controls?: GameControls;
  assetsLoader: AssetsLoader;
};

class Main {
  assetsLoader: AssetsLoader;
  loadingAssets: boolean;
  scene?: Scene;
  context: GameContext;
  clock: THREE.Clock;
  lastAnimationTick: number;
  animationFrameId?: number;
  map?: Map;

  constructor({ containerId }: { containerId: string }) {
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
        this.map = new Map(this.context, { x: 20.5, z: 4 });
        this.scene.$.add(this.map.$);

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

    //   this.player = new Player({
    //     debug,
    //     maxAnisotropy: this.maxAnisotropy,
    //   });
    //   this.scene.add(this.player.$);

    //   this.npc = new Npc({
    //     debug,
    //     maxAnisotropy: this.maxAnisotropy,
    //     color: '#004400',
    //     position: { x: 3, y: 0.5, z: 1 },
    //   });
    //   this.map.addCreature(this.npc);

    //   this.enemies = [];
    //   this.enemy = new Enemy({
    //     debug,
    //     maxAnisotropy: this.maxAnisotropy,
    //     color: '#440000',
    //     position: { x: 28, y: 0.5, z: 2 },
    //   });
    //   this.map.addCreature(this.enemy);
    //   this.enemies.push(this.enemy);

    //   const nightborneSpriteData =
    //     this.assetsLoader.assets[AssetNames.Nightborne];

    //   this.player.sprite.setAssetPath(nightborneSpriteData.assetPath);
    //   this.player.sprite.setAnimations(
    //     nightborneSpriteData.objects[0],
    //   );
    //   this.player.sprite.playContinuous('idle');

    //   this.npc.sprite.setAssetPath(nightborneSpriteData.assetPath);
    //   this.npc.sprite.setAnimations(nightborneSpriteData.objects[0]);
    //   this.npc.sprite.playContinuous('idle');

    //   this.enemy.sprite.setAssetPath(nightborneSpriteData.assetPath);
    //   this.enemy.sprite.setAnimations(
    //     nightborneSpriteData.objects[0],
    //   );
    //   this.enemy.sprite.playContinuous('idle');

    //   this.loadingAssets = false;
    // });
  }

  animate(delta: number, elapsed: number) {
    this.animationFrameId = window.requestAnimationFrame(() =>
      this.animate(
        this.clock.getDelta(),
        this.clock.getElapsedTime(),
      ),
    );

    const elapsedDiff = elapsed - this.lastAnimationTick;
    if (elapsedDiff < fpsInterval) {
      return;
    }
    this.lastAnimationTick = elapsed;

    this.scene!.animate();

    const kUp = this.scene!.controls.keys.arrowUp;
    const kDown = this.scene!.controls.keys.arrowDown;
    const kLeft = this.scene!.controls.keys.arrowLeft;
    const kRight = this.scene!.controls.keys.arrowRight;
    const kSpace = this.scene!.controls.keys.space;

    if (kUp || kDown || kLeft || kRight) {
      // this.player.setState(States.walking);

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
      //      const radians = degreesToRadians(direction);

      //   this.player.turn(mapMoveDirectionToTextureOrientation(radians));

      //   this.map.movePlayerInDirection(
      //     degreesToRadians(direction),
      //     this.player.speed,
      //   );
    } else if (kSpace) {
      //      this.player.setState(States.attack);
    } else {
      //    this.player.setState(States.idle);
    }

    // // Calculate attacks
    // const playerPosition = this.map.getPosition();
    // if (
    //   this.player.shouldTriggerAttack &&
    //   !this.player.attackTriggered
    // ) {
    //   getObjectsInRadius(
    //     playerPosition,
    //     this.enemies,
    //     this.player.attackRadius,
    //   ).forEach((enemy) => {
    //     const damage = this.player.calculateDamage(enemy);
    //     enemy.dealDamage(damage);
    //     console.log('Enemy HP: ', enemy.health);
    //   });
    //   this.player.attackTriggered = true;
    // }
    // this.enemies.forEach((enemy) => {
    //   if (!enemy.shouldTriggerAttack || enemy.attackTriggered) {
    //     return;
    //   }
    //   const distanceToPlayer = distanceBetweenPoints(
    //     playerPosition,
    //     enemy.$.position,
    //   );
    //   if (distanceToPlayer < enemy.attackRadius) {
    //     const damage = enemy.calculateDamage(this.player);
    //     this.player.dealDamage(damage);
    //     enemy.attackTriggered = true;
    //     console.log('Player HP: ', this.player.health);
    //   }
    // });

    this.map!.animate(delta);
    // this.player.animate(delta);
    // this.npc.sprite.animate(delta);
    // this.enemy.sprite.animate(delta);
    this.scene!.composer.render();
    this.scene!.animateFinish();
  }

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
