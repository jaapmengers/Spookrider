import { inRange } from 'lodash';
import { Group } from 'three';
import { CAR_HEIGHT, CAR_WIDTH } from './car';

function hitDetection(car: Group, obstacles: Group[]) {
  return obstacles.some((obs) => boundsOverlap(getBounds(car), getBounds(obs)));
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function getBounds(group: Group): Bounds {
  const { x: centerX, y: centerY } = group.position;
  return {
    minX: centerX - CAR_WIDTH / 2,
    maxX: centerX + CAR_WIDTH / 2,
    minY: centerY - CAR_HEIGHT / 2,
    maxY: centerY + CAR_HEIGHT / 2,
  };
}

function boundsOverlap(l: Bounds, r: Bounds): boolean {
  return (
    rangesOverlap([l.minX, l.maxX], [r.minX, r.maxX]) &&
    rangesOverlap([l.minY, l.maxY], [r.minY, r.maxY])
  );
}

function rangesOverlap(l: [number, number], r: [number, number]): boolean {
  const [lMin, lMax] = l;
  const [rMin, rMax] = r;

  return (
    inRange(lMin, rMin, rMax) ||
    inRange(lMax, rMin, rMax) ||
    inRange(rMin, lMin, lMax) ||
    inRange(rMax, lMin, lMax)
  );
}

export { hitDetection };
