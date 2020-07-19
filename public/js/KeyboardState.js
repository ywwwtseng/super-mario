const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
  constructor() {
    // Holds the current state of a given key.
    this.keyStates = new Map();
    // Holds the callback function for a key code.
    this.keyMap = new Map();
  }

  addMapping(code, callback) {
    this.keyMap.set(code, callback);
  }

  handleEvent(event) {
    if (!this.keyMap.has(event.code)) {
      // Did not have key mapped.
      return;
    }

    event.preventDefault();
    const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

    if (this.keyStates.get(event.code) === keyState) {
      return;
    }

    this.keyStates.set(event.code, keyState);
    this.keyMap.get(event.code)(keyState);
  }

  listenTo(window) {
    ['keydown', 'keyup'].forEach((eventName) => {
      window.addEventListener(eventName, (event)=> {
        this.handleEvent(event);
      });
    }); 
  }
}