import { range, sample } from 'lodash';
import {
  AmbientLight,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshLambertMaterial,
  Scene,
  WebGLRenderer,
} from 'three';
import { createCar } from './car';
import { camera } from './camera';
import { Clock } from './clock';
import './index.css';
import { hitDetection } from './hitDetection';
import { addControls } from './controls';
import { createField } from './field';

const scene = new Scene();
const gray = 0xb5d3e7;

scene.background = new Color(gray);

const ambientLight = new AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(100, 100, 400);
scene.add(directionalLight);

const worldRadius = 500;
const fieldRadius = worldRadius * 1.0005;

const cylinder = new Mesh(
  new CylinderGeometry(worldRadius, worldRadius, 10, 320),
  new MeshLambertMaterial({ color: 0x666666 })
);
cylinder.rotateZ(Math.PI / 2);
cylinder.position.z = -worldRadius;
scene.add(cylinder);

const leftField = createField(-30, fieldRadius);
const rightField = createField(30, fieldRadius);

leftField.position.z = -worldRadius;
rightField.position.z = -worldRadius;

scene.add(leftField);
scene.add(rightField);

const car = createCar();
scene.add(car);

const stepSize = (Math.PI / 1000) * 2;

const obstacles = range(0, 100).map((x) => {
  const obstacle = createCar();
  obstacle.position.x = sample([-3, 0, 3]);
  scene.add(obstacle);

  const offset = stepSize * x * 10 + 20;

  positionGroup(obstacle, offset, worldRadius);

  return { obstacle, offset };
});

function positionGroup(obstacle: Group, pos: number, offsetRadius: number) {
  obstacle.position.y = Math.cos(pos) * offsetRadius;
  obstacle.position.z = Math.sin(pos) * offsetRadius - offsetRadius;

  obstacle.rotation.x = pos - Math.PI / 2;
}

const obstacleSpeed = 20;
const carSpeed = 5;
const clock = new Clock();
let xSpeed = 0;
const xSpeedPerS = 20;
let position = 0;

let speedUp = 0.1;

function animation() {
  const delta = clock.getDelta();

  const newXPosition = car.position.x + xSpeed * delta * speedUp;
  car.position.x = Math.min(Math.max(newXPosition, -3), 3);

  position = (position + stepSize * delta * speedUp) % 1;
  obstacles.forEach((x) =>
    positionGroup(x.obstacle, position * obstacleSpeed + x.offset, fieldRadius)
  );

  const fieldRotation = Math.PI * 2 * (position * carSpeed);

  leftField.rotation.x = fieldRotation;
  rightField.rotation.x = fieldRotation;
  renderer.render(scene, camera);

  if (speedUp < 1) {
    speedUp *= 1 + delta;
  }
}

addControls(
  () => {
    start();
    xSpeed = -xSpeedPerS;
  },
  () => {
    start();
    xSpeed = xSpeedPerS;
  },
  () => {
    xSpeed = 0;
  }
);

function start() {
  renderer.setAnimationLoop(animation);
}

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

document.body.append(renderer.domElement);
