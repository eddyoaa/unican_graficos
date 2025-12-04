export const drawSierpinski = (ctx, size, recursionDepth) => {
  ctx.strokeStyle = "#1e40af";
  ctx.lineWidth = 1;

  // Helper function to draw a line
  const linea = (x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const sierpinsky = (x1, y1, x2, y2, x3, y3, n) => {
    if (n === 0) {
      // Draw triangle edges
      linea(x1, y1, x2, y2);
      linea(x2, y2, x3, y3);
      linea(x1, y1, x3, y3);
    } else {
      // Calculate midpoints
      const Ax = x1 + (x2 - x1) / 2;
      const Ay = y1 + (y2 - y1) / 2;
      const Bx = x3 + (x2 - x3) / 2;
      const By = y3 + (y2 - y3) / 2;
      const Cx = x1 + (x3 - x1) / 2;
      const Cy = y1 + (y3 - y1) / 2;

      // Recursively draw three smaller triangles
      sierpinsky(Ax, Ay, x2, y2, Bx, By, n - 1);
      sierpinsky(x1, y1, Ax, Ay, Cx, Cy, n - 1);
      sierpinsky(Cx, Cy, Bx, By, x3, y3, n - 1);
    }
  };

  // Draw main triangle
  const margin = 50;
  const x1 = size / 2;
  const y1 = margin;
  const x2 = margin;
  const y2 = size - margin;
  const x3 = size - margin;
  const y3 = size - margin;

  sierpinsky(x1, y1, x2, y2, x3, y3, recursionDepth);
};

export const drawJuliaSet = (ctx, size, juliaC) => {
  const maxIterations = 100;
  const zoom = 1.5;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      // Map pixel to complex plane
      let zx = (x - size / 2) / (size / 4) / zoom;
      let zy = (y - size / 2) / (size / 4) / zoom;

      let iteration = 0;
      while (zx * zx + zy * zy < 4 && iteration < maxIterations) {
        const xtemp = zx * zx - zy * zy + juliaC.real;
        zy = 2 * zx * zy + juliaC.imag;
        zx = xtemp;
        iteration++;
      }

      // Color based on iteration count
      const brightness =
        iteration === maxIterations ? 0 : (iteration / maxIterations) * 255;
      const hue = (iteration / maxIterations) * 360;
      ctx.fillStyle =
        iteration === maxIterations
          ? "#000000"
          : `hsl(${hue}, 100%, ${brightness / 2}%)`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
};

export const drawMandelbrotSet = (ctx, size) => {
  const maxIterations = 100;
  const zoom = 1;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      // Map pixel to complex plane
      const cx = (x - size / 2) / (size / 4) / zoom - 0.5;
      const cy = (y - size / 2) / (size / 4) / zoom;

      let zx = 0;
      let zy = 0;
      let iteration = 0;

      while (zx * zx + zy * zy < 4 && iteration < maxIterations) {
        const xtemp = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = xtemp;
        iteration++;
      }

      // Color based on iteration count
      const brightness =
        iteration === maxIterations ? 0 : (iteration / maxIterations) * 255;
      const hue = (iteration / maxIterations) * 360;
      ctx.fillStyle =
        iteration === maxIterations
          ? "#000000"
          : `hsl(${hue}, 100%, ${brightness / 2}%)`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
};

export const drawIFS = (ctx, size) => {
  // Barnsley Fern IFS
  ctx.fillStyle = "#10b981";

  const transforms = [
    // Stem
    { a: 0, b: 0, c: 0, d: 0.16, e: 0, f: 0, prob: 0.01 },
    // Smaller leaflets
    { a: 0.85, b: 0.04, c: -0.04, d: 0.85, e: 0, f: 1.6, prob: 0.85 },
    // Largest left-hand leaflet
    { a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0, f: 1.6, prob: 0.07 },
    // Largest right-hand leaflet
    { a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0, f: 0.44, prob: 0.07 },
  ];

  let x = 0;
  let y = 0;
  const iterations = 50000;
  const scale = size / 12;
  const offsetX = size / 2;
  const offsetY = size - 50;

  for (let i = 0; i < iterations; i++) {
    // Choose transformation based on probability
    const r = Math.random();
    let cumProb = 0;
    let transform = transforms[0];

    for (const t of transforms) {
      cumProb += t.prob;
      if (r <= cumProb) {
        transform = t;
        break;
      }
    }

    // Apply transformation
    const newX = transform.a * x + transform.b * y + transform.e;
    const newY = transform.c * x + transform.d * y + transform.f;
    x = newX;
    y = newY;

    // Draw point (skip first few iterations for better appearance)
    if (i > 100) {
      const px = offsetX + x * scale;
      const py = offsetY - y * scale;
      ctx.fillRect(px, py, 1, 1);
    }
  }
};
