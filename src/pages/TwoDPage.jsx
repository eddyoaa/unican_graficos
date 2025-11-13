import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TwoDPage() {
  // Transformation parameters
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [angle, setAngle] = useState(0);
  const [ccw, setCcw] = useState(true);
  const [sx, setSx] = useState(1);
  const [sy, setSy] = useState(1);
  const [shx, setShx] = useState(0);
  const [shy, setShy] = useState(0);
  const [reflectionM, setReflectionM] = useState(1);
  const [reflectionT, setReflectionT] = useState(0);
  const [reflectionEnabled, setReflectionEnabled] = useState(false);

  // Canvas settings
  const [canvasSize, setCanvasSize] = useState(400);
  const [lineColor, setLineColor] = useState("#3b82f6");
  const [bgColor, setBgColor] = useState("#ffffff");

  // Original parallelogram corners (centered)
  const originalCorners = [
    { x: -50, y: -30 },
    { x: 50, y: -30 },
    { x: 70, y: 30 },
    { x: -30, y: 30 },
  ];

  // Calculate transformation matrix
  const getTransformationMatrix = () => {
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
  };

  const multiplyMatrices = (a, b) => {
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
  };

  const transformPoint = (point, matrix) => {
    const x = matrix[0][0] * point.x + matrix[0][1] * point.y + matrix[0][2];
    const y = matrix[1][0] * point.x + matrix[1][1] * point.y + matrix[1][2];
    return { x, y };
  };

  const getTransformedCorners = () => {
    const matrix = getTransformationMatrix();
    return originalCorners.map((corner) => transformPoint(corner, matrix));
  };

  const toCanvasCoords = (point) => {
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    return {
      x: centerX + point.x,
      y: centerY - point.y, // Invert Y for canvas
    };
  };

  const drawParallelogram = () => {
    const canvas = document.getElementById("canvas2d");
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
      const p1 = toCanvasCoords({ x: -canvasSize / 2, y: y1 });
      const p2 = toCanvasCoords({ x: canvasSize / 2, y: y2 });
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw original parallelogram (light)
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    const origCanvas = originalCorners.map(toCanvasCoords);
    ctx.moveTo(origCanvas[0].x, origCanvas[0].y);
    for (let i = 1; i < origCanvas.length; i++) {
      ctx.lineTo(origCanvas[i].x, origCanvas[i].y);
    }
    ctx.closePath();
    ctx.stroke();

    // Draw transformed parallelogram
    const transformed = getTransformedCorners();
    const transformedCanvas = transformed.map(toCanvasCoords);

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
    transformedCanvas.forEach((point, i) => {
      ctx.fillStyle = lineColor;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  useEffect(() => {
    drawParallelogram();
  }, [
    dx,
    dy,
    angle,
    ccw,
    sx,
    sy,
    shx,
    shy,
    reflectionM,
    reflectionT,
    reflectionEnabled,
    canvasSize,
    lineColor,
    bgColor,
  ]);

  const matrix = getTransformationMatrix();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className="w-80 p-4 bg-white shadow border-r border-gray-200"
        style={{ minHeight: "100vh", overflowY: "auto" }}
      >
        <h2 className="text-lg font-medium mb-4">Transformation Controls</h2>

        {/* Translation */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Translation</label>
          <div className="space-y-2">
            <div>
              <label className="text-sm">dx: {dx}</label>
              <input
                type="range"
                min="-100"
                max="100"
                value={dx}
                onChange={(e) => setDx(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
            <div>
              <label className="text-sm">dy: {dy}</label>
              <input
                type="range"
                min="-100"
                max="100"
                value={dy}
                onChange={(e) => setDy(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Rotation</label>
          <div className="space-y-2">
            <div>
              <label className="text-sm">Angle: {angle}°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={ccw}
                onChange={(e) => setCcw(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Counter-clockwise (CCW)</span>
            </label>
          </div>
        </div>

        {/* Scale */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Scale</label>
          <div className="space-y-2">
            <div>
              <label className="text-sm">sx: {sx.toFixed(2)}</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={sx}
                onChange={(e) => setSx(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
            <div>
              <label className="text-sm">sy: {sy.toFixed(2)}</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={sy}
                onChange={(e) => setSy(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
          </div>
        </div>

        {/* Shear */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Shear (Skew)</label>
          <div className="space-y-2">
            <div>
              <label className="text-sm">shx: {shx}°</label>
              <input
                type="range"
                min="-45"
                max="45"
                value={shx}
                onChange={(e) => setShx(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
            <div>
              <label className="text-sm">shy: {shy}°</label>
              <input
                type="range"
                min="-45"
                max="45"
                value={shy}
                onChange={(e) => setShy(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
          </div>
        </div>

        {/* Reflection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Reflection</label>
          <div className="space-y-2">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={reflectionEnabled}
                onChange={(e) => setReflectionEnabled(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium">Enable Reflection</span>
            </label>
            <div className="text-sm text-gray-600 mb-2">y = m*x + t</div>
            <div>
              <label className="text-sm">m: {reflectionM.toFixed(2)}</label>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={reflectionM}
                onChange={(e) => setReflectionM(Number(e.target.value))}
                className="w-full mt-1"
                disabled={!reflectionEnabled}
              />
            </div>
            <div>
              <label className="text-sm">t: {reflectionT}</label>
              <input
                type="range"
                min="-100"
                max="100"
                value={reflectionT}
                onChange={(e) => setReflectionT(Number(e.target.value))}
                className="w-full mt-1"
                disabled={!reflectionEnabled}
              />
            </div>
          </div>
        </div>

        {/* Canvas & Colors */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Canvas & Colors
          </label>
          <div className="space-y-2">
            <div>
              <label className="text-sm">Canvas Size: {canvasSize}px</label>
              <input
                type="range"
                min="300"
                max="600"
                step="50"
                value={canvasSize}
                onChange={(e) => setCanvasSize(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Line Color</label>
              <input
                type="color"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Background</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Redraw Button */}
        <button
          onClick={drawParallelogram}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Redraw Figure
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          2D Transformations
        </h1>

        <div className="space-y-6">
          {/* Canvas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-4">Parallelogram</h3>
            <div className="flex justify-center">
              <canvas
                id="canvas2d"
                width={canvasSize}
                height={canvasSize}
                className="border border-gray-300"
              />
            </div>
          </div>

          {/* Transformation Matrix */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-4">
              Transformation Matrix
            </h3>
            <div className="font-mono text-sm bg-gray-50 p-4 rounded overflow-x-auto">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">[</span>
                <div className="text-center">
                  {matrix.map((row, i) => (
                    <div key={i} className="flex space-x-4">
                      {row.map((val, j) => (
                        <span key={j} className="inline-block w-20 text-right">
                          {val.toFixed(3)}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                <span className="text-2xl">]</span>
              </div>
            </div>
          </div>

          {/* Corner Points Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Original Corner Points */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4">
                Original Corner Points
              </h3>
              <div className="space-y-2">
                {originalCorners.map((corner, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded">
                    <span className="font-semibold">P{i + 1}:</span>
                    <span className="ml-2 font-mono">
                      ({corner.x}, {corner.y})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transformed Corner Points */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4">
                Transformed Corner Points
              </h3>
              <div className="space-y-2">
                {getTransformedCorners().map((corner, i) => (
                  <div key={i} className="bg-blue-50 p-3 rounded">
                    <span className="font-semibold">P{i + 1}':</span>
                    <span className="ml-2 font-mono">
                      ({corner.x.toFixed(2)}, {corner.y.toFixed(2)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
