import React, { useState } from "react";
import { computeLine } from "../utils/algorithms";

const algos = [
  { value: "slope-basic", label: "Slope Intercept básico" },
  { value: "slope-mod", label: "Slope Intercept modificado" },
  { value: "dda", label: "Algoritmo DDA" },
  { value: "bresenham-float", label: "Bresenham (aritmética real)" },
  { value: "bresenham-int", label: "Bresenham (aritmética entera)" },
];

export default function Sidebar({
  pointA,
  pointB,
  setPointA,
  setPointB,
  setLinePoints,
  algo,
  setAlgo,
  lineColor,
  setLineColor,
  bgColor,
  setBgColor,
  linePoints,
  gridMin,
  gridMax,
  setGridMin,
  setGridMax,
  showLine,
  setShowLine,
  showSvgLine,
  setShowSvgLine,
}) {
  const [showPoints, setShowPoints] = useState(false);

  const handleGenerate = () => {
    if (!pointA || !pointB) return;
    const pts = computeLine(pointA.x, pointA.y, pointB.x, pointB.y, algo);
    setLinePoints(pts);
  };

  const handleReset = () => {
    setPointA(null);
    setPointB(null);
    setLinePoints([]);
  };

  const updateCoord = (which, axis, val) => {
    const num = parseInt(val, 10);
    if (Number.isNaN(num) || num < gridMin || num > gridMax) return;
    if (which === "A")
      setPointA((prev) => ({ ...(prev || { x: 0, y: 0 }), [axis]: num }));
    else setPointB((prev) => ({ ...(prev || { x: 0, y: 0 }), [axis]: num }));
  };

  const stepCoord = (which, axis, delta) => {
    const getter = which === "A" ? pointA : pointB;
    const setter = which === "A" ? setPointA : setPointB;
    const base = getter || { x: 0, y: 0 };
    let next = base[axis] + delta;
    if (next < gridMin) next = gridMin;
    if (next > gridMax) next = gridMax;
    setter({ ...base, [axis]: next });
  };

  return (
    <aside
      className="w-80 p-4 bg-white shadow-xl rounded-xl border border-gray-200 fixed left-6 top-1/2 -translate-y-1/2 z-20"
      style={{ maxHeight: "90vh", overflowY: "auto" }}
    >
      <h2 className="text-lg font-medium mb-4">Options</h2>

      <div className="mb-3">
        <label className="block text-sm font-medium">Grid Range</label>
        <select
          value={gridMax}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            setGridMin(-v);
            setGridMax(v);
            setPointA(null);
            setPointB(null);
            setLinePoints([]);
          }}
          className="mt-1 block w-full border rounded p-2 mb-2"
        >
          <option value={10}>-10 to 10</option>
          <option value={20}>-20 to 20</option>
          <option value={50}>-50 to 50</option>
          <option value={100}>-100 to 100</option>
        </select>
        <label className="block text-sm font-medium">Algorithm</label>
        <select
          value={algo}
          onChange={(e) => setAlgo(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
        >
          {algos.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Point A (x,y)</label>
        <div className="flex gap-2 mt-1">
          <div className="flex items-center border rounded">
            <button onClick={() => stepCoord("A", "x", -1)} className="px-2">
              -
            </button>
            <input
              type="number"
              value={pointA ? pointA.x : 0}
              onChange={(e) => updateCoord("A", "x", e.target.value)}
              className="w-16 text-center"
            />
            <button onClick={() => stepCoord("A", "x", 1)} className="px-2">
              +
            </button>
          </div>
          <div className="flex items-center border rounded">
            <button onClick={() => stepCoord("A", "y", -1)} className="px-2">
              -
            </button>
            <input
              type="number"
              value={pointA ? pointA.y : 0}
              onChange={(e) => updateCoord("A", "y", e.target.value)}
              className="w-16 text-center"
            />
            <button onClick={() => stepCoord("A", "y", 1)} className="px-2">
              +
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Point B (x,y)</label>
        <div className="flex gap-2 mt-1">
          <div className="flex items-center border rounded">
            <button onClick={() => stepCoord("B", "x", -1)} className="px-2">
              -
            </button>
            <input
              type="number"
              value={pointB ? pointB.x : 0}
              onChange={(e) => updateCoord("B", "x", e.target.value)}
              className="w-16 text-center"
            />
            <button onClick={() => stepCoord("B", "x", 1)} className="px-2">
              +
            </button>
          </div>
          <div className="flex items-center border rounded">
            <button onClick={() => stepCoord("B", "y", -1)} className="px-2">
              -
            </button>
            <input
              type="number"
              value={pointB ? pointB.y : 0}
              onChange={(e) => updateCoord("B", "y", e.target.value)}
              className="w-16 text-center"
            />
            <button onClick={() => stepCoord("B", "y", 1)} className="px-2">
              +
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Line color</label>
        <input
          type="color"
          value={lineColor}
          onChange={(e) => setLineColor(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Background color</label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="mt-1"
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setShowLine((v) => !v)}
          className={`flex-1 p-2 rounded ${
            showLine ? "bg-green-100" : "bg-gray-100"
          } border`}
        >
          {showLine ? "Hide Rasterized Line" : "Show Rasterized Line"}
        </button>
        <button
          onClick={() => setShowSvgLine((v) => !v)}
          className={`flex-1 p-2 rounded ${
            showSvgLine ? "bg-green-100" : "bg-gray-100"
          } border`}
        >
          {showSvgLine ? "Hide SVG Line" : "Show SVG Line"}
        </button>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleGenerate}
          className="flex-1 bg-blue-600 text-white p-2 rounded"
        >
          Generate Line
        </button>
        <button
          onClick={handleReset}
          className="flex-1 bg-gray-200 p-2 rounded"
        >
          Reset
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowPoints((v) => !v)}
          className="w-full bg-gray-100 border p-2 rounded text-sm mb-2"
        >
          {showPoints ? "Hide Points" : "Show Points"}
        </button>
        {showPoints && (
          <div className="max-h-40 overflow-auto border rounded p-2 bg-white text-xs">
            <div className="mb-1 font-semibold">
              Line Points ({linePoints?.length || 0}):
            </div>
            <ol className="list-decimal list-inside">
              {(linePoints || []).map((p, i) => (
                <li key={i}>{`(${p.x}, ${p.y})`}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </aside>
  );
}
