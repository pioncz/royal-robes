import * as THREE from 'three';
import { FontNames } from 'game/assets/AssetsLoaderHelpers';
import {
  type CreatureOrientation,
  type CreatureEffectsTextTypes,
  type CreatureEffectsTextAnimation,
} from 'game/utils/Types';

class CreatureEffects {
  maxAnisotropy: number;
  texts: CreatureEffectsTextAnimation[];
  size: number;
  ctx: CanvasRenderingContext2D | null;
  orientation: CreatureOrientation;
  texture: THREE.Texture;
  $: THREE.Mesh;

  constructor(maxAnisotropy: number) {
    this.maxAnisotropy = maxAnisotropy;
    this.texts = [];
    this.size = 256;
    this.orientation = 'right';

    const geometry = new THREE.PlaneGeometry(1, 1);
    const canvas = document.createElement('canvas');
    canvas.width = this.size;
    canvas.height = this.size;

    this.texture = new THREE.CanvasTexture(canvas);
    this.texture.anisotropy = this.maxAnisotropy;
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.LinearMipMapLinearFilter;
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
  add(type: CreatureEffectsTextTypes, value: string) {
    if (this.texts.length) return;

    this.texts.push({
      type,
      value: value,
      lengthLeft: 1,
      length: 1,
      orientation: this.orientation,
    });
  }
  animate(delta: number) {
    if (!this.ctx || !this.texts.length || !this.texture) return;

    this.ctx.clearRect(0, 0, this.size, this.size);

    for (let i = this.texts.length - 1; i >= 0; i--) {
      const text = this.texts[i];
      const progress = 1 - text.lengthLeft / text.length;

      if (text.lengthLeft <= 0) {
        this.texts.splice(i, 1);
      } else if (text.type === 'damage') {
        const y = Math.round(80 + 140 * (1 - progress));
        const x = text.orientation === 'left' ? 10 : this.size - 10;

        this.ctx.textAlign =
          text.orientation === 'left' ? 'start' : 'end';
        this.ctx.font = `72px ${FontNames.ExpressionPro}`;
        this.ctx.fillStyle = '#6d0000';
        this.ctx.lineWidth = 8;
        this.ctx.strokeStyle = '#000000';
        this.ctx.strokeText(text.value, x, y);
        this.ctx.fillText(text.value, x, y);
      }

      text.lengthLeft -= delta;
    }
    this.texture.needsUpdate = true;
  }
}

export default CreatureEffects;
