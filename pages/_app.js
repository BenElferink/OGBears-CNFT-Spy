import '../styles/index.css'
import { ScreenSizeProvider } from '../contexts/ScreenSizeContext'
import { DataProvider } from '../contexts/DataContext'
import { MarketProvider } from '../contexts/MarketContext'

function MyApp({ Component, pageProps }) {
  return (
    <ScreenSizeProvider>
      <DataProvider>
        <MarketProvider>
          <Component {...pageProps} />
        </MarketProvider>
      </DataProvider>
    </ScreenSizeProvider>
  )
}

export default MyApp
