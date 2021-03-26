import { PerspectiveCamera } from 'three'

const width = 50
const height = width * (window.innerHeight / window.innerWidth)

const camera = new PerspectiveCamera(100, 1, 0.1, 2000)

camera.position.set(-3, -10, 5)
camera.up.set(0, 0, 1)
camera.lookAt(0, 0, 0)

export { camera }
