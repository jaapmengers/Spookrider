import { last, partition, range, sample } from 'lodash';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  FogExp2,
  Group,
  Scene,
  WebGLRenderer,
} from 'three';
import { CAR_WIDTH, createCar } from './car';
import { camera } from './camera';
import { Clock } from './clock';
import './index.css';
import { createPlane } from './plane';
import { createField } from './field';
import { hitDetection } from './hitDetection';
import { createTree } from './tree';

const scene = new Scene();
scene.background = new Color(0xdddddd);

const color = 0xdddddd;
scene.fog = new FogExp2(color, 0.02);

const mapWidth = 500;
const mapHeight = 1000;

scene.add(createPlane(mapWidth, mapHeight));
scene.add(createField(mapWidth, mapHeight));

const car = createCar(0xfb8e00);
scene.add(car);

const trees = range(0, 110).map((n) => {
  const minXPosition = -7;
  const xPosition = sample([1, -1]) * (minXPosition - Math.random() * 5);
  const yPosition = 300 - n * 3;

  const tree = createTree();
  tree.position.x = xPosition;
  tree.position.y = yPosition;
  scene.add(tree);

  return tree;
});

const initialObstacleY = 200;
let obstacles: Group[] = [];

const ambientLight = new AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(0, -10, 40);
scene.add(directionalLight);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

let gameStarted = false;
let xSpeed = 0;
const clock = new Clock();

window.addEventListener('keydown', (event) => {
  if (!gameStarted) {
    clock.reset();
    addObstacle();
    renderer.setAnimationLoop(animation);
    gameStarted = true;
  }

  if (event.key == 'ArrowLeft') {
    xSpeed = -1;
  }

  if (event.key == 'ArrowRight') {
    xSpeed = 1;
  }

  if (event.key.toUpperCase() == 'R') {
    renderer.setAnimationLoop(null);
    gameStarted = false;
  }
});

window.addEventListener('keyup', () => {
  xSpeed = 0;
});

let previousObstacleTime = 0;

const minCarX = -5 + CAR_WIDTH / 2;
const maxCarX = -minCarX;

const xMovementPerS = 0.3;
let obstacleMovementPerS = 30;
const speedIncreaseRate = 0.5;

function animation() {
  if (hitDetection(car, obstacles)) {
    renderer.setAnimationLoop(null);
  }

  const delta = clock.getDelta();

  obstacleMovementPerS += delta * speedIncreaseRate;

  obstacles.forEach((obs) => {
    obs.position.y -= obstacleMovementPerS * delta;
  });

  deleteOldObstacles();

  const lastOstaclePosition = last(obstacles)?.position.y;
  if (initialObstacleY - lastOstaclePosition > 25) {
    addObstacle();
  }

  trees.forEach((tree) => {
    const newPosition = tree.position.y - (obstacleMovementPerS / 2) * delta;
    tree.position.y = newPosition > -30 ? newPosition : 300;
  });

  const newX = car.position.x + xSpeed * xMovementPerS;
  car.position.x = Math.max(Math.min(newX, maxCarX), minCarX);

  renderer.render(scene, camera);
}

function addObstacle() {
  previousObstacleTime = performance.now();

  const position = sample([-1, 0, 1]) * (1.5 * CAR_WIDTH);
  const obstacle = createCar();

  obstacle.position.x = position;
  obstacle.position.y = initialObstacleY;
  scene.add(obstacle);

  obstacles.push(obstacle);
}

function deleteOldObstacles() {
  const [toBeRemoved, remaining] = partition(
    obstacles,
    (obs) => obs.position.y < -100
  );

  toBeRemoved.forEach((obs) => scene.remove(obs));
  obstacles = remaining;
}

document.body.append(renderer.domElement);
