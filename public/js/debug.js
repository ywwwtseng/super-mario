export function setupMouseControl(canvas, entity, camera) {
  let prevEvent;

  ['mousedown', 'mousemove'].forEach(eventName => {
    canvas.addEventListener(eventName, event => {
      if (event.buttons === 1) {
        entity.vel.set(0, 0);
        entity.pos.set(
          event.offsetX + camera.pos.x, 
          event.offsetY + camera.pos.y,
        );
      } else if (
        event.buttons === 2
        && (prevEvent && prevEvent.buttons === 2)
        && prevEvent.type === 'mousemove'
      ) {
        camera.pos.x -= event.offsetX - prevEvent.offsetX;
      }

      prevEvent = event;
    });
  });

  canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
}

