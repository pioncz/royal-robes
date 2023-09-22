import Creature from './Creature';
import { type GameContext } from 'game/Game';
import { type CreatureStates } from 'game/utils/Types';
import {
  angleBetweenPoints,
  distanceBetweenPoints,
} from 'game/utils/Math';
import {
  mapMoveDirectionToTextureScale,
  getMoveStepForSpeed,
} from 'game/creature/CreatureHelpers';
import { AssetNames } from 'game/assets/AssetsLoaderHelpers';

const EventRadius = 5;
const DialogTypes = {
  greetings: 'greetings',
  farewells: 'farewells',
};

class Npc extends Creature {
  state: CreatureStates;
  dialogs: Record<string, Array<string | ((name: string) => string)>>;
  walkPositions: Array<{ x: number; z: number }>;
  lastPosition: number;
  targetPosition: number;
  name: string;
  context: GameContext;

  constructor(
    context: GameContext,
    {
      color,
      position,
    }: {
      color: string;
      position: { x: number; y: number; z: number };
    },
  ) {
    super({
      name: 'Npc 1',
      debug: context.debug,
      maxAnisotropy: context.maxAnisotropy,
      color,
      speed: 20,
      creatureEffects: false,
    });

    this.context = context;
    this.state = 'idle';
    this.dialogs = {
      greetings: [
        (name) => `Hi, I'm ${name}. Supp?`,
        'Hey.',
        'Hello!',
      ],
      farewells: ['Goodbye', 'Farewell'],
    };

    this.$.position.set(position.x, position.y, position.z);

    this.walkPositions = [
      { x: position.x, z: position.z },
      { x: position.x, z: position.z + 4 },
      { x: position.x + 10, z: position.z + 4 },
    ];
    this.lastPosition = 0;
    this.targetPosition = 1;

    const spriteData =
      context.assetsLoader.assets[AssetNames.Nightborne];
    this.sprite.setAssetPath(spriteData.assetPath);
    this.sprite.setAnimations(spriteData.objects[0]);
    this.sprite.playContinuous('idle');
  }

  getDialog(type = 'greetings') {
    const messages = this.dialogs[type];
    const random = Math.floor(Math.random() * messages.length);
    const message = messages[random];
    if (message instanceof Function) {
      return message(this.name);
    } else {
      return message;
    }
  }
  setState(newState: CreatureStates) {
    if (newState === this.state) return;

    if (newState === 'talking') {
      const greeting = this.getDialog(DialogTypes.greetings);
      console.log(greeting);
      this.sprite.playContinuous('idle');
    }
    if (this.state === 'talking') {
      const greeting = this.getDialog(DialogTypes.farewells);
      console.log(greeting);
      this.sprite.playContinuous('idle');
    }
    if (newState === 'walking') {
      this.sprite.playContinuous('run');
    }

    this.state = newState;
  }
  animate(delta: number) {
    super.animate(delta);

    const isPlayerInRadius = this.context.map?.isPlayerInRadius(
      this.$.position,
      EventRadius,
    );

    if (isPlayerInRadius) {
      this.setState('talking');
    } else {
      this.setState('walking');
    }

    if (this.state === 'walking') {
      const startPosition = this.$.position;
      const endPosition = this.walkPositions[this.targetPosition];
      const distance = distanceBetweenPoints(
        startPosition,
        endPosition,
      );
      const moveStep = getMoveStepForSpeed(this.speed);

      if (distance < moveStep) {
        this.$.position.x = endPosition.x;
        this.$.position.z = endPosition.z;
        this.lastPosition = this.targetPosition;
        this.targetPosition++;
        if (this.targetPosition >= this.walkPositions.length) {
          this.targetPosition = 0;
        }
      } else {
        const radians = angleBetweenPoints(
          startPosition,
          endPosition,
        );

        this.moveInDirection(radians);
        this.sprite$.scale.x =
          mapMoveDirectionToTextureScale(radians);
      }
    }
  }
}

export default Npc;
