import { AmbientLight, DirectionalLight, Scene, WebGLRenderer } from 'three'
import { createBox } from './box'
import { camera, initialCameraPosition } from './camera'
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
const clock = new Clock()

window.addEventListener('click', () => {
  if (!gameStarted) {
    clock.reset()
    renderer.setAnimationLoop(animation)
    gameStarted = true
  } else {
    renderer.setAnimationLoop(null)
    gameStarted = false
  }
})

function animation() {
  const movementPerS = 3

  obstacle.position.x = initialObstacleX + movementPerS * clock.getDelta()
  renderer.render(scene, camera)
}

document.body.append(renderer.domElement)
