import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [storage, useStorage] = useState(null)

  useEffect(() => {
    fetch('https://podcast-api.netlify.app')
    .then(response => response.json())
    .then(data => data)
  }, [])

  return (
  
  )


  
}

export default App
