import { last, partition, range, sample } from 'lodash';
import {
  AmbientLight,
  Color,
  CylinderGeometry,
  DirectionalLight,
  FogExp2,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
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
import { addControls } from './controls';

const scene = new Scene();
const color = 0xdddddd;

scene.background = new Color(color);
scene.fog = new FogExp2(color, 0.02);

const ambientLight = new AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(100, 100, 400);
scene.add(directionalLight);

const worldRadius = 1000;

const cylinder = new Mesh(
  new CylinderGeometry(worldRadius, worldRadius, 10, 320),
  new MeshLambertMaterial({ color: 0xfffff0 })
);
cylinder.rotateZ(Math.PI / 2);
cylinder.position.z = -worldRadius;

scene.add(cylinder);

// const plane = createPlane(20, 20);
// scene.add(plane);

const car = createCar();
scene.add(car);

const stepSize = (Math.PI / 10000) * 2;

const obstacles = range(0, 100).map((x) => {
  const obstacle = createCar();
  obstacle.position.x = sample([-3, 0, 3]);
  scene.add(obstacle);

  const offset = stepSize * x * 100;

  positionObstacle(obstacle, offset);

  return { obstacle, offset };
});

// scene.rotation.z = -0.5;

const xSpeed = 0.5;

addControls(
  () => {
    car.position.x -= xSpeed;
  },
  () => {
    car.position.x += xSpeed;
  }
);

let position = 0;

function positionObstacle(obstacle: Group, pos: number) {
  obstacle.position.y = Math.cos(pos) * worldRadius;
  obstacle.position.z = Math.sin(pos) * worldRadius - worldRadius;

  obstacle.rotation.x = pos - Math.PI / 2;
}

function animation() {
  position += stepSize;

  obstacles.forEach((x) => positionObstacle(x.obstacle, position + x.offset));

  renderer.render(scene, camera);
}

const renderer = new WebGLRenderer();

renderer.setAnimationLoop(animation);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

document.body.append(renderer.domElement);
