// Returns array of {x,y} points on integer grid between (x0,y0) and (x1,y1)
export function computeLine(x0, y0, x1, y1, algo) {
  switch (algo) {
    case "slope-intercept":
      return slopeIntercept(x0, y0, x1, y1);
    case "dda":
      return dda(x0, y0, x1, y1);
    case "bresenham":
      return bresenham(x0, y0, x1, y1);
    default:
      return [];
  }
}

function slopeIntercept(x0, y0, x1, y1) {
  const pts = [];
  let x1_orig = x0,
    y1_orig = y0,
    x2_orig = x1,
    y2_orig = y1;

  // Extra modification: if line goes to the left, swap points so it always goes right
  if (x2_orig < x1_orig) {
    [x1_orig, y1_orig, x2_orig, y2_orig] = [x2_orig, y2_orig, x1_orig, y1_orig];
  }

  let x = x1_orig;
  let y = y1_orig;
  const dx = x2_orig - x1_orig;
  const dy = y2_orig - y1_orig;

  // Mod1: y1=y2, therefore m=0 (horizontal line)
  if (dy === 0) {
    while (x <= x2_orig) {
      pts.push({ x, y });
      x = x + 1;
    }
    return pts;
  }

  // Mod2: x2=x1 => m=infinity (vertical line)
  if (dx === 0) {
    const [ymin, ymax] =
      y1_orig < y2_orig ? [y1_orig, y2_orig] : [y2_orig, y1_orig];
    for (let yy = ymin; yy <= ymax; yy++) {
      pts.push({ x: x1_orig, y: yy });
    }
    return pts;
  }

  let m = dy / dx;
  const b = y1_orig - m * x1_orig;

  // Mod3: if m > 1, swap x and y, and change slope to 1/m
  if (Math.abs(m) > 1) {
    [x, y] = [y, x];
    m = 1 / m;
    const [ymin, ymax] =
      y1_orig < y2_orig ? [y1_orig, y2_orig] : [y2_orig, y1_orig];

    // Iterate over y (which is now in the x role)
    let yy = ymin;
    while (yy <= ymax) {
      const xx = Math.round(m * yy + (x1_orig - m * y1_orig));
      pts.push({ x: xx, y: yy });
      yy = yy + 1;
    }
  } else {
    // Normal case: iterate over x
    while (x <= x2_orig) {
      y = Math.round(m * x + b);
      pts.push({ x, y });
      x = x + 1;
    }
  }

  return pts;
}

function dda(x0, y0, x1, y1) {
  const pts = [];
  const dx = x1 - x0;
  const dy = y1 - y0;
  const M = Math.max(Math.abs(dx), Math.abs(dy));

  if (M === 0) {
    // same point
    pts.push({ x: x0, y: y0 });
    return pts;
  }

  const dxPrime = dx / M;
  const dyPrime = dy / M;
  let x = x0 + 0.5;
  let y = y0 + 0.5;
  let i = 0;

  while (i <= M) {
    pts.push({ x: Math.floor(x), y: Math.floor(y) });
    x = x + dxPrime;
    y = y + dyPrime;
    i = i + 1;
  }

  return pts;
}

function bresenham(x0, y0, x1, y1) {
  const pts = [];

  // Modification 2.1: Use absolute values
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);

  // Modification 2.2: Use sign function
  const s1 = x1 - x0 === 0 ? 0 : x1 - x0 > 0 ? 1 : -1; // sgn(xf-x1)
  const s2 = y1 - y0 === 0 ? 0 : y1 - y0 > 0 ? 1 : -1; // sgn(yf-y1)

  // Modification 2.3: Handle all octants
  let interchange = false;
  if (dy > dx) {
    // Swap dx and dy for steep lines
    [dx, dy] = [dy, dx];
    interchange = true;
  }

  // Integer arithmetic modification: ne = 2*dy - dx
  let ne = 2 * dy - dx;

  let x = x0;
  let y = y0;
  let i = 0;

  while (i <= dx) {
    pts.push({ x, y });

    // When ne > 0
    while (ne > 0) {
      if (interchange) {
        x = x + s1; // update x when steep
      } else {
        y = y + s2; // update y when not steep
      }
      ne = ne - 2 * dx; // compensate ne
    }

    // Update coordinates
    if (interchange) {
      y = y + s2; // update y when steep
    } else {
      x = x + s1; // update x when not steep
    }

    ne = ne + 2 * dy; // update ne
    i = i + 1;
  }

  return pts;
}
