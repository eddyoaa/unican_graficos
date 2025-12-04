import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  drawIFS,
  drawJuliaSet,
  drawMandelbrotSet,
  drawSierpinski,
} from "../utils/fractals";

export default function FractalsPage() {
  const [fractalType, setFractalType] = useState("sierpinski");
  const [recursionDepth, setRecursionDepth] = useState(5);
  const [juliaC, setJuliaC] = useState({ real: -0.7, imag: 0.27015 });
  const [canvasSize, setCanvasSize] = useState(600);
  const [generated, setGenerated] = useState(false);

  const generateFractal = () => {
    const canvas = document.getElementById("fractalCanvas");
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    switch (fractalType) {
      case "sierpinski":
        drawSierpinski(ctx, canvasSize, recursionDepth);
        break;
      case "julia":
        drawJuliaSet(ctx, canvasSize, juliaC);
        break;
      case "mandelbrot":
        drawMandelbrotSet(ctx, canvasSize);
        break;
      case "ifs":
        drawIFS(ctx, canvasSize);
        break;
    }

    setGenerated(true);
  };

  useEffect(() => {
    if (generated) {
      generateFractal();
    }
  }, [canvasSize]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-6 py-6">
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

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Fractals</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Fractal Type</h3>
                <select
                  value={fractalType}
                  onChange={(e) => setFractalType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sierpinski">Sierpiński Triangle</option>
                  <option value="julia">Julia Set</option>
                  <option value="mandelbrot">Mandelbrot Set</option>
                  <option value="ifs">IFS (Barnsley Fern)</option>
                </select>
              </div>

              {/* Sierpinski Options */}
              {fractalType === "sierpinski" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recursion Depth: {recursionDepth}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={recursionDepth}
                    onChange={(e) =>
                      setRecursionDepth(parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">Range: 0-8</div>
                </div>
              )}

              {/* Julia Set Options */}
              {fractalType === "julia" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      C (Real part): {juliaC.real.toFixed(3)}
                    </label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.01"
                      value={juliaC.real}
                      onChange={(e) =>
                        setJuliaC({
                          ...juliaC,
                          real: parseFloat(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      C (Imaginary part): {juliaC.imag.toFixed(3)}
                    </label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.01"
                      value={juliaC.imag}
                      onChange={(e) =>
                        setJuliaC({
                          ...juliaC,
                          imag: parseFloat(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    <strong>Popular values:</strong>
                    <button
                      onClick={() => setJuliaC({ real: -0.7, imag: 0.27015 })}
                      className="block mt-2 text-blue-600 hover:text-blue-800"
                    >
                      • -0.7 + 0.27015i
                    </button>
                    <button
                      onClick={() => setJuliaC({ real: -0.8, imag: 0.156 })}
                      className="block mt-1 text-blue-600 hover:text-blue-800"
                    >
                      • -0.8 + 0.156i
                    </button>
                    <button
                      onClick={() => setJuliaC({ real: 0.285, imag: 0.01 })}
                      className="block mt-1 text-blue-600 hover:text-blue-800"
                    >
                      • 0.285 + 0.01i
                    </button>
                  </div>
                </div>
              )}

              {/* Canvas Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canvas Size: {canvasSize}px
                </label>
                <input
                  type="range"
                  min="400"
                  max="800"
                  step="50"
                  value={canvasSize}
                  onChange={(e) => setCanvasSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateFractal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Generate Fractal
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4">
                {fractalType === "sierpinski" && "Sierpiński Triangle"}
                {fractalType === "julia" && "Julia Set"}
                {fractalType === "mandelbrot" && "Mandelbrot Set"}
                {fractalType === "ifs" && "Barnsley Fern (IFS)"}
              </h3>
              <div className="flex justify-center">
                <canvas
                  id="fractalCanvas"
                  width={canvasSize}
                  height={canvasSize}
                  className="border border-gray-300"
                />
              </div>
              {!generated && (
                <div className="text-center mt-4 text-gray-500">
                  Select a fractal type and click "Generate Fractal" to begin
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
