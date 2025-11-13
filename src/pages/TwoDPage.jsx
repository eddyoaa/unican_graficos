import { Link } from "react-router-dom";

export default function TwoDPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <div className="mb-6">
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

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            2D Algorithms
          </h1>
          <div className="space-y-6">
            <div className="border-l-4 border-indigo-500 pl-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                Coming Soon
              </h2>
              <p className="text-gray-600 text-lg">
                This section will contain interactive visualizations for 2D
                shape algorithms:
              </p>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  Circle rasterization algorithms
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  Ellipse drawing algorithms
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  Polygon filling techniques
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  Curve generation (Bézier, B-spline)
                </li>
              </ul>
            </div>

            <div className="mt-8 p-6 bg-indigo-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Note:</strong> The algorithms and interactive grid for
                2D shapes will be implemented here. Stay tuned!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
