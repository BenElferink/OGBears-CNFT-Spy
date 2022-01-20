import { useEffect, useState } from 'react'
import Axios from 'axios'
import { useMediaQuery } from '@mui/material'
import Listings from './components/Listings'
import Main from './components/Main'
import bearsJsonFile from './data/bears'
import getCurrentFloorData from './data/functions/getCurrentFloorData'

function App() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [floorData, setFloorData] = useState(null)

  useEffect(() => {
    Axios.get(
      'https://raw.githubusercontent.com/belferink1996/og-bears-cnft-spy/main/src/data/floor-data.json',
    )
      .then((response) => {
        console.log(response)
        setFloorData(response.data)

        getCurrentFloorData(bearsJsonFile)
          .then((obj) =>
            setFloorData((prev) => {
              const newState = { ...prev }

              Object.entries(obj).forEach(([key, val]) => {
                newState[key].push({ ...val, timestamp: 'LIVE' })
              })

              return newState
            }),
          )
          .catch((error) => console.error(error))
      })
      .catch((error) => console.error(error))
  }, [])

  if (isDesktop) {
    return (
      <div className='App'>
        <Listings title='Recently Listed' options={{ sold: false }} />
        <Main bearsData={bearsJsonFile} floorData={floorData} isDesktop />
        <Listings title='Recently Sold' options={{ sold: true }} />
      </div>
    )
  }

  return (
    <div className='App'>
      <Main bearsData={bearsJsonFile} floorData={floorData} isDesktop={false} />
      <Listings title='Recently Listed' options={{ sold: false }} />
      <Listings title='Recently Sold' options={{ sold: true }} />
    </div>
  )
}

export default App
