import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🤟</div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Learn Sign Language
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
          Use your camera to practice ASL in real time. 
          Get instant AI feedback on every sign you make.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/lessons"
            className="bg-purple-600 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors"
          >
            Start Learning
          </Link>
          <Link
            to="/practice"
            className="border border-purple-300 text-purple-600 px-8 py-3 rounded-full font-medium hover:bg-purple-50 transition-colors"
          >
            Free Practice
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-3">📷</div>
            <h3 className="font-semibold text-gray-800 mb-2">Camera Recognition</h3>
            <p className="text-sm text-gray-500">
              AI detects your hand signs in real time using your webcam
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-2">Instant Feedback</h3>
            <p className="text-sm text-gray-500">
              Know immediately if your sign is correct or needs adjustment
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="font-semibold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-sm text-gray-500">
              See your streaks, completed lessons and accuracy over time
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default HomePage