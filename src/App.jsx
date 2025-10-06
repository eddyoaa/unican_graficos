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
        />
      </main>
    </div>
  );
}
