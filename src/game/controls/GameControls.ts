import EventsEmitter from 'game/utils/EventsEmitter';

class GameControls extends EventsEmitter {
  keys: Record<string, boolean>;

  constructor() {
    super();

    this.keys = {};

    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('keydown', this.onKeyDown);
  }
  onKeyDown = (e: KeyboardEvent) => {
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
  }
  onKeyUp = (e: KeyboardEvent) => {
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
  }
  remove() {
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('keydown', this.onKeyDown);
  }
}

export default GameControls;
