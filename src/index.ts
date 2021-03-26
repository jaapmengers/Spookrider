import { create, inRange } from 'lodash'
import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  Scene,
  WebGLRenderer,
} from 'three'
import { createBox } from './box'
import { camera } from './camera'
import { Clock } from './clock'
import './index.css'
import { createPlane } from './plane'
import { createField } from './field'

const scene = new Scene()

const mapWidth = 500
const mapHeight = 1000

scene.add(createPlane(mapWidth, mapHeight))
scene.add(createField(mapWidth, mapHeight))

const car = createBox(2, 4, 1)
scene.add(car)

const initialObstacleY = 200

const obstacle = createBox(2, 4, 2)
obstacle.position.y = initialObstacleY
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
let xSpeed = 0
const clock = new Clock()

window.addEventListener('keydown', (event) => {
  if (!gameStarted) {
    clock.reset()
    renderer.setAnimationLoop(animation)
    gameStarted = true
  }

  if (event.key == 'ArrowLeft') {
    xSpeed = -1
  }

  if (event.key == 'ArrowRight') {
    xSpeed = 1
  }

  if (event.key.toUpperCase() == 'R') {
    renderer.setAnimationLoop(null)
    gameStarted = false
  }
})

window.addEventListener('keyup', () => {
  xSpeed = 0
})

function animation() {
  if (hitDetection()) {
    renderer.setAnimationLoop(null)
  }

  const xMovementPerS = 0.1
  const yMovementPerS = 50

  obstacle.position.y = initialObstacleY - yMovementPerS * clock.getDelta()
  car.position.x += xSpeed * xMovementPerS
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

  console.log({ l, r })

  return (
    inRange(lMin, rMin, rMax) ||
    inRange(lMax, rMin, rMax) ||
    inRange(rMin, lMin, lMax) ||
    inRange(rMax, lMin, lMax)
  )
}

document.body.append(renderer.domElement)
