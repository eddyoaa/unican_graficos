import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LinesPage from "./pages/LinesPage";
import TwoDPage from "./pages/TwoDPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lines" element={<LinesPage />} />
        <Route path="/2d" element={<TwoDPage />} />
      </Routes>
    </BrowserRouter>
  );
}
