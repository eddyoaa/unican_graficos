import React, { useEffect, useState } from "react";
import { computeLine } from "../utils/algorithms";

// SIZE and range are now dynamic

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
  gridMin,
  gridMax,
  showLine,
  showSvgLine,
}) {
  const SIZE = gridMax - gridMin + 1;
  const cells = [];
  for (let row = 0; row < SIZE; row++) {
    const y = gridMax - row;
    for (let col = 0; col < SIZE; col++) {
      const x = col + gridMin;
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

  // dynamic sizing so the whole grid fits without scrolling
  const [cellSize, setCellSize] = useState(24);
  useEffect(() => {
    function compute() {
      const sidebarWidth = 320; // tailwind w-80
      const labelCol = 48; // left label column
      // ...existing code...
      const topRow = 24; // top label row
      const padding = 40; // margins
      const availW = Math.max(
        200,
        window.innerWidth - sidebarWidth - labelCol - padding
      );
      const availH = Math.max(200, window.innerHeight - topRow - padding - 120); // leave room for header and controls
      const size = Math.floor(
        Math.max(3, Math.min(availW / SIZE, availH / SIZE))
      );
      setCellSize(size);
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [gridMin, gridMax]);

  const isSelected = (x, y, p) => p && p.x === x && p.y === y;
  const lineSet = new Set(linePoints.map((p) => `${p.x},${p.y}`));

  // create arrays for ticks
  const xs = Array.from({ length: SIZE }, (_, i) => i + gridMin);
  const ys = Array.from({ length: SIZE }, (_, i) => gridMax - i);

  const labelWidth = 48;
  const headerHeight = 24;
  const gridWidth = labelWidth + SIZE * cellSize;
  const gridHeight = headerHeight + SIZE * cellSize;

  // helper to map grid coord to pixel center
  const toPixel = (x, y) => {
    const col = x - gridMin; // 0..SIZE-1
    const row = gridMax - y; // 0..SIZE-1
    const cx = labelWidth + col * cellSize + cellSize / 2;
    const cy = headerHeight + row * cellSize + cellSize / 2;
    return { cx, cy };
  };

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">
          2D Coordinate System ({gridMin}..{gridMax})
        </h1>
        <p className="text-sm text-gray-600">
          Click two cells to select points A and B.
        </p>
      </div>

      <div
        className="border"
        style={{ background: bgColor, width: gridWidth, height: gridHeight }}
      >
        <div
          style={{ position: "relative", width: gridWidth, height: gridHeight }}
        >
          {/* SVG overlay */}
          {showSvgLine && (
            <svg
              width={gridWidth}
              height={gridHeight}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                pointerEvents: "none",
              }}
            >
              {/* optionally draw grid lines (light) */}
              <defs>
                <style>{`.grid-line{stroke:#e5e7eb; stroke-width:1}`}</style>
              </defs>
              {/* vertical lines */}
              {Array.from({ length: SIZE + 1 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={labelWidth + i * cellSize}
                  y1={headerHeight}
                  x2={labelWidth + i * cellSize}
                  y2={gridHeight}
                  className="grid-line"
                />
              ))}
              {/* horizontal lines */}
              {Array.from({ length: SIZE + 1 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1={labelWidth}
                  y1={headerHeight + i * cellSize}
                  x2={gridWidth}
                  y2={headerHeight + i * cellSize}
                  className="grid-line"
                />
              ))}
              {/* exact mathematical line overlay */}
              {pointA &&
                pointB &&
                (() => {
                  const p0 = toPixel(pointA.x, pointA.y);
                  const p1 = toPixel(pointB.x, pointB.y);
                  return (
                    <line
                      x1={p0.cx}
                      y1={p0.cy}
                      x2={p1.cx}
                      y2={p1.cy}
                      stroke={lineColor}
                      strokeWidth={2}
                      strokeLinecap="round"
                      opacity={0.9}
                    />
                  );
                })()}
            </svg>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `${labelWidth}px repeat(${SIZE}, ${cellSize}px)`,
              gridTemplateRows: `${headerHeight}px repeat(${SIZE}, ${cellSize}px)`,
            }}
          >
            {/* top-left empty cell */}
            <div style={{ width: labelWidth, height: headerHeight }} />
            {/* x labels */}
            {xs.map((x) => (
              <div
                key={`xl-${x}`}
                className="flex items-center justify-center text-[10px] border-b"
                style={{ height: headerHeight }}
              >
                {x % 5 === 0 ? x : ""}
              </div>
            ))}

            {/* rows with y label + cells */}
            {ys.map((y) => (
              <React.Fragment key={`row-${y}`}>
                <div
                  className="flex items-center justify-center text-[10px] border-r"
                  style={{ width: labelWidth }}
                >
                  {y % 5 === 0 ? y : ""}
                </div>
                {xs.map((x) => {
                  const key = `${x},${y}`;
                  const selectedA = isSelected(x, y, pointA);
                  const selectedB = isSelected(x, y, pointB);
                  const onLine = lineSet.has(key);
                  // Only show colored rasterized line if showLine is true
                  const showCellLine = showLine && onLine;
                  return (
                    <div
                      key={key}
                      onClick={() => handleClick(x, y)}
                      className={`border border-gray-200 flex items-center justify-center text-[9px] cursor-pointer select-none`}
                      title={`(${x}, ${y})`}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        background: selectedA
                          ? "#a7f3d0"
                          : selectedB
                          ? "#bfdbfe"
                          : showCellLine
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
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
