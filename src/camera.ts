import { PerspectiveCamera } from 'three';

const camera = new PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

camera.position.set(0, -10, 4);
camera.lookAt(0, 100, 0);

export { camera };
