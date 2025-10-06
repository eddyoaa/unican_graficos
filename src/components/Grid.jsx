import React, { useEffect } from "react";
import { computeLine } from "../utils/algorithms";

const SIZE = 41; // -20..20 inclusive

function coordToIndex(x, y) {
  // map -10..10 to 0..20 indices; origin at center
  return { ix: x + 10, iy: 10 - y };
}

export default function Grid({
  pointA,
  pointB,
  setPointA,
  setPointB,
  linePoints,
  setLinePoints,
  algo,
  lineColor,
  bgColor,
}) {
  const cells = [];
  for (let row = 0; row < SIZE; row++) {
    const y = 20 - row;
    for (let col = 0; col < SIZE; col++) {
      const x = col - 20;
      cells.push({ x, y });
    }
  }

  const handleClick = (x, y) => {
    if (!pointA) {
      setPointA({ x, y });
      setLinePoints([]);
      return;
    }
    if (!pointB) {
      setPointB({ x, y });
      return;
    }
    // if both set, clicking resets pointA to new selection
    setPointA({ x, y });
    setPointB(null);
    setLinePoints([]);
  };

  useEffect(() => {
    if (pointA && pointB) {
      const pts = computeLine(pointA.x, pointA.y, pointB.x, pointB.y, algo);
      setLinePoints(pts);
    }
  }, [pointA, pointB, algo, setLinePoints]);

  const isSelected = (x, y, p) => p && p.x === x && p.y === y;
  const lineSet = new Set(linePoints.map((p) => `${p.x},${p.y}`));

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">
          2D Coordinate System (-10..10)
        </h1>
        <p className="text-sm text-gray-600">
          Click two cells to select points A and B.
        </p>
      </div>

      <div
        className="grid border overflow-auto"
        style={{ background: bgColor, gridTemplateColumns: `repeat(${SIZE}, 1.5rem)` }}
      >
        {cells.map(({ x, y }) => {
          const key = `${x},${y}`;
          const selectedA = isSelected(x, y, pointA);
          const selectedB = isSelected(x, y, pointB);
          const onLine = lineSet.has(key);
          return (
            <div
              key={key}
              onClick={() => handleClick(x, y)}
              className={`w-5 h-5 border border-gray-200 flex items-center justify-center text-[9px] cursor-pointer select-none`}
              title={`(${x}, ${y})`}
              style={{
                background: selectedA
                  ? "#a7f3d0"
                  : selectedB
                  ? "#bfdbfe"
                  : onLine
                  ? lineColor
                  : undefined,
              }}
            >
              <div className="text-gray-700">
                {x === 0 && y === 0 ? "O" : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
