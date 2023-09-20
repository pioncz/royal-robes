import Enemy from 'game/creature/Enemy';
import { type GameContext } from 'game/Game';
import { type Point } from 'game/utils/Types';
import { distanceBetweenPoints } from 'game/utils/Math';

class EnemySpawner {
  context: GameContext;
  amount: number;
  radius: number;
  delay: number;
  enemies: Enemy[];
  origin: Point;
  delayElapsed: number;

  constructor(
    context: GameContext,
    {
      amount,
      radius = 5,
      delay = 10,
      origin,
    }: {
      amount: number;
      origin: Point;
      radius?: number;
      delay?: number;
    },
  ) {
    this.context = context;
    this.amount = amount;
    this.radius = radius;
    this.delay = delay;
    this.enemies = [];
    this.origin = origin;
    this.delayElapsed = 0;

    for (let i = 0; i < amount; i++) {
      this.spawnEnemy();
    }
  }
  spawnEnemy() {
    const randomAngle = Math.random() * Math.PI * 2;
    const randomRadius = Math.random() * this.radius;
    const x = this.origin.x + Math.cos(randomAngle) * randomRadius;
    const z = this.origin.z + Math.sin(randomAngle) * randomRadius;
    const newEnemy = new Enemy(this.context, {
      color: '#ff0000',
      position: { x, y: 0.5, z },
      gold: 5,
      experience: 20,
    });
    this.enemies.push(newEnemy);
    this.context?.map?.$.add(newEnemy.$);
  }
  removeEnemy(enemyIdx: number) {
    const enemy = this.enemies[enemyIdx];
    if (!enemy) return;
    this.context?.map?.$.remove(enemy.$);
    this.enemies.splice(enemyIdx, 1);
  }
  animate(delta: number) {
    const playerPosition = this.context?.map?.getPosition();

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      if (
        playerPosition &&
        enemy.alive &&
        enemy.shouldTriggerAttack &&
        !enemy.attackTriggered &&
        this.context.player
      ) {
        const distanceToPlayer = distanceBetweenPoints(
          playerPosition,
          enemy.$.position,
        );
        if (distanceToPlayer < enemy.attackRadius) {
          const damage = enemy.calculateDamage(this.context.player);
          this.context.player.dealDamage(damage);
          enemy.attackTriggered = true;
          console.log('Player HP: ', this.context.player.health);
        }
      }
      if (enemy.state === 'to_remove') {
        this.removeEnemy(i);
      }

      enemy.animate(delta);
    }

    if (this.enemies.length < this.amount) {
      if (this.delayElapsed >= this.delay) {
        this.spawnEnemy();
        this.delayElapsed = 0;
      } else {
        this.delayElapsed += delta;
      }
    }
  }
}

export default EnemySpawner;
