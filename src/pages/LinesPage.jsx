import React, { useState } from "react";
import { Link } from "react-router-dom";
import Grid from "../components/Grid";
import Sidebar from "../components/Sidebar";

export default function LinesPage() {
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const [linePoints, setLinePoints] = useState([]);
  const [algo, setAlgo] = useState("slope-intercept");
  const [lineColor, setLineColor] = useState("#ff0000");
  const [bgColor, setBgColor] = useState("#ffffff");
  // grid range state
  const [gridMin, setGridMin] = useState(-20);
  const [gridMax, setGridMax] = useState(20);
  // show/hide rasterized line
  const [showLine, setShowLine] = useState(true);
  const [showSvgLine, setShowSvgLine] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar
        pointA={pointA}
        pointB={pointB}
        setPointA={setPointA}
        setPointB={setPointB}
        setLinePoints={setLinePoints}
        algo={algo}
        setAlgo={setAlgo}
        lineColor={lineColor}
        setLineColor={setLineColor}
        bgColor={bgColor}
        setBgColor={setBgColor}
        linePoints={linePoints}
        gridMin={gridMin}
        gridMax={gridMax}
        setGridMin={setGridMin}
        setGridMax={setGridMax}
        showLine={showLine}
        setShowLine={setShowLine}
        showSvgLine={showSvgLine}
        setShowSvgLine={setShowSvgLine}
      />
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
        <Grid
          pointA={pointA}
          pointB={pointB}
          setPointA={setPointA}
          setPointB={setPointB}
          linePoints={linePoints}
          setLinePoints={setLinePoints}
          algo={algo}
          lineColor={lineColor}
          bgColor={bgColor}
          gridMin={gridMin}
          gridMax={gridMax}
          showLine={showLine}
          showSvgLine={showSvgLine}
        />
      </main>
    </div>
  );
}
