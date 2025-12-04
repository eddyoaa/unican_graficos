import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarTwoD from "../components/SidebarTwoD";
import {
  drawParallelogram as drawParallelogramUtil,
  getTransformationMatrix,
  transformCorners,
} from "../utils/transformations";

export default function TwoDPage() {
  // Current transformation parameters (for UI controls)
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

  // Applied transformations (accumulated)
  const [appliedMatrix, setAppliedMatrix] = useState([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]);
  const [transformationHistory, setTransformationHistory] = useState([]);

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [startCorners, setStartCorners] = useState(null);
  const [targetCorners, setTargetCorners] = useState(null);

  // Canvas settings
  const [canvasSize, setCanvasSize] = useState(400);
  const [lineColor, setLineColor] = useState("#3b82f6");
  const [bgColor, setBgColor] = useState("#ffffff");

  // Reflection line display
  const [reflectionLine, setReflectionLine] = useState(null);

  // Original parallelogram corners (centered)
  const originalCorners = [
    { x: -50, y: -30 },
    { x: 50, y: -30 },
    { x: 70, y: 30 },
    { x: -30, y: 30 },
  ];

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

  const animateTransformation = (newMatrix) => {
    const currentCorners = transformCorners(originalCorners, appliedMatrix);
    const newCorners = transformCorners(originalCorners, newMatrix);
    
    setStartCorners(currentCorners);
    setTargetCorners(newCorners);
    setIsAnimating(true);
    setAnimationProgress(0);
    
    // Animation will complete after the effect runs
    setTimeout(() => {
      setAppliedMatrix(newMatrix);
      setIsAnimating(false);
    }, 500); // 500ms animation duration
  };

  const applyTranslation = () => {
    const translationMatrix = getTransformationMatrix({
      dx,
      dy,
      angle: 0,
      ccw: true,
      sx: 1,
      sy: 1,
      shx: 0,
      shy: 0,
      reflectionEnabled: false,
    });
    const newMatrix = multiplyMatrices(appliedMatrix, translationMatrix);
    animateTransformation(newMatrix);
    setTransformationHistory((prev) => [
      ...prev,
      `Translation: (${dx}, ${dy})`,
    ]);
    setDx(0);
    setDy(0);
  };

  const applyRotation = () => {
    const rotationMatrix = getTransformationMatrix({
      dx: 0,
      dy: 0,
      angle,
      ccw,
      sx: 1,
      sy: 1,
      shx: 0,
      shy: 0,
      reflectionEnabled: false,
    });
    const newMatrix = multiplyMatrices(appliedMatrix, rotationMatrix);
    animateTransformation(newMatrix);
    setTransformationHistory((prev) => [
      ...prev,
      `Rotation: ${angle}° ${ccw ? "CCW" : "CW"}`,
    ]);
    setAngle(0);
  };

  const applyScale = () => {
    const scaleMatrix = getTransformationMatrix({
      dx: 0,
      dy: 0,
      angle: 0,
      ccw: true,
      sx,
      sy,
      shx: 0,
      shy: 0,
      reflectionEnabled: false,
    });
    const newMatrix = multiplyMatrices(appliedMatrix, scaleMatrix);
    animateTransformation(newMatrix);
    setTransformationHistory((prev) => [
      ...prev,
      `Scale: (${sx.toFixed(2)}, ${sy.toFixed(2)})`,
    ]);
    setSx(1);
    setSy(1);
  };

  const applyShear = () => {
    const shearMatrix = getTransformationMatrix({
      dx: 0,
      dy: 0,
      angle: 0,
      ccw: true,
      sx: 1,
      sy: 1,
      shx,
      shy,
      reflectionEnabled: false,
    });
    const newMatrix = multiplyMatrices(appliedMatrix, shearMatrix);
    animateTransformation(newMatrix);
    setTransformationHistory((prev) => [...prev, `Shear: (${shx}°, ${shy}°)`]);
    setShx(0);
    setShy(0);
  };

  const applyReflection = () => {
    const reflectionMatrix = getTransformationMatrix({
      dx: 0,
      dy: 0,
      angle: 0,
      ccw: true,
      sx: 1,
      sy: 1,
      shx: 0,
      shy: 0,
      reflectionEnabled: true,
      reflectionM,
      reflectionT,
    });
    const newMatrix = multiplyMatrices(appliedMatrix, reflectionMatrix);
    animateTransformation(newMatrix);
    setTransformationHistory((prev) => [
      ...prev,
      `Reflection: y = ${reflectionM.toFixed(2)}x + ${reflectionT}`,
    ]);
    setReflectionLine({ m: reflectionM, t: reflectionT });
  };

  const resetTransformations = () => {
    setAppliedMatrix([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]);
    setTransformationHistory([]);
    setDx(0);
    setDy(0);
    setAngle(0);
    setCcw(true);
    setSx(1);
    setSy(1);
    setShx(0);
    setShy(0);
    setReflectionM(1);
    setReflectionT(0);
    setReflectionLine(null);
  };

  const getTransformedCorners = () => {
    if (isAnimating && startCorners && targetCorners) {
      // Interpolate between start and target corners
      return startCorners.map((start, i) => {
        const target = targetCorners[i];
        return {
          x: start.x + (target.x - start.x) * animationProgress,
          y: start.y + (target.y - start.y) * animationProgress,
        };
      });
    }
    return transformCorners(originalCorners, appliedMatrix);
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
      reflectionEnabled: reflectionLine !== null,
      reflectionM: reflectionLine?.m || 0,
      reflectionT: reflectionLine?.t || 0,
    });
  };

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    const duration = 500; // 500ms
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-in-out)
      const easedProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setAnimationProgress(easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isAnimating]);

  useEffect(() => {
    drawParallelogram();
  }, [appliedMatrix, canvasSize, lineColor, bgColor, reflectionLine, animationProgress]);

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
        canvasSize={canvasSize}
        setCanvasSize={setCanvasSize}
        lineColor={lineColor}
        setLineColor={setLineColor}
        bgColor={bgColor}
        setBgColor={setBgColor}
        applyTranslation={applyTranslation}
        applyRotation={applyRotation}
        applyScale={applyScale}
        applyShear={applyShear}
        applyReflection={applyReflection}
        resetTransformations={resetTransformations}
        transformationHistory={transformationHistory}
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
              Applied Transformation Matrix
            </h3>
            <div className="font-mono text-sm bg-gray-50 p-4 rounded overflow-x-auto">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">[</span>
                <div className="text-center">
                  {appliedMatrix.map((row, i) => (
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

          {/* Transformation History */}
          {transformationHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4">
                Transformation History
              </h3>
              <div className="space-y-2">
                {transformationHistory.map((transform, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-3 rounded font-mono text-sm"
                  >
                    {i + 1}. {transform}
                  </div>
                ))}
              </div>
            </div>
          )}

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
