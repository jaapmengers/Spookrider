import { Mesh, MeshLambertMaterial, PlaneBufferGeometry } from 'three'

function createPlane(mapWidth: number, mapHeight: number) {
  const planeGeometry = new PlaneBufferGeometry(mapWidth, mapHeight)
  const planeMaterial = new MeshLambertMaterial({
    color: 0x666666,
  })
  return new Mesh(planeGeometry, planeMaterial)
}

export { createPlane }
