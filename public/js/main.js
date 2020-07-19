import Timer from './Timer.js';
import {loadLevel} from './loaders.js';
import {createMario} from './entities.js';
import {createCollisionLayer} from './layers.js';
import {setupKeyborad} from './input.js';
import Keyboard from './KeyboardState.js';




const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
  createMario(),
  loadLevel('1-1'),
])
.then(([mario, level]) => {
  mario.pos.set(64, 180);

  level.entities.add(mario);

  // level.comp.layers.push(createCollisionLayer(level));
  
  const input = setupKeyborad(mario);
  input.listenTo(window);

  // ['mousedown', 'mousemove'].forEach(eventName => {
  //   canvas.addEventListener(eventName, event => {
  //     if (event.buttons === 1) {
  //       mario.vel.set(0, 0);
  //       mario.pos.set(event.offsetX, event.offsetY);
  //     }
  //   });
  // });

  const timer = new Timer(1/60);
  timer.update = function update(deltaTime) {
    level.update(deltaTime);
    level.comp.draw(context);
  }
  timer.start();
});
  