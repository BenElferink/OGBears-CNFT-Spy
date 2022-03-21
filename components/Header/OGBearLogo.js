import Image from 'next/image'
import { useScreenSize } from '../../contexts/ScreenSizeContext'

function OGBearLogo() {
  const { isMobile, isDesktop, chartWidth } = useScreenSize()

  const logoMultiplier = isMobile ? 0.777 : isDesktop ? 0.555 : 0.42069

  return (
    <a href='https://ogbears.com' target='_blank' rel='noopener noreferrer'>
      <Image
        src='/assets/images/logo.png'
        alt='OGBears logo'
        width={chartWidth * logoMultiplier}
        height={chartWidth * (logoMultiplier / 4.555)}
      />
    </a>
  )
}

export default OGBearLogo
