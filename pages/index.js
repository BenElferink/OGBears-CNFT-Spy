import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useScreenSize } from '../contexts/ScreenSizeContext'
import Header from '../components/Header'
const FloorCharts = dynamic(() => import('../components/FloorCharts'), { ssr: false })
const ScrollableMarketAssetsList = dynamic(() => import('../components/ScrollableMarketAssetsList'), { ssr: false })

export default function Home() {
  const { isDesktop } = useScreenSize()

  const RenderMain = () => (
    <main className='main'>
      <Header />
      <FloorCharts />
    </main>
  )

  return (
    <div>
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

      {isDesktop ? (
        <div className='App'>
          <ScrollableMarketAssetsList />
          <RenderMain />
          <ScrollableMarketAssetsList sold />
        </div>
      ) : (
        <div className='App'>
          <RenderMain />
          <ScrollableMarketAssetsList />
          <ScrollableMarketAssetsList sold />
        </div>
      )}
    </div>
  )
}
