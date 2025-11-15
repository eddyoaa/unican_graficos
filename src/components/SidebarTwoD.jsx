export default function SidebarTwoD({
  dx,
  setDx,
  dy,
  setDy,
  angle,
  setAngle,
  ccw,
  setCcw,
  sx,
  setSx,
  sy,
  setSy,
  shx,
  setShx,
  shy,
  setShy,
  reflectionM,
  setReflectionM,
  reflectionT,
  setReflectionT,
  reflectionEnabled,
  setReflectionEnabled,
  canvasSize,
  setCanvasSize,
  lineColor,
  setLineColor,
  bgColor,
  setBgColor,
  drawParallelogram,
}) {
  return (
    <aside
      className="w-80 p-4 bg-white shadow border-r border-gray-200"
      style={{ minHeight: "100vh", overflowY: "auto" }}
    >
      <h2 className="text-lg font-medium mb-4">Transformation Controls</h2>

      {/* Translation */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Translation</label>
        <div className="space-y-2">
          <div>
            <label className="text-sm">dx: {dx}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={dx}
              onChange={(e) => setDx(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="text-sm">dy: {dy}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={dy}
              onChange={(e) => setDy(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
        </div>
      </div>

      {/* Rotation */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Rotation</label>
        <div className="space-y-2">
          <div>
            <label className="text-sm">Angle: {angle}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={ccw}
              onChange={(e) => setCcw(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Counter-clockwise (CCW)</span>
          </label>
        </div>
      </div>

      {/* Scale */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Scale</label>
        <div className="space-y-2">
          <div>
            <label className="text-sm">sx: {sx.toFixed(2)}</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={sx}
              onChange={(e) => setSx(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="text-sm">sy: {sy.toFixed(2)}</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={sy}
              onChange={(e) => setSy(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
        </div>
      </div>

      {/* Shear */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Shear (Skew)</label>
        <div className="space-y-2">
          <div>
            <label className="text-sm">shx: {shx}°</label>
            <input
              type="range"
              min="-45"
              max="45"
              value={shx}
              onChange={(e) => setShx(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="text-sm">shy: {shy}°</label>
            <input
              type="range"
              min="-45"
              max="45"
              value={shy}
              onChange={(e) => setShy(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
        </div>
      </div>

      {/* Reflection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Reflection</label>
        <div className="space-y-2">
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={reflectionEnabled}
              onChange={(e) => setReflectionEnabled(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium">Enable Reflection</span>
          </label>
          <div className="text-sm text-gray-600 mb-2">y = m*x + t</div>
          <div>
            <label className="text-sm">m: {reflectionM.toFixed(2)}</label>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={reflectionM}
              onChange={(e) => setReflectionM(Number(e.target.value))}
              className="w-full mt-1"
              disabled={!reflectionEnabled}
            />
          </div>
          <div>
            <label className="text-sm">t: {reflectionT}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={reflectionT}
              onChange={(e) => setReflectionT(Number(e.target.value))}
              className="w-full mt-1"
              disabled={!reflectionEnabled}
            />
          </div>
        </div>
      </div>

      {/* Canvas & Colors */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Canvas & Colors
        </label>
        <div className="space-y-2">
          <div>
            <label className="text-sm">Canvas Size: {canvasSize}px</label>
            <input
              type="range"
              min="300"
              max="600"
              step="50"
              value={canvasSize}
              onChange={(e) => setCanvasSize(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Line Color</label>
            <input
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Background</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Redraw Button */}
      <button
        onClick={drawParallelogram}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        Redraw Figure
      </button>
    </aside>
  );
}
