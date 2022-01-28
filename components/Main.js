import { useScreenSize } from '../contexts/ScreenSizeContext'
import { useData } from '../contexts/DataContext'
import Image from 'next/image'
import Loading from './Loading'
import FloorCharts from './FloorCharts'
import Portfolio from './Portfolio'
import Donate from './Donate'

function Main() {
  const { chartWidth } = useScreenSize()
  const { floorData } = useData()

  return (
    <main className='main'>
      <header className='flex-evenly'>
        <a href='https://ogbears.com' target='_blank' rel='noopener noreferrer'>
          <Image
            src='/assets/images/logo.png'
            alt='OG Bears logo'
            width={chartWidth * 0.555}
            height={chartWidth * (0.555 / 4.555)}
          />
        </a>
      </header>

      {floorData ? <FloorCharts /> : <Loading />}

      <footer className='flex-evenly'>
        {floorData && <Portfolio />}
        <Donate />
      </footer>
    </main>
  )
}

export default Main
