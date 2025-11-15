/**
 * Multiply two 3x3 matrices
 * @param {number[][]} a - First matrix
 * @param {number[][]} b - Second matrix
 * @returns {number[][]} Result matrix
 */
export function multiplyMatrices(a, b) {
  const result = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}

/**
 * Transform a point using a transformation matrix
 * @param {Object} point - Point with x and y coordinates
 * @param {number[][]} matrix - 3x3 transformation matrix
 * @returns {Object} Transformed point
 */
export function transformPoint(point, matrix) {
  const x = matrix[0][0] * point.x + matrix[0][1] * point.y + matrix[0][2];
  const y = matrix[1][0] * point.x + matrix[1][1] * point.y + matrix[1][2];
  return { x, y };
}

/**
 * Calculate the complete transformation matrix based on transformation parameters
 * @param {Object} params - Transformation parameters
 * @returns {number[][]} 3x3 transformation matrix
 */
export function getTransformationMatrix({
  dx = 0,
  dy = 0,
  angle = 0,
  ccw = true,
  sx = 1,
  sy = 1,
  shx = 0,
  shy = 0,
  reflectionEnabled = false,
  reflectionM = 1,
  reflectionT = 0,
}) {
  // Start with identity matrix
  let matrix = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  // Translation
  const translate = [
    [1, 0, dx],
    [0, 1, dy],
    [0, 0, 1],
  ];
  matrix = multiplyMatrices(matrix, translate);

  // Rotation
  const rad = (ccw ? angle : -angle) * (Math.PI / 180);
  const rotation = [
    [Math.cos(rad), -Math.sin(rad), 0],
    [Math.sin(rad), Math.cos(rad), 0],
    [0, 0, 1],
  ];
  matrix = multiplyMatrices(matrix, rotation);

  // Scale
  const scale = [
    [sx, 0, 0],
    [0, sy, 0],
    [0, 0, 1],
  ];
  matrix = multiplyMatrices(matrix, scale);

  // Shear
  const shxRad = shx * (Math.PI / 180);
  const shyRad = shy * (Math.PI / 180);
  const shear = [
    [1, Math.tan(shxRad), 0],
    [Math.tan(shyRad), 1, 0],
    [0, 0, 1],
  ];
  matrix = multiplyMatrices(matrix, shear);

  // Reflection (if enabled)
  if (reflectionEnabled) {
    const m = reflectionM;
    const t = reflectionT;
    const denom = m * m + 1;
    const reflection = [
      [(1 - m * m) / denom, (2 * m) / denom, (-2 * m * t) / denom],
      [(2 * m) / denom, (m * m - 1) / denom, (2 * t) / denom],
      [0, 0, 1],
    ];
    matrix = multiplyMatrices(matrix, reflection);
  }

  return matrix;
}

/**
 * Convert world coordinates to canvas coordinates
 * @param {Object} point - Point with x and y coordinates
 * @param {number} canvasSize - Size of the canvas
 * @returns {Object} Canvas coordinates
 */
export function toCanvasCoords(point, canvasSize) {
  const centerX = canvasSize / 2;
  const centerY = canvasSize / 2;
  return {
    x: centerX + point.x,
    y: centerY - point.y, // Invert Y for canvas
  };
}

/**
 * Transform an array of corner points using a transformation matrix
 * @param {Object[]} corners - Array of corner points
 * @param {number[][]} matrix - Transformation matrix
 * @returns {Object[]} Transformed corner points
 */
export function transformCorners(corners, matrix) {
  return corners.map((corner) => transformPoint(corner, matrix));
}

/**
 * Draw a parallelogram on canvas with transformations
 * @param {Object} params - Drawing parameters
 */
export function drawParallelogram({
  canvas,
  canvasSize,
  bgColor,
  lineColor,
  originalCorners,
  transformedCorners,
  reflectionEnabled,
  reflectionM,
  reflectionT,
}) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Clear canvas
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw axes
  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(canvasSize / 2, 0);
  ctx.lineTo(canvasSize / 2, canvasSize);
  ctx.moveTo(0, canvasSize / 2);
  ctx.lineTo(canvasSize, canvasSize / 2);
  ctx.stroke();

  // Draw reflection line if enabled
  if (reflectionEnabled) {
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    const y1 = reflectionM * (-canvasSize / 2) + reflectionT;
    const y2 = reflectionM * (canvasSize / 2) + reflectionT;
    const p1 = toCanvasCoords({ x: -canvasSize / 2, y: y1 }, canvasSize);
    const p2 = toCanvasCoords({ x: canvasSize / 2, y: y2 }, canvasSize);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw original parallelogram (light)
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  ctx.beginPath();
  const origCanvas = originalCorners.map((corner) =>
    toCanvasCoords(corner, canvasSize)
  );
  ctx.moveTo(origCanvas[0].x, origCanvas[0].y);
  for (let i = 1; i < origCanvas.length; i++) {
    ctx.lineTo(origCanvas[i].x, origCanvas[i].y);
  }
  ctx.closePath();
  ctx.stroke();

  // Draw transformed parallelogram
  const transformedCanvas = transformedCorners.map((corner) =>
    toCanvasCoords(corner, canvasSize)
  );

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.fillStyle = lineColor + "20"; // 20 = alpha transparency
  ctx.beginPath();
  ctx.moveTo(transformedCanvas[0].x, transformedCanvas[0].y);
  for (let i = 1; i < transformedCanvas.length; i++) {
    ctx.lineTo(transformedCanvas[i].x, transformedCanvas[i].y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw corner points
  transformedCanvas.forEach((point) => {
    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });
}
