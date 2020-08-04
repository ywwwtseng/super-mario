import Camera from './Camera.js';
import Timer from './Timer.js';
import {loadLevel} from './loaders.js';
import {createMario} from './entities.js';
// import {createCollisionLayer, createCameraLayer} from './layers.js';
import {setupKeyborad} from './input.js';
// import {setupMouseControl} from './debug.js';
import Keyboard from './KeyboardState.js';




const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
  createMario(),
  loadLevel('1-1'),
])
.then(([mario, level]) => {
  const camera = new Camera();

  mario.pos.set(64, 180);

  level.entities.add(mario);

  // level.comp.layers.push(
  //   createCollisionLayer(level),
  //   createCameraLayer(camera),
  // );
  
  const input = setupKeyborad(mario);
  input.listenTo(window);

  // setupMouseControl(canvas, mario, camera);

  const timer = new Timer(1/60);
  timer.update = function update(deltaTime) {
    level.update(deltaTime);

    if (mario.pos.x > 100) {
      camera.pos.x = mario.pos.x - 100;
    }

    level.comp.draw(context, camera);
  }
  timer.start();
});
  