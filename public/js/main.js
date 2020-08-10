import Camera from './Camera.js';
import Entity from './Entity.js';
import PlayerController from './traits/PlayerController.js';
import Timer from './Timer.js';
import {createLevelLoader} from './loaders/level.js';
import {loadEntities} from './entities.js';
import {createCollisionLayer} from './layers/collection.js';
import {setupKeyborad} from './input.js';
import Keyboard from './KeyboardState.js';

function createPlayerEnv(playerEntity) {
  const playerEnv = new Entity();
  const playerController = new PlayerController();
  playerController.checkpoint.set(64, 64);
  playerController.setPlayer(playerEntity);
  playerEnv.addTrait(playerController);
  return playerEnv;
}

async function main() {
  const context = canvas.getContext('2d');
  const entityFactory = await loadEntities();
  const loadLevel = await createLevelLoader(entityFactory);
  const level = await loadLevel('1-1');

  const camera = new Camera();

  const mario = entityFactory.mario();

  const playerEnv = new createPlayerEnv(mario);
  level.entities.add(playerEnv);

  level.comp.layers.push(
    createCollisionLayer(level),
  );
  
  const input = setupKeyborad(mario);
  input.listenTo(window);

  const timer = new Timer(1/60);
  timer.update = function update(deltaTime) {
    level.update(deltaTime);

    camera.pos.x = Math.max(0, mario.pos.x - 100);

    level.comp.draw(context, camera);
  }

  timer.start();
}

const canvas = document.getElementById('screen');
main();
  