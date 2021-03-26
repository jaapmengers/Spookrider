import {
  CylinderGeometry,
  Group,
  Mesh,
  MeshLambertMaterial,
  SphereGeometry,
} from 'three'

function createTree() {
  const tree = new Group()

  const height = 3 + Math.random() * 1

  const trunk = new CylinderGeometry(0.6, 1, height, 32)
  trunk.rotateX(Math.PI / 2)
  const material = new MeshLambertMaterial({ color: 0xa3753c })
  const trunkMesh = new Mesh(trunk, material)
  tree.add(trunkMesh)

  const ballGeometry = new SphereGeometry(2)
  const ballMaterial = new MeshLambertMaterial({ color: 0x29871c })
  const ballMesh = new Mesh(ballGeometry, ballMaterial)
  ballMesh.position.z = height - 1
  tree.add(ballMesh)

  tree.position.set(0, 0, height / 2)
  return tree
}

export { createTree }
