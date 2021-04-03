import { inRange } from 'lodash';
import { BoxGeometry, Mesh } from 'three';

function hitDetection(car: Mesh<BoxGeometry>, obstacles: Mesh<BoxGeometry>[]) {
  return obstacles.some((obs) => boundsOverlap(getBounds(car), getBounds(obs)));
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function getBounds(mesh: Mesh<BoxGeometry>): Bounds {
  const { x: centerX, y: centerY } = mesh.position;
  const { width, height } = mesh.geometry.parameters;
  return {
    minX: centerX - width / 2,
    maxX: centerX + width / 2,
    minY: centerY - height / 2,
    maxY: centerY + height / 2,
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
