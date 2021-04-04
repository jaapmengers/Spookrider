import { sample } from 'lodash';
import { BoxGeometry, MeshLambertMaterial, Mesh, Group, Color } from 'three';
import { createWheel } from './wheel';

const CAR_WIDTH = 2;
const CAR_HEIGHT = 4;
const CAR_DEPTH = 0.7;

const vehicleColors = [
  0xa52523,
  0xef2d56,
  0x0ad3ff,
  0xff9f1c,
  0xa52523,
  0xbdb638,
  0x78b14b,
];

function createCar(color: number = null) {
  const car = new Group();

  const chosenColor = color ?? sample(vehicleColors);

  const body_geometry = new BoxGeometry(CAR_WIDTH, CAR_HEIGHT, CAR_DEPTH);
  const body_material = new MeshLambertMaterial({ color: chosenColor });
  const body = new Mesh(body_geometry, body_material);
  body.position.set(0, 0, 0.5);
  car.add(body);

  const cabin_geometry = new BoxGeometry(CAR_WIDTH - 0.2, CAR_HEIGHT / 2, 0.75);
  const cabin = new Mesh(
    cabin_geometry,
    new MeshLambertMaterial({ color: 0xffffff })
  );
  cabin.position.set(0, 0, 1.225);
  car.add(cabin);

  car.add(createWheel(CAR_WIDTH / 2, -CAR_HEIGHT / 2 + 0.7));
  car.add(createWheel(-CAR_WIDTH / 2, -CAR_HEIGHT / 2 + 0.7));
  car.add(createWheel(CAR_WIDTH / 2, CAR_HEIGHT / 2 - 0.7));
  car.add(createWheel(-CAR_WIDTH / 2, CAR_HEIGHT / 2 - 0.7));

  car.position.set(0, 0, CAR_DEPTH / 2);
  return car;
}

export { createCar, CAR_WIDTH, CAR_HEIGHT, CAR_DEPTH };
