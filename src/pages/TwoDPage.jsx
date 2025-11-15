import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarTwoD from "../components/SidebarTwoD";
import {
  drawParallelogram as drawParallelogramUtil,
  getTransformationMatrix,
  transformCorners,
} from "../utils/transformations";

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

  const matrix = getTransformationMatrix({
    dx,
    dy,
    angle,
    ccw,
    sx,
    sy,
    shx,
    shy,
    reflectionEnabled,
    reflectionM,
    reflectionT,
  });

  const getTransformedCorners = () => {
    return transformCorners(originalCorners, matrix);
  };

  const drawParallelogram = () => {
    const canvas = document.getElementById("canvas2d");
    const transformedCorners = getTransformedCorners();

    drawParallelogramUtil({
      canvas,
      canvasSize,
      bgColor,
      lineColor,
      originalCorners,
      transformedCorners,
      reflectionEnabled,
      reflectionM,
      reflectionT,
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

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarTwoD
        dx={dx}
        setDx={setDx}
        dy={dy}
        setDy={setDy}
        angle={angle}
        setAngle={setAngle}
        ccw={ccw}
        setCcw={setCcw}
        sx={sx}
        setSx={setSx}
        sy={sy}
        setSy={setSy}
        shx={shx}
        setShx={setShx}
        shy={shy}
        setShy={setShy}
        reflectionM={reflectionM}
        setReflectionM={setReflectionM}
        reflectionT={reflectionT}
        setReflectionT={setReflectionT}
        reflectionEnabled={reflectionEnabled}
        setReflectionEnabled={setReflectionEnabled}
        canvasSize={canvasSize}
        setCanvasSize={setCanvasSize}
        lineColor={lineColor}
        setLineColor={setLineColor}
        bgColor={bgColor}
        setBgColor={setBgColor}
        drawParallelogram={drawParallelogram}
      />

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
