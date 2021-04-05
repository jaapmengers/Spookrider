import { range, sample } from 'lodash';
import {
  AmbientLight,
  Color,
  CylinderGeometry,
  DirectionalLight,
  FogExp2,
  Group,
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
const gray = 0xdddddd;

scene.background = new Color(gray);
scene.fog = new FogExp2(gray, 0.02);

const ambientLight = new AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(100, 100, 400);
scene.add(directionalLight);

const worldRadius = 1000;
const fieldRadius = 1000 * 1.0005;

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

  const offset = stepSize * x * 10;

  positionGroup(obstacle, offset, worldRadius);

  return { obstacle, offset };
});

function positionGroup(obstacle: Group, pos: number, offsetRadius: number) {
  obstacle.position.y = Math.cos(pos) * offsetRadius;
  obstacle.position.z = Math.sin(pos) * offsetRadius - offsetRadius;

  obstacle.rotation.x = pos - Math.PI / 2;
}

const obstacleSpeed = 10;
const carSpeed = 5;
const clock = new Clock();
let xSpeed = 0;
const xSpeedPerS = 10;
let position = 0;

function animation() {
  const delta = clock.getDelta();

  const newXPosition = car.position.x + xSpeed * delta;
  car.position.x = Math.min(Math.max(newXPosition, -3), 3);

  position += stepSize * delta;
  obstacles.forEach((x) =>
    positionGroup(x.obstacle, position * obstacleSpeed + x.offset, fieldRadius)
  );

  leftField.rotation.x = position * carSpeed - Math.PI / 2;
  rightField.rotation.x = position * carSpeed - Math.PI / 2;

  renderer.render(scene, camera);
}

addControls(
  () => {
    xSpeed = -xSpeedPerS;
  },
  () => {
    xSpeed = xSpeedPerS;
  },
  () => {
    xSpeed = 0;
  }
);

const renderer = new WebGLRenderer();

renderer.setAnimationLoop(animation);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

document.body.append(renderer.domElement);
