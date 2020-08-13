export function loadJSON(url) {
  return fetch(url)
    .then(res => res.json());
}

export function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}
