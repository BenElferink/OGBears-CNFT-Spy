import dynamic from 'next/dynamic'
import Tip from '../Tip'
const Portfolio = dynamic(() => import('../Portfolio'), { ssr: false })

function Navigation() {
  return (
    <nav className='flex-evenly'>
      <Portfolio />
      <Tip />
    </nav>
  )
}

export default Navigation
