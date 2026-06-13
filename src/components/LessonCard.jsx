function LessonCard({ title, emoji, level }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', margin: '8px' }}>
      <span style={{ fontSize: '2rem' }}>{emoji}</span>
      <h3>{title}</h3>
      <p>Level: {level}</p>
    </div>
  )
}

export default LessonCard