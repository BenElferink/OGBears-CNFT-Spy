import { createContext, useContext } from 'react'
import useWindowDimensions from '../hooks/useWindowDimensions'

// init context
const ScreenSizeContext = createContext()

// export the consumer
export function useScreenSize() {
  return useContext(ScreenSizeContext)
}

// export the provider (handle all the logic here)
export function ScreenSizeProvider({ children }) {
  const { width } = useWindowDimensions()

  const isMobile = width ? width <= 768 : true
  const isDesktop = width ? width >= 1440 : false
  const chartWidth = (() => {
    const val = width ? (width - (isDesktop ? 750 : 100)) : 0
    if (isDesktop && val >= 700) return 700
    return val
  })()

  return (
    <ScreenSizeContext.Provider value={{ isMobile, isDesktop, chartWidth }}>
      {children}
    </ScreenSizeContext.Provider>
  )
}
