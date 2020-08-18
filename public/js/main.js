import Level from './Level.js';
import Timer from './Timer.js';
import {createLevelLoader} from './loaders/level.js';
import {loadFont} from './loaders/font.js';
import {loadEntities} from './entities.js';
import {createPlayer, createPlayerEnv} from './player.js';
import {createColorLayer} from './layers/color.js';
import {createCollisionLayer} from './layers/collection.js';
import {createTextLayer} from './layers/text.js';
import {createDashboardLayer} from './layers/dashboard.js';
import {setupKeyborad} from './input.js';
import Keyboard from './KeyboardState.js';
import SceneRunner from './SceneRunner.js';
import { createPlayerProgressLayer } from './layers/player-progress.js';
import Scene from './Scene.js';
import TimedScene from './TimedScene.js';

async function main(canvas) {
  const videoContext = canvas.getContext('2d');
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const loadLevel = await createLevelLoader(entityFactory);

  const sceneRunner = new SceneRunner();

  const mario = createPlayer(entityFactory.mario());
  mario.player.name = 'MARIO';  
  const inputRouter = setupKeyborad(window);
  inputRouter.addReceiver(mario);

  async function runLevel(name) {
    console.log('Loading', name);

    const loadScreen = new Scene();
    loadScreen.comp.layers.push(createColorLayer('#000'));
    loadScreen.comp.layers.push(createTextLayer(font, `Loading ${name}...`));
    sceneRunner.addScene(loadScreen);
    sceneRunner.runNext();

    await new Promise(resolve => setTimeout(resolve, 1000));

    const level = await loadLevel(name);

    level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, touches) => {
      if (spec.type === 'goto') {
        for (const entity of touches) {
          if (entity.player) {
            runLevel(spec.name);
            return;
          }
        }
      }
    });

    const dashboardLayer = createDashboardLayer(font, level);
    const playerProgressLayer = createPlayerProgressLayer(font, level);

    mario.pos.set(0, 0);
    level.entities.add(mario);

    const playerEnv = new createPlayerEnv(mario);
    level.entities.add(playerEnv);

    const waitScreen = new TimedScene();
    waitScreen.countDown = 2;
    waitScreen.comp.layers.push(createColorLayer('#000'));
    waitScreen.comp.layers.push(dashboardLayer);
    waitScreen.comp.layers.push(playerProgressLayer);
    sceneRunner.addScene(waitScreen);

    level.comp.layers.push(createCollisionLayer(level));
    level.comp.layers.push(dashboardLayer);
    sceneRunner.addScene(level);

    sceneRunner.runNext();
  }

  const gameContext = {
    audioContext,
    videoContext,
    entityFactory,
    deltaTime: null,
  };

  const timer = new Timer(1/60);
  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;
    sceneRunner.update(gameContext);
  }

  timer.start();
  
  runLevel('debug-progression');
}



const canvas = document.getElementById('screen');

const start = () => {
  window.removeEventListener('click', start);
  main(canvas);
};

window.addEventListener('click', start);
  