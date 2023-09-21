const map = window.map;

let animatedGrid = [],
  curves = [];

// World size
let gridSize = { x: 5, y: 7 };

// Create parametric equations for curves
let createCurveInterval;
window.curveDelay = 1400;
function startCreatingCurves() {
  function create() {
    console.log(curves.length);
    createCurve({
      x: t => 3 * t * Math.sin(t),
      y: t => 3 * t * Math.cos(t),
      t: 0,
      // dt: 0.05,
      maxT: 100
    });
  }
  createCurveInterval = setInterval(() => {
    create();
  }, window.curveDelay);
  // 1400: ciclone
  // 4500: espiral
  // 5000: pizza giratória
  create();
}

function stopCreatingCurves() {
  clearInterval(createCurveInterval);
  createCurveInterval = null;
}

// Optional global function params. If not using, set f = null
// Example: let f = (x, y) => sin(x*y)
window.f = null;
const START_TIME = 70;
let t = START_TIME;
window.dt = 0.05;

function createCurve(curve) {
  curves.push(curve);
}

function setup() {
  initGrid();
  // curves = []
}

function initGrid() {
  for (let x = 0; x < gridSize.x; x++) {
    animatedGrid[x] = animatedGrid[x] || [];
    for (let y = 0; y < gridSize.y; y++) {
      animatedGrid[x][y] = animatedGrid[x][y] || {
        v: 0,
        dv: 0,
        color: 0
      };
    }
  }
}

function resetTime() {
  t = START_TIME;
}

function update() {
  t += window.dt;
  updateCurves();
  updateGrid();
}
// const side = Math.sqrt(32**2 + 16 ** 2)
const width = 32 * 6;
const height = 16 * 6;
function updateCurves() {
  for (const curve of curves) {
    let t = (curve.t += window.dt);
    if (t > curve.maxT) {
      curve.toRemove = true;
      continue;
    }
    let x = curve.x(t);
    let y = curve.y(t);
    if (
      x >= -width / 2 &&
      x < width / 2 &&
      y >= -height / 2 &&
      y < height / 2
    ) {
      let gridX = Math.floor(map(x, -width / 2, width / 2, 0, gridSize.x));
      let gridY = Math.floor(map(y, -height / 2, height / 2, 0, gridSize.y));
      activateCell(gridX, gridY, curve);
    }
  }
  curves = curves.filter(curve => !curve.toRemove);
}

function activateCell(x, y, curve) {
  if (!isValid(x, y) || animatedGrid[x][y].v > 0) return;
  // can be customized according to the curve that activated the cell
  animatedGrid[x][y] = {
    v: 0,
    dv: 0.03,
    color: 0
  };
}

function updateGrid() {
  for (let x = 0; x < gridSize.x; x++) {
    for (let y = 0; y < gridSize.y; y++) {
      updateCell(x, y);
    }
  }
}

function isValid(x, y) {
  return !(x < 0 || x >= gridSize.x || y < 0 || y >= gridSize.y);
}

function updateCell(x, y) {
  if (!isValid(x, y)) return;
  if (window.f) {
    stopCreatingCurves();
    updateCellByGlobalFunction(x, y);
    return;
  } else if (createCurveInterval === null) {
    startCreatingCurves();
  }
  let cell = animatedGrid[x][y];
  cell.v += cell.dv;
  if (cell.v > 1) {
    cell.v = 1;
    cell.dv *= -1;
  }
  if (cell.v < 0) {
    cell.v = cell.dv = 0;
  }
  let colorMap = map(cell.v, 0.2, 1, 0, 3);
  cell.color = Math.min(Math.max(0, Math.ceil(colorMap)), 3);
}

function updateCellByGlobalFunction(x, y) {
  if (!isValid(x, y)) return;
  let z = window.f(x - (gridSize.x - 1) / 2, y - (gridSize.y - 1) / 2, t);
  let zMapped = map(z, 0, 1, 0, 3);
  animatedGrid[x][y].color = Math.min(Math.max(0, Math.ceil(zMapped)), 3);
}

window.initAnimation = setup;
window.updateAnimation = update;
window.animatedGrid = animatedGrid;
window.resetTime = resetTime;
