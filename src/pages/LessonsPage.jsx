import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import lessons from '../data/lessons'

function LessonsPage() {
  const [filter, setFilter] = useState('All')
  const navigate = useNavigate()

  // filter lessons based on selected level
  const filtered = filter === 'All'
    ? lessons
    : lessons.filter(l => l.level === filter)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Lessons</h1>
        <p className="text-gray-500 mb-8">Choose a lesson to start practicing</p>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-8">
          {['All', 'Beginner', 'Intermediate'].map(level => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === level
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Lesson Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(lesson => (
            <div
              key={lesson.id}
              onClick={() => navigate(`/lessons/${lesson.id}`)}
              className={`${lesson.color} ${lesson.borderColor} border-2 rounded-2xl p-6 cursor-pointer hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{lesson.emoji}</span>
                <span className="text-xs font-medium bg-white px-3 py-1 rounded-full text-gray-600">
                  {lesson.level}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{lesson.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{lesson.signs.length} signs</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-purple-600 font-medium">Start →</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default LessonsPage