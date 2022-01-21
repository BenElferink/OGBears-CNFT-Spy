import { useData } from '../contexts/DataContext'
import logo from '../assets/images/logo.png'
import Loading from './Loading'
import Charts from './Charts'
import Portfolio from './Portfolio'
import Donate from './Donate'

function Main() {
  const { floorData } = useData()

  return (
    <main className='main'>
      <header className='flex-evenly'>
        <img src={logo} alt='logo' style={{ maxWidth: '80vw' }} />
      </header>

      {floorData ? <Charts /> : <Loading />}

      <footer className='flex-evenly'>
        {floorData && <Portfolio />}
        <Donate />
      </footer>
    </main>
  )
}

export default Main
