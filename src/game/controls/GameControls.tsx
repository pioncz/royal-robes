import EventsEmitter from './EventsEmitter';

class GameControls extends EventsEmitter {
  constructor(camera, domElement) {
    super();
    this.mouse = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.startRotation = { x: 0, y: 0 };
    this.camera = camera;
    this.windowHalf = new THREE.Vector2(
      window.innerWidth / 2,
      window.innerHeight / 2,
    );
    this.mouseDown = false;
    this.keys = {};

    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('mousedown', this.onMouseDown, false);
    document.addEventListener('mouseup', this.onMouseUp, false);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('keydown', this.onKeyDown);
  }
  onKeyDown = (e) => {
    let returnKey = e.key;

    if (e.key === 'ArrowDown' || e.key === 's') {
      this.keys.arrowDown = true;
      returnKey = 'ArrowDown';
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
      this.keys.arrowUp = true;
      returnKey = 'ArrowUp';
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
      this.keys.arrowLeft = true;
      returnKey = 'ArrowLeft';
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      this.keys.arrowRight = true;
      returnKey = 'ArrowRight';
    } else if (e.key === ' ') {
      this.keys.space = true;
      returnKey = 'Space';
    } else {
      this.keys[e.key] = true;
    }
    this.emit('keydown', { key: returnKey });
  };
  onKeyUp = (e) => {
    let returnKey = e.key;

    if (e.key === 'ArrowDown' || e.key === 's') {
      this.keys.arrowDown = false;
      returnKey = 'ArrowDown';
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
      this.keys.arrowUp = false;
      returnKey = 'ArrowUp';
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
      this.keys.arrowLeft = false;
      returnKey = 'ArrowLeft';
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      this.keys.arrowRight = false;
      returnKey = 'ArrowRight';
    } else if (e.key === ' ') {
      this.keys.space = false;
      returnKey = 'Space';
    } else {
      this.keys[e.key] = false;
    }
    this.emit('keyup', { key: returnKey });
  };
  onMouseDown = () => {
    this.mouseDown = true;
    this.startRotation.x = this.camera.rotation.x;
    this.startRotation.y = this.camera.rotation.y;
  };
  onMouseUp = () => {
    this.mouseDown = false;
  };
  onMouseMove = (e) => {
    this.mouse.x = e.clientX - this.windowHalf.x;
    this.mouse.y = e.clientY - this.windowHalf.x;
  };
  update() {}
  dispose() {
    document.removeEventListener('mousemove', onMouseMove, false);
  }
}

export default GameControls;
