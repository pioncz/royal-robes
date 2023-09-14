import * as THREE from 'three';
import { SpriteDataObject, Frame } from 'game/utils/Types'

class Sprite {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  texture: THREE.CanvasTexture;
  ctx: CanvasRenderingContext2D | null;
  interval: number;
  delta: number;
  assetImage: HTMLImageElement | null;
  animationName: string | null;
  animationFrame: number;
  animationFrames: Frame[];
  defaultAnimationName: string | null;
  replayTimes: number;
  spriteData?: SpriteDataObject;

  constructor(canvas: HTMLCanvasElement, texture: THREE.CanvasTexture, fps = 60) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.texture = texture;
    this.ctx = this.canvas.getContext('2d');

    // fps count = 1 / ms interval in animation loop
    this.interval = 1 / fps;
    this.delta = 0;

    this.assetImage = null;
    this.animationName = null;
    this.animationFrame = 0;
    this.animationFrames = [];
    this.defaultAnimationName = null;
    this.replayTimes = 0;
  }
  setAssetImage(image: HTMLImageElement) {
    this.assetImage = image;
  }
  setAssetPath(assetPath: string) {
    const loader = new THREE.ImageLoader();
    loader.load(
      assetPath,
      (image) => {
        this.assetImage = image;
      },
      undefined,
      function () {
        console.error('An error happened.');
      },
    );
  }
  setAnimations(spriteData: SpriteDataObject) {
    this.spriteData = spriteData;
  }
  play(name: string, replayTimes = 1) {
    const animation = this.spriteData?.animations.find(
      (animation) => animation.name === name,
    );

    if (!this.defaultAnimationName) {
      this.defaultAnimationName = this.animationName;
    }
    this.animationName = name;
    this.animationFrame = 0;
    this.animationFrames = animation?.frames || [];
    this.replayTimes = replayTimes;
  }
  playOnce(name: string) {
    this.play(name);
  }
  playContinuous(name: string) {
    this.play(name, Number.POSITIVE_INFINITY);
  }
  stop() {
    this.animationName = null;
  }
  setFps(fps: number) {
    this.interval = 1 / fps;
  }
  animate(delta: number) {
    this.delta += delta;

    if (!this.ctx) return;

    if (
      this.delta >= this.interval &&
      this.assetImage &&
      this.spriteData &&
      this.spriteData.animations &&
      this.animationName
    ) {
      if (!this.animationFrames) {
        const animation = this.spriteData?.animations.find(
          (animation) => animation.name === this.animationName,
        );
        this.animationFrames = animation?.frames || [];
      }

      if (this.animationFrames.length) {
        this.animationFrame++;
        this.animationFrame =
          this.animationFrame % this.animationFrames.length;
        const frame = this.animationFrames[this.animationFrame];

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(
          this.assetImage,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
          0,
          0,
          this.width,
          this.height,
        );

        if (this.animationFrame === this.animationFrames.length - 1) {
          if (this.replayTimes !== Number.POSITIVE_INFINITY) {
            this.replayTimes--;
          }
          if (this.replayTimes === 0) {
            this.animationName = this.defaultAnimationName;
          }
        }
      }
      this.texture.needsUpdate = true;
    }

    this.delta = this.delta % this.interval;
  }
}

export default Sprite;
