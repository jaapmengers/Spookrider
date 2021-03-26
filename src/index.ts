import { create, inRange, partition } from 'lodash'
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

let obstacles: Mesh<BoxGeometry>[] = []

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
    addObstacle()
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

let previousObstacleTime = 0

const minCarX = -5 + car.geometry.parameters.width / 2
const maxCarX = -minCarX

function animation() {
  if (hitDetection()) {
    renderer.setAnimationLoop(null)
  }

  if (performance.now() - previousObstacleTime > 1000) {
    addObstacle()
  }

  const xMovementPerS = 0.3
  const yMovementPerS = 50

  const delta = clock.getDelta()

  deleteOldObstacles()
  obstacles.forEach((obs) => {
    obs.position.y -= yMovementPerS * delta
  })

  const newX = car.position.x + xSpeed * xMovementPerS
  car.position.x = Math.max(Math.min(newX, maxCarX), minCarX)

  renderer.render(scene, camera)
}

function addObstacle() {
  previousObstacleTime = performance.now()

  const randomWidth = Math.random() * 3 + 2
  const minLeft = -5 + randomWidth / 2
  const position = minLeft + randomWidth * Math.random()

  const obstacle = createBox(randomWidth, 2, 2, position)
  obstacle.position.y = initialObstacleY
  scene.add(obstacle)

  obstacles.push(obstacle)
}

function deleteOldObstacles() {
  const [toBeRemoved, remaining] = partition(
    obstacles,
    (obs) => obs.position.y < -100
  )

  toBeRemoved.forEach((obs) => scene.remove(obs))
  obstacles = remaining
}

function hitDetection() {
  return obstacles.some((obs) => boundsOverlap(getBounds(car), getBounds(obs)))
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

  return (
    inRange(lMin, rMin, rMax) ||
    inRange(lMax, rMin, rMax) ||
    inRange(rMin, lMin, lMax) ||
    inRange(rMax, lMin, lMax)
  )
}

document.body.append(renderer.domElement)
