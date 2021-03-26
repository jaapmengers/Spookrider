import { inRange } from 'lodash'
import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { createBox } from './box'
import { camera } from './camera'
import { Clock } from './clock'
import './index.css'

const scene = new Scene()

const car = createBox(5, 2, 3)
scene.add(car)

const initialObstacleX = -30

const obstacle = createBox(2, 4, 3)
obstacle.position.x = initialObstacleX
scene.add(obstacle)

const ambientLight = new AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const directionalLight = new DirectionalLight(0xffffff, 0.6)
directionalLight.position.set(10, 20, 0)
scene.add(directionalLight)

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

let gameStarted = false
let zSpeed = 0
const clock = new Clock()

window.addEventListener('keydown', (event) => {
  if (!gameStarted) {
    clock.reset()
    renderer.setAnimationLoop(animation)
    gameStarted = true
  }

  if (event.key == 'ArrowLeft') {
    zSpeed = -1
  }

  if (event.key == 'ArrowRight') {
    zSpeed = 1
  }

  if (event.key.toUpperCase() == 'R') {
    renderer.setAnimationLoop(null)
    gameStarted = false
  }
})

window.addEventListener('keyup', () => {
  zSpeed = 0
})

function animation() {
  if (hitDetection()) {
    renderer.setAnimationLoop(null)
  }

  const xMovementPerS = 3
  const zMovementPerS = 0.1

  obstacle.position.x = initialObstacleX + xMovementPerS * clock.getDelta()
  car.position.z += zSpeed * zMovementPerS
  renderer.render(scene, camera)
}

function hitDetection() {
  return boundsOverlap(getBounds(car), getBounds(obstacle))
}

interface Bounds {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

function getBounds(mesh: Mesh<BoxGeometry>): Bounds {
  const { x: centerX, z: centerZ } = mesh.position
  const { width, depth } = mesh.geometry.parameters
  return {
    minX: centerX - width / 2,
    maxX: centerX + width / 2,
    minZ: centerZ - depth / 2,
    maxZ: centerZ + depth / 2,
  }
}

function boundsOverlap(l: Bounds, r: Bounds): boolean {
  return (
    rangesOverlap([l.minX, l.maxX], [r.minX, r.maxX]) &&
    rangesOverlap([l.minZ, l.maxZ], [r.minZ, r.maxZ])
  )
}

function rangesOverlap(l: [number, number], r: [number, number]): boolean {
  const [lMin, lMax] = l
  const [rMin, rMax] = r

  return inRange(lMin, rMin, rMax) || inRange(lMax, rMin, rMax)
}

document.body.append(renderer.domElement)
