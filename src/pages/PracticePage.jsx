import { useState } from 'react'
import CameraView from '../components/CameraView'

function PracticePage() {
  const [isActive, setIsActive]   = useState(false)
  const [landmarks, setLandmarks] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Practice Mode</h1>
        <p className="text-gray-500 mb-8">
          Show your hand to the camera. The AI will detect your hand landmarks in real time.
        </p>

        {/* Camera View */}
        <CameraView
          isActive={isActive}
          onLandmarks={setLandmarks}
        />

        {/* Start / Stop button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-3 rounded-full font-medium transition-colors ${
              isActive
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isActive ? 'Stop Camera' : 'Start Camera'}
          </button>
        </div>

        {/* Debug info — shows raw landmark data */}
        {landmarks && (
          <div className="mt-6 bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Hand landmarks detected: {landmarks.length} points
            </p>
            <p className="text-xs text-gray-500">
              Wrist position — x: {landmarks[0].x.toFixed(3)}, y: {landmarks[0].y.toFixed(3)}
            </p>
            <p className="text-xs text-gray-500">
              Index fingertip — x: {landmarks[8].x.toFixed(3)}, y: {landmarks[8].y.toFixed(3)}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default PracticePage