import Image from 'next/image'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import Navigation from './Navigation'

function Header() {
  const { chartWidth } = useScreenSize()

  return (
    <header
      className='flex-evenly'
      style={{ flexDirection: 'column', margin: '2rem 0' }}
    >
      <a href='https://ogbears.com' target='_blank' rel='noopener noreferrer'>
        <Image
          src='/assets/images/logo.png'
          alt='OG Bears logo'
          width={chartWidth * 0.555}
          height={chartWidth * (0.555 / 4.555)}
        />
      </a>
      <br />
      <Navigation />
    </header>
  )
}

export default Header
