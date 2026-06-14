import { useState, useEffect, useRef } from 'react'
import CameraView from '../components/CameraView'
import ModelTrainer from '../components/ModelTrainer'
import { predict, isModelReady } from '../utils/signModel'
import { SIGNS } from '../data/signData'

function PracticePage() {
  const [isActive,     setIsActive]     = useState(false)
  const [modelReady,   setModelReady]   = useState(false)
  const [landmarks,    setLandmarks]    = useState(null)
  const [prediction,   setPrediction]   = useState(null)
  const [targetSign,   setTargetSign]   = useState('B')
  const [score,        setScore]        = useState(0)
  const [feedback,     setFeedback]     = useState(null) // 'correct' | 'wrong'
  const lastPrediction = useRef(null)

  // Run prediction whenever landmarks change
  useEffect(() => {
    if (!landmarks || !modelReady) return

    const result = predict(landmarks)
    setPrediction(result)

    // Check if prediction matches target and it's a new prediction
    if (result && result.sign !== lastPrediction.current) {
      lastPrediction.current = result.sign

      if (result.sign === targetSign) {
        setFeedback('correct')
        setScore(s => s + 1)
        // Auto advance to next sign after 1.5 seconds
        setTimeout(() => {
          setFeedback(null)
          setTargetSign(SIGNS[Math.floor(Math.random() * SIGNS.length)])
          lastPrediction.current = null
        }, 1500)
      }
    }

    if (!result) {
      lastPrediction.current = null
    }
  }, [landmarks, modelReady, targetSign])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Practice Mode</h1>
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold">
            Score: {score}
          </div>
        </div>
        <p className="text-gray-500 mb-6">Show the sign to your camera and get instant feedback</p>

        {/* Train model first */}
        <ModelTrainer onReady={() => setModelReady(true)} />

        {/* Target sign to show */}
        {modelReady && (
          <div className={`rounded-2xl p-6 mb-6 text-center transition-colors ${
            feedback === 'correct' ? 'bg-green-100 border-2 border-green-400' :
            feedback === 'wrong'   ? 'bg-red-100 border-2 border-red-300' :
            'bg-white border-2 border-gray-200'
          }`}>
            {feedback === 'correct' ? (
              <>
                <div className="text-5xl mb-2">🎉</div>
                <p className="text-green-600 font-semibold text-lg">Correct!</p>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-2">Show this sign:</p>
                <div className="text-8xl font-bold text-purple-600 mb-2">{targetSign}</div>
                <p className="text-xs text-gray-400">ASL Letter {targetSign}</p>
              </>
            )}
          </div>
        )}

        {/* Camera */}
        <CameraView
          isActive={isActive}
          onLandmarks={setLandmarks}
        />

        {/* Start/stop button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsActive(!isActive)}
            disabled={!modelReady}
            className={`px-8 py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isActive
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isActive ? 'Stop Camera' : 'Start Camera'}
          </button>
        </div>

        {/* Current prediction display */}
        {prediction && modelReady && (
          <div className="mt-6 bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">AI sees:</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-purple-600">{prediction.sign}</span>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${prediction.confidence}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{prediction.confidence}% confidence</p>
              </div>
            </div>
          </div>
        )}

        {!prediction && isActive && modelReady && landmarks && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
            <p className="text-sm text-yellow-700">
              Hand detected but sign unclear. Try holding the sign more steadily.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default PracticePage