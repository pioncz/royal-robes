import * as THREE from 'three';
import { FontNames } from 'game/assets/AssetsLoaderHelpers';
import {
  type CreatureOrientation,
  type CreatureEffectsTextTypes,
} from 'game/utils/Types';
import Animation from 'game/utils/Animation';

class CreatureEffects {
  maxAnisotropy: number;
  textAnimations: Animation[];
  size: number;
  ctx: CanvasRenderingContext2D | null;
  orientation: CreatureOrientation;
  texture: THREE.Texture;
  $: THREE.Mesh;

  constructor(maxAnisotropy: number) {
    this.maxAnisotropy = maxAnisotropy;
    this.textAnimations = [];
    this.size = 512;
    this.orientation = 'right';

    const geometry = new THREE.PlaneGeometry(1, 2);
    const canvas = document.createElement('canvas');
    canvas.width = this.size;
    canvas.height = this.size;

    this.texture = new THREE.CanvasTexture(canvas);
    this.texture.anisotropy = this.maxAnisotropy;
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.NearestFilter;
    // Disable mipmapping to prevent blurring
    this.texture.generateMipmaps = false;
    const material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthTest: false,
    });
    this.$ = new THREE.Mesh(geometry, material);

    this.ctx = canvas.getContext('2d');
    if (!this.ctx) {
      console.error('Failed to retrieve context 2d from canvas');
      return;
    }
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.clearRect(0, 0, this.size, this.size);
  }
  turn(orientation: CreatureOrientation) {
    this.orientation = orientation;
  }
  add(
    type: CreatureEffectsTextTypes,
    value: string | number,
    duration = 1,
  ) {
    this.textAnimations.push(
      new Animation({
        duration,
        data: {
          type,
          value,
          orientation: this.orientation,
        },
      }),
    );
  }
  animate(delta: number) {
    if (!this.ctx || !this.textAnimations.length || !this.texture)
      return;

    this.ctx.clearRect(0, 0, this.size, this.size);

    for (let i = this.textAnimations.length - 1; i >= 0; i--) {
      const animation = this.textAnimations[i];

      animation.animate(
        delta,
        ({
          progress,
          finished,
          data: { type, orientation, value },
        }) => {
          if (!this.ctx) return;

          if (finished) {
            this.textAnimations.splice(i, 1);
          } else if (type === 'damage') {
            const y = Math.round(160 + 140 * (1 - progress));
            const x = orientation === 'left' ? 20 : this.size - 20;

            this.ctx.textAlign =
              orientation === 'left' ? 'start' : 'end';
            this.ctx.font = `92px ${FontNames.ExpressionPro}`;
            this.ctx.fillStyle = '#6d0000';
            this.ctx.lineWidth = 8;
            this.ctx.strokeStyle = '#000000';
            this.ctx.strokeText(value, x, y);
            this.ctx.fillText(value, x, y);
          } else if (type === 'experience') {
            const y = Math.round(160 + 140 * (1 - progress));
            const x = orientation === 'left' ? 20 : this.size - 20;
            const text = `+${value}exp`;

            this.ctx.textAlign =
              orientation === 'left' ? 'start' : 'end';
            this.ctx.font = `92px ${FontNames.ExpressionPro}`;
            this.ctx.fillStyle = '#CECECE';
            this.ctx.lineWidth = 8;
            this.ctx.strokeStyle = '#000000';
            this.ctx.strokeText(text, x, y);
            this.ctx.fillText(text, x, y);
          } else if (type === 'level_up') {
            const y = Math.round(160 + 140 * (1 - progress));
            const x = this.size / 2;
            const text = value;

            this.ctx.textAlign = 'center';
            this.ctx.font = `92px ${FontNames.ExpressionPro}`;
            this.ctx.fillStyle = '#FFD900';
            this.ctx.lineWidth = 8;
            this.ctx.strokeStyle = '#000000';
            this.ctx.strokeText(text, x, y);
            this.ctx.fillText(text, x, y);
          }
        },
      );
    }
    this.texture.needsUpdate = true;
  }
}

export default CreatureEffects;
