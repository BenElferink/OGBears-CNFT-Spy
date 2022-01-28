import { useEffect, useRef, useState } from 'react'

const useWindowDimensions = () => {
  const mountRef = useRef(true)
  const [windowDimensions, setWindowDimensions] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    function handleResize() {
      if (mountRef.current)
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
    }
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      mountRef.current = false
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowDimensions
}

export default useWindowDimensions
