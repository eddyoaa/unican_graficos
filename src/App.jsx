import React, { useState } from "react";
import Grid from "./components/Grid";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const [linePoints, setLinePoints] = useState([]);
  const [algo, setAlgo] = useState("slope-basic");
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
