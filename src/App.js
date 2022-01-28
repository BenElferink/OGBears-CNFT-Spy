import { useEffect } from 'react'

const LINK = 'https://ogbears.vercel.app'

function App() {
  useEffect(() => {
    window.open(LINK, '_blank')
  }, [])

  return <a href={LINK}>{LINK}</a>
}

export default App
