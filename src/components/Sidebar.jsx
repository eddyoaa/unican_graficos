import React from "react";
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
}) {
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
    if (Number.isNaN(num) || num < -20 || num > 20) return;
    if (which === "A")
      setPointA((prev) => ({ ...(prev || { x: 0, y: 0 }), [axis]: num }));
    else setPointB((prev) => ({ ...(prev || { x: 0, y: 0 }), [axis]: num }));
  };

  return (
    <aside className="w-80 p-4 bg-white border-r">
      <h2 className="text-lg font-medium mb-4">Options</h2>

      <div className="mb-3">
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
          <input
            value={pointA ? pointA.x : ""}
            onChange={(e) => updateCoord("A", "x", e.target.value)}
            className="border p-2 w-1/2"
            placeholder="-20..20"
          />
          <input
            value={pointA ? pointA.y : ""}
            onChange={(e) => updateCoord("A", "y", e.target.value)}
            className="border p-2 w-1/2"
            placeholder="-20..20"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Point B (x,y)</label>
        <div className="flex gap-2 mt-1">
          <input
            value={pointB ? pointB.x : ""}
            onChange={(e) => updateCoord("B", "x", e.target.value)}
            className="border p-2 w-1/2"
            placeholder="-20..20"
          />
          <input
            value={pointB ? pointB.y : ""}
            onChange={(e) => updateCoord("B", "y", e.target.value)}
            className="border p-2 w-1/2"
            placeholder="-20..20"
          />
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
    </aside>
  );
}
