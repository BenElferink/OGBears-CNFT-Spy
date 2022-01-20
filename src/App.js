import { useScreenSize } from './contexts/ScreenSizeContext'
import Main from './components/Main'
import Listings from './components/Listings'

function App() {
  const { isDesktop } = useScreenSize()

  if (isDesktop) {
    return (
      <div className='App'>
        <Listings title='Recently Listed' options={{ sold: false }} />
        <Main />
        <Listings title='Recently Sold' options={{ sold: true }} />
      </div>
    )
  }

  return (
    <div className='App'>
      <Main />
      <Listings title='Recently Listed' options={{ sold: false }} />
      <Listings title='Recently Sold' options={{ sold: true }} />
    </div>
  )
}

export default App
