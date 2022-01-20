import { createContext, useContext } from 'react'
import { useMediaQuery } from '@mui/material'

// init context
const ScreenSizeContext = createContext()

// export the consumer
export function useScreenSize() {
  return useContext(ScreenSizeContext)
}

// export the provider (handle all the logic here)
export function ScreenSizeProvider({ children }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <ScreenSizeContext.Provider value={{ isDesktop, isMobile }}>
      {children}
    </ScreenSizeContext.Provider>
  )
}
