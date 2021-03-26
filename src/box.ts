import { BoxGeometry, MeshLambertMaterial, Mesh } from 'three'

function createBox(
  width: number,
  height: number,
  depth: number,
  xPosition: number = 0
) {
  const geometry = new BoxGeometry(width, height, depth)
  const material = new MeshLambertMaterial({ color: 0xfb8e00 })
  const mesh = new Mesh(geometry, material)
  mesh.position.set(xPosition, 0, depth / 2)
  return mesh
}

export { createBox }
