import { range, sample } from 'lodash';
import { CylinderGeometry, Group, Mesh, MeshLambertMaterial } from 'three';
import { createTree } from './tree';

function createField(xPosition: number, radius: number) {
  const group = new Group();
  group.position.x = xPosition;
  const field = new Mesh(
    new CylinderGeometry(radius, radius, 50, 320),
    new MeshLambertMaterial({ color: 0x67c240 })
  );
  field.rotateZ(Math.PI / 2);
  group.add(field);

  range(0, 1000).forEach((x) => {
    const tree = createTree();
    group.add(tree);

    tree.position.x = -1 * Math.sign(xPosition) * sample(range(17, 20));
    const pos = (Math.PI / 500) * x;

    tree.position.y = Math.cos(pos) * radius;
    tree.position.z = Math.sin(pos) * radius;
    tree.rotation.x = pos - Math.PI / 2;
  });

  return group;
}

export { createField };
