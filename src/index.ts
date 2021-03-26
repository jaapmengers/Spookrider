import { inRange } from 'lodash'
import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshLambertMaterial,
  PlaneBufferGeometry,
  Scene,
  WebGLRenderer,
} from 'three'
import { createBox } from './box'
import { camera } from './camera'
import { Clock } from './clock'
import './index.css'

const scene = new Scene()

const planeGeometry = new PlaneBufferGeometry(
  window.innerWidth,
  window.innerHeight
)
const planeMaterial = new MeshLambertMaterial({
  color: 0x666666,
})
const plane = new Mesh(planeGeometry, planeMaterial)
scene.add(plane)

const car = createBox(5, 3, 2)
scene.add(car)

const initialObstacleX = -30

const obstacle = createBox(2, 4, 3)
obstacle.position.x = initialObstacleX
scene.add(obstacle)

const ambientLight = new AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const directionalLight = new DirectionalLight(0xffffff, 0.6)
directionalLight.position.set(0, -10, 40)
scene.add(directionalLight)

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

let gameStarted = false
let ySpeed = 0
const clock = new Clock()

window.addEventListener('keydown', (event) => {
  if (!gameStarted) {
    clock.reset()
    renderer.setAnimationLoop(animation)
    gameStarted = true
  }

  if (event.key == 'ArrowLeft') {
    ySpeed = -1
  }

  if (event.key == 'ArrowRight') {
    ySpeed = 1
  }

  if (event.key.toUpperCase() == 'R') {
    renderer.setAnimationLoop(null)
    gameStarted = false
  }
})

window.addEventListener('keyup', () => {
  ySpeed = 0
})

function animation() {
  if (hitDetection()) {
    renderer.setAnimationLoop(null)
  }

  const xMovementPerS = 10
  const yMovementPerS = 0.1

  obstacle.position.x = initialObstacleX + xMovementPerS * clock.getDelta()
  car.position.y += ySpeed * yMovementPerS
  renderer.render(scene, camera)
}

function hitDetection() {
  return boundsOverlap(getBounds(car), getBounds(obstacle))
}

interface Bounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

function getBounds(mesh: Mesh<BoxGeometry>): Bounds {
  const { x: centerX, y: centerY } = mesh.position
  const { width, height } = mesh.geometry.parameters
  return {
    minX: centerX - width / 2,
    maxX: centerX + width / 2,
    minY: centerY - height / 2,
    maxY: centerY + height / 2,
  }
}

function boundsOverlap(l: Bounds, r: Bounds): boolean {
  return (
    rangesOverlap([l.minX, l.maxX], [r.minX, r.maxX]) &&
    rangesOverlap([l.minY, l.maxY], [r.minY, r.maxY])
  )
}

function rangesOverlap(l: [number, number], r: [number, number]): boolean {
  const [lMin, lMax] = l
  const [rMin, rMax] = r

  return inRange(lMin, rMin, rMax) || inRange(lMax, rMin, rMax)
}

document.body.append(renderer.domElement)
