import { useState } from 'react'
import LessonCard from './components/LessonCard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '20px' }}>
      <h1>SignLearn</h1>

      <p>Signs practiced today: <strong>{count}</strong></p>
      <button onClick={() => setCount(count + 1)}>
        Practice one more
      </button>

      <h2>Lessons</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <LessonCard title="Alphabet A-F"  emoji="🤟" level="Beginner" />
        <LessonCard title="Alphabet G-L"  emoji="✋" level="Beginner" />
        <LessonCard title="Numbers 1-10"  emoji="👋" level="Beginner" />
      </div>
    </div>
  )
}

export default App