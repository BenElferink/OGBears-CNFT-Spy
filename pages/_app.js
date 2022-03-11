import Head from 'next/head'
import '../styles/index.css'
import { ScreenSizeProvider } from '../contexts/ScreenSizeContext'
import { DataProvider } from '../contexts/DataContext'
import { MarketProvider } from '../contexts/MarketContext'
import { TickerProvider } from '../contexts/TickerContext'

function MyApp({ Component, pageProps }) {
  return (
    <ScreenSizeProvider>
      <DataProvider>
        <MarketProvider>
          <TickerProvider>
            <Head>
              <meta name='viewport' content='width=device-width, initial-scale=1' />
              <meta name='description' content='OGBears NFT community market tool' />
              <title>CNFT Spy | OGBears</title>
              <link rel='icon' type='image/x-icon' href='/favicon.ico' />
              <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
              <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
              <link rel='apple-touch-icon' type='image/png' sizes='180x180' href='/apple-touch-icon.png' />
              <link rel='manifest' href='/manifest.json' />
            </Head>
            <div className='App'>
              <Component {...pageProps} />
            </div>
          </TickerProvider>
        </MarketProvider>
      </DataProvider>
    </ScreenSizeProvider>
  )
}

export default MyApp
