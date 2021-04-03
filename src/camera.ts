import { PerspectiveCamera } from 'three';

const camera = new PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

camera.position.set(-3, -10, 3);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

export { camera };
