import { CylinderGeometry, Mesh, MeshLambertMaterial } from 'three';

function createWheel(x: number, y: number) {
  const wheel_geometry = new CylinderGeometry(0.5, 0.5, 0.4);
  const wheel_material = new MeshLambertMaterial({ color: 0x000000 });
  const wheel = new Mesh(wheel_geometry, wheel_material);
  wheel.position.set(x, y, 0.2);
  wheel.rotateZ(Math.PI / 2);

  return wheel;
}

export { createWheel };
