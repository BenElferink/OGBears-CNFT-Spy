import dynamic from 'next/dynamic'
import { Fragment } from 'react'
import { useScreenSize } from '../contexts/ScreenSizeContext'
import Header from '../components/Header'
const FloorCharts = dynamic(
  () => import('../components/FloorCharts'),
  { ssr: false }
)
const ScrollAssetsList = dynamic(
  () => import('../components/ScrollAssetsList'),
  { ssr: false }
)

export default function Home() {
  const { isDesktop } = useScreenSize()

  return (
    <Fragment>
      {isDesktop && <ScrollAssetsList />}

      <main className='home-main'>
        <Header />
        <FloorCharts />
      </main>

      {!isDesktop && <ScrollAssetsList />}
      <ScrollAssetsList sold />
    </Fragment>
  )
}
