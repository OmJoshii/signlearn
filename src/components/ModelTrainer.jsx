import { useState } from 'react'
import { trainModel, isModelReady } from '../utils/signModel'

function ModelTrainer({ onReady }) {
  const [status,   setStatus]   = useState('idle') // idle | training | ready | error
  const [progress, setProgress] = useState(null)

  async function handleTrain() {
    setStatus('training')
    try {
      await trainModel((prog) => setProgress(prog))
      setStatus('ready')
      if (onReady) onReady()
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (status === 'idle') {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-center mb-6">
        <div className="text-4xl mb-3">🧠</div>
        <h3 className="font-semibold text-gray-800 mb-2">AI Model Not Trained Yet</h3>
        <p className="text-sm text-gray-500 mb-4">
          Click below to train the sign recognition model in your browser. Takes about 10 seconds.
        </p>
        <button
          onClick={handleTrain}
          className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          Train Model
        </button>
      </div>
    )
  }

  if (status === 'training') {
    const pct = progress ? Math.round((progress.epoch / progress.total) * 100) : 0
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl animate-spin">⚙️</div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Training model...</p>
            <p className="text-xs text-gray-500">Please wait, do not close this tab</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-blue-100 rounded-full h-2 mb-3">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        {progress && (
          <div className="flex justify-between text-xs text-gray-500">
            <span>Epoch {progress.epoch} / {progress.total}</span>
            <span>Accuracy: {progress.accuracy}%</span>
            <span>Loss: {progress.loss}</span>
          </div>
        )}
      </div>
    )
  }

  if (status === 'ready') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <div className="text-2xl">✅</div>
        <div>
          <p className="font-semibold text-green-800 text-sm">Model ready!</p>
          <p className="text-xs text-green-600">Sign recognition is active</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-center">
        <p className="text-red-600 text-sm">Training failed. Please refresh and try again.</p>
      </div>
    )
  }
}

export default ModelTrainer