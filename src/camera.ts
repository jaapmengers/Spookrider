import { OrthographicCamera } from 'three'

const width = 50
const height = width * (window.innerHeight / window.innerWidth)

const camera = new OrthographicCamera(
  width / -2,
  width / 2,
  height / 2,
  height / -2,
  0,
  1000
)

camera.position.set(0, 0, 300)
camera.up.set(0, 0, 0)
camera.lookAt(0, 0, 0)

export { camera, width as cameraWidth, height as cameraHeight }
