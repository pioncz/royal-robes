// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listener = (args?: any) => void;

class EventsEmitter {
  events: Record<string, Listener[]>;

  constructor() {
    this.events = {};
  }

  on(event: string, listener: Listener) {
    if (typeof this.events[event] !== 'object') {
      this.events[event] = [];
    }

    this.events[event].push(listener);
  }

  off(event: string, listener: Listener) {
    let idx;

    if (typeof this.events[event] === 'object') {
      idx = this.events[event].indexOf(listener);

      if (idx > -1) {
        this.events[event].splice(idx, 1);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string, ...args: any) {
    let i, listeners, length;

    if (typeof this.events[event] === 'object') {
      listeners = this.events[event].slice();
      length = listeners.length;

      for (i = 0; i < length; i++) {
        listeners[i].apply(this, args);
      }
    }
  }

  once(event: string, listener: Listener) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (...args: any) => {
      this.off(event, g);
      listener.apply(this, args);
    };

    this.on(event, g);
  }
}

export default EventsEmitter;
