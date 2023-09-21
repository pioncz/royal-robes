import * as THREE from 'three';
import { SpriteDataObject, Frame } from 'game/utils/Types';

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
  stopAfter?: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    texture: THREE.CanvasTexture,
    fps = 60,
  ) {
    this.canvas = canvas;
    this.texture = texture;
    this.ctx = this.canvas.getContext('2d');
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = false;
    }

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
  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
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
    this.resize(spriteData.width, spriteData.height);
  }
  play(name: string, replayTimes = 1, stopAfter = false) {
    const animation = this.spriteData?.animations.find(
      (animation) => animation.name === name,
    );

    if (!animation) {
      console.error(`Animation ${name} not found`);
      return;
    }

    if (!this.defaultAnimationName) {
      this.defaultAnimationName = this.animationName;
    }
    this.animationName = name;
    this.animationFrame = 0;
    this.animationFrames = animation?.frames || [];
    this.replayTimes = replayTimes;
    this.stopAfter = stopAfter;
  }
  playOnce(name: string) {
    this.play(name);
  }
  playContinuous(name: string) {
    this.play(name, Number.POSITIVE_INFINITY);
  }
  playAndStop(name: string) {
    this.play(name, Number.POSITIVE_INFINITY, true);
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

      if (
        this.stopAfter &&
        this.animationFrame === this.animationFrames.length - 1
      ) {
        return;
      }

      if (this.animationFrames.length) {
        this.animationFrame++;
        this.animationFrame =
          this.animationFrame % this.animationFrames.length;
        const frame = this.animationFrames[this.animationFrame];

        this.ctx.clearRect(
          0,
          0,
          this.canvas.width,
          this.canvas.height,
        );
        this.ctx.drawImage(
          this.assetImage,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
          0,
          0,
          this.canvas.width,
          this.canvas.height,
        );

        if (this.animationFrame === this.animationFrames.length - 1) {
          if (this.replayTimes !== Number.POSITIVE_INFINITY) {
            this.replayTimes--;
          }
          if (this.replayTimes === 0) {
            this.animationName = this.defaultAnimationName;
          }
        }
        this.texture.needsUpdate = true;
      }
    }

    this.delta = this.delta % this.interval;
  }
}

export default Sprite;
