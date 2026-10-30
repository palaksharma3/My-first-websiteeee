/* Spatial geometry is kept separate so the 4D construction can be tested directly. */
(() => {
  'use strict';
  const TAU = Math.PI * 2;

  const rotatePlane = (point, a, b, angle) => {
    const result = point.slice();
    const c = Math.cos(angle), s = Math.sin(angle);
    result[a] = point[a] * c - point[b] * s;
    result[b] = point[a] * s + point[b] * c;
    return result;
  };
  const rotate4 = (point, time, pointerX = 0, pointerY = 0) => {
    let result = rotatePlane(point, 0, 3, .42 + time * .24);
    result = rotatePlane(result, 1, 3, -.22 + time * .17);
    result = rotatePlane(result, 2, 3, .31 - time * .11);
    return rotatePlane(result, 0, 1, -.14 + pointerX * .16 + pointerY * .08);
  };
  const project4 = (point, distance = 4.2) => {
    if (distance <= point[3]) throw new RangeError('The 4D point is on or beyond the projection camera.');
    const factor = distance / (distance - point[3]);
    return [point[0] * factor, point[1] * factor, point[2] * factor];
  };
  // Screen coordinates retain depth and perspective scale for correct drawing order.
  const project3 = (point, distance = 6.8) => {
    if (distance + point[2] <= 0) throw new RangeError('The 3D point is on or behind the screen camera.');
    const factor = distance / (distance + point[2]);
    return [point[0] * factor, point[1] * factor, point[2], factor];
  };
  const project = (point, time, pointerX = 0, pointerY = 0) => {
    let view = project4(rotate4(point, time, pointerX, pointerY));
    view = rotatePlane(view, 1, 2, .47 + pointerY * .22);
    view = rotatePlane(view, 0, 2, -.56 + pointerX * .3);
    view = rotatePlane(view, 0, 1, -.16);
    return project3(view);
  };

  const createTesseract = () => {
    const vertices = Array.from({ length: 16 }, (_, index) => Array.from({ length: 4 }, (_, axis) => index & (1 << axis) ? 1 : -1));
    const edges = [];
    for (let index = 0; index < 16; index++) {
      for (let axis = 0; axis < 4; axis++) if (!(index & (1 << axis))) edges.push([index, index | (1 << axis)]);
    }
    const faces = [];
    for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) {
      const fixed = [0, 1, 2, 3].filter(axis => axis !== a && axis !== b);
      for (let mask = 0; mask < 4; mask++) {
        const base = (mask & 1 ? 1 << fixed[0] : 0) | (mask & 2 ? 1 << fixed[1] : 0);
        faces.push([base, base | (1 << a), base | (1 << a) | (1 << b), base | (1 << b)]);
      }
    }
    return { name: 'Tesseract', detail: '16 vertices · 32 edges', kind: 'polytope', vertices, edges, faces };
  };
  const create16Cell = () => {
    const vertices = Array.from({ length: 8 }, (_, index) => Array.from({ length: 4 }, (_, axis) => axis === Math.floor(index / 2) ? (index % 2 ? 1.65 : -1.65) : 0));
    const edges = [];
    for (let a = 0; a < 8; a++) for (let b = a + 1; b < 8; b++) if (Math.floor(a / 2) !== Math.floor(b / 2)) edges.push([a, b]);
    const faces = [];
    for (let a = 0; a < 8; a++) for (let b = a + 1; b < 8; b++) for (let c = b + 1; c < 8; c++) {
      if (new Set([a, b, c].map(index => Math.floor(index / 2))).size === 3) faces.push([a, b, c]);
    }
    return { name: '16-cell', detail: '8 vertices · 24 edges', kind: 'polytope', vertices, edges, faces };
  };
  const createCliffordTorus = (uCount = 72, vCount = 28) => {
    const vertices = [];
    const curves = [];
    const radius = 1.15;
    for (let u = 0; u < uCount; u++) for (let v = 0; v < vCount; v++) {
      const a = u / uCount * TAU, b = v / vCount * TAU;
      vertices.push([radius * Math.cos(a), radius * Math.sin(a), radius * Math.cos(b), radius * Math.sin(b)]);
    }
    for (let v = 0; v < vCount; v++) curves.push(Array.from({ length: uCount + 1 }, (_, u) => (u % uCount) * vCount + v));
    for (let u = 0; u < uCount; u++) curves.push(Array.from({ length: vCount + 1 }, (_, v) => u * vCount + (v % vCount)));
    return { name: 'Clifford torus', detail: 'A two-dimensional surface in 4D space', kind: 'surface', vertices, curves, radius };
  };

  const api = Object.freeze({ rotatePlane, rotate4, project4, project3, project, createTesseract, create16Cell, createCliffordTorus });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.Geometry4D = api;
})();
