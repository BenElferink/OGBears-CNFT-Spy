import Portfolio from './Portfolio'
import Donate from './Donate'

function Footer({ floorData, isDesktop }) {
  return (
    <footer className='flex-evenly'>
      {floorData && <Portfolio floorData={floorData} isDesktop={isDesktop} />}
      <Donate isDesktop={isDesktop} />
    </footer>
  )
}

export default Footer
