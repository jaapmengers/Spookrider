import { ExtrudeBufferGeometry, Mesh, MeshLambertMaterial, Shape } from 'three'

function createField(mapWidth: number, mapHeight: number) {
  const left = -mapWidth / 2
  const top = -mapHeight / 2

  const width = mapWidth / 2 - 5
  const height = mapHeight
  const right = mapWidth / 2 - width

  const leftField = new Shape()
  leftField.moveTo(left, top)
  leftField.lineTo(left + width, top)
  leftField.lineTo(left + width, top + height)
  leftField.lineTo(left, top + height)
  leftField.lineTo(left, top)

  const rightField = new Shape()
  rightField.moveTo(right, top)
  rightField.lineTo(right + width, top)
  rightField.lineTo(right + width, top + height)
  rightField.lineTo(right, top + height)
  rightField.lineTo(right, top)

  const fieldGeometry = new ExtrudeBufferGeometry([leftField, rightField], {
    depth: 0.3,
    bevelEnabled: false,
  })

  return new Mesh(fieldGeometry, [
    new MeshLambertMaterial({ color: 0x67c240 }),
    new MeshLambertMaterial({ color: 0x233311c }),
  ])
}

export { createField }
