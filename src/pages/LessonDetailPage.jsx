import { useParams, useNavigate } from 'react-router-dom'
import lessons from '../data/lessons'

function LessonDetailPage() {
  // useParams reads the :id from the URL
  const { id } = useParams()
  const navigate = useNavigate()

  const lesson = lessons.find(l => l.id === parseInt(id))

  // If lesson not found
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Lesson not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Back button */}
        <button
          onClick={() => navigate('/lessons')}
          className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1"
        >
          ← Back to lessons
        </button>

        {/* Lesson Header */}
        <div className={`${lesson.color} ${lesson.borderColor} border-2 rounded-2xl p-8 mb-6 text-center`}>
          <div className="text-6xl mb-4">{lesson.emoji}</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{lesson.title}</h1>
          <p className="text-gray-600">{lesson.description}</p>
        </div>

        {/* Signs in this lesson */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Signs you'll learn:</h2>
        <div className="grid grid-cols-5 gap-3 mb-8">
          {lesson.signs.map(sign => (
            <div
              key={sign}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center font-bold text-2xl text-purple-600 shadow-sm"
            >
              {sign}
            </div>
          ))}
        </div>

        {/* Start Practice Button */}
        <button
          onClick={() => navigate('/practice')}
          className="w-full bg-purple-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-purple-700 transition-colors"
        >
          Start Practicing with Camera →
        </button>

      </div>
    </div>
  )
}

export default LessonDetailPage