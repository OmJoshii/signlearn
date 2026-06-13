import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  // This checks which page we're on so we can highlight the active link
  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-purple-600">
          🤟 SignLearn
        </Link>

        {/* Nav links */}
        <div className="flex gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              isActive('/') ? 'text-purple-600' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Home
          </Link>
          <Link
            to="/lessons"
            className={`text-sm font-medium transition-colors ${
              isActive('/lessons') ? 'text-purple-600' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Lessons
          </Link>
          <Link
            to="/practice"
            className={`text-sm font-medium transition-colors ${
              isActive('/practice') ? 'text-purple-600' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Practice
          </Link>
        </div>

      </div>
    </nav>
  )
}

export default Navbar