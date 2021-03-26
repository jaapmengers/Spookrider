import { PerspectiveCamera } from 'three'

const width = 50
const height = width * (window.innerHeight / window.innerWidth)

// const camera = new OrthographicCamera(
//   width / -2,
//   width / 2,
//   height / 2,
//   height / -2,
//   1,
//   100
// )

const camera = new PerspectiveCamera(20, 1, 0.1, 2000)

camera.position.set(100, -40, 40)
camera.up.set(0, 0, 1)
camera.lookAt(0, 0, 0)

const initialCameraPosition = camera.position.clone()

export { camera, initialCameraPosition }
