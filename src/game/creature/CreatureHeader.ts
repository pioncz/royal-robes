import * as THREE from 'three';
import { FontNames } from 'game/assets/AssetsLoaderHelpers';

class CreatureHeader {
  name: string;
  health: number;
  maxHealth: number;
  ctx: CanvasRenderingContext2D | null;
  texture: THREE.CanvasTexture;
  $: THREE.Mesh;
  width: number;
  height: number;

  constructor({
    maxAnisotropy,
    name,
    health,
    maxHealth,
  }: {
    maxAnisotropy: number;
    name: string;
    health: number;
    maxHealth: number;
  }) {
    this.name = name;
    this.health = health;
    this.maxHealth = maxHealth;

    const size = 512;
    const width = 2;
    const height = 0.5;
    const geometry = new THREE.PlaneGeometry(width, height);
    const canvas = document.createElement('canvas');
    this.width = size * width;
    this.height = size * height;
    canvas.width = this.width;
    canvas.height = this.height;
    this.texture = new THREE.CanvasTexture(canvas);
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

    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = false;
    }

    this.redraw();
  }
  setHealth(health: number) {
    this.health = health;
    this.redraw();
  }
  redraw() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const x = this.width / 2;
    const y = 14;
    this.ctx.textBaseline = 'top';
    this.ctx.textAlign = 'center';
    this.ctx.font = `124px ${FontNames.m5x7}`;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.lineWidth = 14;
    this.ctx.strokeStyle = '#000000';
    this.ctx.strokeText(this.name.toUpperCase(), x, y);
    this.ctx.fillText(this.name.toUpperCase(), x, y);

    const hpBarX = this.width / 4;
    const hpBarY = 160;
    const hpBarHeight = 50;
    const hpBarBorder = 5;
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(hpBarX, hpBarY, this.width / 2, hpBarHeight);

    const fillPercentage = this.health / this.maxHealth;
    const hue = fillPercentage * 110;
    const fillWidth = Math.max(
      (this.width / 2) * fillPercentage - 2 * hpBarBorder,
      0,
    );
    this.ctx.fillStyle = `hsl(${hue}deg 100% 20.59%)`;
    this.ctx.fillRect(
      hpBarX + hpBarBorder,
      hpBarY + hpBarBorder,
      fillWidth,
      hpBarHeight - 2 * hpBarBorder,
    );

    this.texture.needsUpdate = true;
  }
}

export default CreatureHeader;
