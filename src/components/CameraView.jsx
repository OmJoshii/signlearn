import { useEffect, useRef, useState } from 'react'
import { useHandTracking } from '../hooks/useHandTracking'

function CameraView({ isActive, onLandmarks }) {
  const videoRef              = useRef(null)
  const canvasRef             = useRef(null)
  const [camError, setCamError] = useState(null)
  const [camReady, setCamReady] = useState(false)

  // Request camera access
  useEffect(() => {
    if (!isActive) return

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width:  { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user' // front camera
          }
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          setCamReady(true)
        }
      } catch (err) {
        setCamError('Camera access denied. Please allow camera permission and refresh.')
        console.error(err)
      }
    }

    startCamera()

    // Stop camera when component unmounts or isActive becomes false
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop())
      }
    }
  }, [isActive])

  // Use our hand tracking hook
  const { isLoading, error, landmarks } = useHandTracking(videoRef, canvasRef, camReady && isActive)

  // Pass landmarks up to parent whenever they change
  useEffect(() => {
    if (onLandmarks) onLandmarks(landmarks)
  }, [landmarks])

  return (
    <div className="relative w-full max-w-lg mx-auto">

      {/* Camera not started yet */}
      {!isActive && (
        <div className="bg-gray-100 rounded-2xl aspect-video flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-5xl mb-3">📷</div>
            <p className="text-sm">Camera will start when you begin practicing</p>
          </div>
        </div>
      )}

      {/* Camera error */}
      {camError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-red-600 text-sm">{camError}</p>
        </div>
      )}

      {/* Video feed */}
      {isActive && !camError && (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
              <div className="text-center text-white">
                <div className="text-4xl mb-3 animate-pulse">🤟</div>
                <p className="text-sm">Loading hand tracking model...</p>
                <p className="text-xs text-gray-400 mt-1">First load may take a few seconds</p>
              </div>
            </div>
          )}

          {/* Video element — mirrored so it feels natural */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
            playsInline
            muted
          />

          {/* Canvas overlay for landmark drawing — also mirrored */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Hand detected indicator */}
          {!isLoading && (
            <div className="absolute top-3 left-3 z-10">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                landmarks
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 bg-opacity-70 text-gray-300'
              }`}>
                <div className={`w-2 h-2 rounded-full ${landmarks ? 'bg-white animate-pulse' : 'bg-gray-500'}`} />
                {landmarks ? 'Hand detected' : 'No hand detected'}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  )
}

export default CameraView