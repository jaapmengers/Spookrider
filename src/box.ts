import { BoxGeometry, MeshLambertMaterial, Mesh } from 'three'

function createBox(width: number, height: number, depth: number) {
  const geometry = new BoxGeometry(width, height, depth)
  const material = new MeshLambertMaterial({ color: 0xfb8e00 })
  const mesh = new Mesh(geometry, material)
  mesh.position.set(0, height / 2, 0)
  return mesh
}

export { createBox }
