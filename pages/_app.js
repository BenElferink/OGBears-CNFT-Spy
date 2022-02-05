import '../styles/index.css'
import { ScreenSizeProvider } from '../contexts/ScreenSizeContext'
import { DataProvider } from '../contexts/DataContext'

function MyApp({ Component, pageProps }) {
  return (
    <ScreenSizeProvider>
      <DataProvider>
        <Component {...pageProps} />
      </DataProvider>
    </ScreenSizeProvider>
  )
}

export default MyApp
