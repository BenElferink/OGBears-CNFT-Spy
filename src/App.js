import { useEffect, useState } from 'react'
import Axios from 'axios'
import { useMediaQuery } from '@mui/material'
import Listings from './components/Listings'
import Main from './components/Main'
import { FLOOR_DATA_URL, BEAR_DATA_URL } from './constants'

function App() {
  const [bearsData, setBearsData] = useState(null)
  const [floorData, setFloorData] = useState(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    Axios.get(BEAR_DATA_URL)
      .then((response) => setBearsData(response.data))
      .catch((error) => console.error(error))

    Axios.get(FLOOR_DATA_URL)
      .then((response) => setFloorData(response.data))
      .catch((error) => console.error(error))
  }, [])

  if (isDesktop) {
    return (
      <div className='App'>
        <Listings title='Recently Listed' options={{ sold: false }} />
        {bearsData && floorData && <Main bearsData={bearsData} floorData={floorData} isDesktop />}
        <Listings title='Recently Sold' options={{ sold: true }} />
      </div>
    )
  }

  return (
    <div className='App'>
      {bearsData && floorData && <Main bearsData={bearsData} floorData={floorData} isDesktop={false} />}
      <Listings title='Recently Listed' options={{ sold: false }} />
      <Listings title='Recently Sold' options={{ sold: true }} />
    </div>
  )
}

export default App
