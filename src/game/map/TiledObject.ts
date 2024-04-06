import * as THREE from 'three';
import { GameContext } from 'game/Game';
import { Point } from 'game/utils/Types';

class TiledObject {
  $: THREE.Mesh;
  context: GameContext;

  constructor(
    context: GameContext,
    {
      position,
    }: {
      position: Point;
    },
  ) {
    this.context = context;

    const geometrySprite = new THREE.PlaneGeometry(1, 2);
    const materialSprite = new THREE.MeshBasicMaterial({
      color: 'red',
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthTest: false,
    });
    this.$ = new THREE.Mesh(geometrySprite, materialSprite);
    this.$.position.set(position.x + 0.5, 0.5, position.z + 0.5);
  }
  animate() {}
}

export default TiledObject;
