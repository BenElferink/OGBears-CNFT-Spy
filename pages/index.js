// import dynamic from 'next/dynamic'
import Head from 'next/head'
// import { useScreenSize } from '../contexts/ScreenSizeContext'
// const Main = dynamic(() => import('../components/Main'), { ssr: false })
// const Listings = dynamic(() => import('../components/Listings'), { ssr: false })

export default function Home() {
  // const { isDesktop } = useScreenSize()

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name='description' content='OGBears NFT community market tool' />
        <title>CNFT Spy | OGBears</title>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='apple-touch-icon' type='image/png' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
      </Head>

      {/* {isDesktop ? (
        <div className='App'>
          <Listings title='Recently Listed' sold={false} />
          <Main />
          <Listings title='Recently Sold' sold={true} />
        </div>
      ) : (
        <div className='App'>
          <Main />
          <Listings title='Recently Listed' sold={false} />
          <Listings title='Recently Sold' sold={true} />
        </div>
      )} */}

      <div className='maintenance'>
        Down for maintenance...
      </div>
    </div>
  )
}
