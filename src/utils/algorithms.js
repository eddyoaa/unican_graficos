// Returns array of {x,y} points on integer grid between (x0,y0) and (x1,y1)
export function computeLine(x0, y0, x1, y1, algo) {
  switch (algo) {
    case "slope-basic":
      return slopeBasic(x0, y0, x1, y1);
    case "slope-mod":
      return slopeModified(x0, y0, x1, y1);
    case "dda":
      return dda(x0, y0, x1, y1);
    case "bresenham-float":
      return bresenhamFloat(x0, y0, x1, y1);
    case "bresenham-int":
      return bresenhamInt(x0, y0, x1, y1);
    default:
      return [];
  }
}

function slopeBasic(x0, y0, x1, y1) {
  const pts = [];
  const dx = x1 - x0;
  const dy = y1 - y0;
  if (dx === 0 && dy === 0) return [{ x: x0, y: y0 }];
  // iterate over dominant axis to avoid holes
  if (Math.abs(dx) >= Math.abs(dy)) {
    const m = dx === 0 ? 0 : dy / dx;
    const b = y0 - m * x0;
    const [xmin, xmax] = x0 < x1 ? [x0, x1] : [x1, x0];
    for (let x = xmin; x <= xmax; x++) {
      const y = Math.round(m * x + b);
      pts.push({ x, y });
    }
  } else {
    const mInv = dy === 0 ? 0 : dx / dy;
    const [ymin, ymax] = y0 < y1 ? [y0, y1] : [y1, y0];
    for (let y = ymin; y <= ymax; y++) {
      const x = Math.round(x0 + mInv * (y - y0));
      pts.push({ x, y });
    }
  }
  // remove duplicates while preserving order
  const seen = new Set();
  return pts.filter((p) => {
    const k = `${p.x},${p.y}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function slopeModified(x0, y0, x1, y1) {
  // iterate over the dominant axis
  const pts = [];
  const dx = x1 - x0;
  const dy = y1 - y0;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const m = dx === 0 ? 0 : dy / dx;
    const [xmin, xmax] = x0 < x1 ? [x0, x1] : [x1, x0];
    for (let x = xmin; x <= xmax; x++) {
      const y = Math.round(y0 + m * (x - x0));
      pts.push({ x, y });
    }
  } else {
    const mInv = dy === 0 ? 0 : dx / dy;
    const [ymin, ymax] = y0 < y1 ? [y0, y1] : [y1, y0];
    for (let y = ymin; y <= ymax; y++) {
      const x = Math.round(x0 + mInv * (y - y0));
      pts.push({ x, y });
    }
  }
  return pts;
}

function dda(x0, y0, x1, y1) {
  const pts = [];
  const dx = x1 - x0;
  const dy = y1 - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  if (steps === 0) {
    // same point
    pts.push({ x: x0, y: y0 });
    return pts;
  }
  const xInc = dx / steps;
  const yInc = dy / steps;
  let x = x0;
  let y = y0;
  for (let i = 0; i <= steps; i++) {
    pts.push({ x: Math.round(x), y: Math.round(y) });
    x += xInc;
    y += yInc;
  }
  return pts;
}

function bresenhamFloat(x0, y0, x1, y1) {
  // Bresenham-like algorithm using floating-point slope accumulation
  // This version uses float stepping over the dominant axis and
  // rounds the secondary coordinate. It differs from the integer-only
  // variant which uses integer error arithmetic.
  const pts = [];
  const dx = x1 - x0;
  const dy = y1 - y0;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  const sx = dx === 0 ? 0 : dx > 0 ? 1 : -1;
  const sy = dy === 0 ? 0 : dy > 0 ? 1 : -1;

  if (absDx === 0 && absDy === 0) {
    pts.push({ x: x0, y: y0 });
    return pts;
  }

  if (absDx >= absDy) {
    // iterate over x with float y
    const m = dx === 0 ? 0 : dy / dx; // slope
    let x = x0;
    let y = y0;
    while (true) {
      pts.push({ x, y: Math.round(y) });
      if (x === x1) break;
      x += sx;
      y += m * sx;
    }
  } else {
    // iterate over y with float x
    const mInv = dy === 0 ? 0 : dx / dy;
    let x = x0;
    let y = y0;
    while (true) {
      pts.push({ x: Math.round(x), y });
      if (y === y1) break;
      y += sy;
      x += mInv * sy;
    }
  }
  return pts;
}

function bresenhamInt(x0, y0, x1, y1) {
  const pts = [];
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  let x = x0;
  let y = y0;
  while (true) {
    pts.push({ x, y });
    if (x === x1 && y === y1) break;
    const e2 = err * 2;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
  return pts;
}
