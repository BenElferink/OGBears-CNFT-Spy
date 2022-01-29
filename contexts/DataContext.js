import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import bearsJsonFile from '../data/bears'
import blockfrostJsonFile from '../data/blockfrost'
import floorJsonFile from '../data/floor'

// const FLOOR_DATA_URI = 'https://raw.githubusercontent.com/belferink1996/og-bears-cnft-spy/main/data/floor.json'
const FLOOR_DATA_LIVE_URI = '/api/floor'
const CNFT_LISTED_URI = '/api/listings/cnft'
const CNFT_SOLD_URI = '/api/listings/cnft?sold=true'
const JPG_LISTED_URI = '/api/listings/jpg'
const JPG_SOLD_URI = '/api/listings/jpg?sold=true'

// init context
const DataContext = createContext()

// export the consumer
export function useData() {
  return useContext(DataContext)
}

// export the provider (handle all the logic here)
export function DataProvider({ children }) {
  const bearsData = bearsJsonFile
  const blockfrostData = blockfrostJsonFile
  const [floorData, setFloorData] = useState(floorJsonFile)

  useEffect(() => {
    // get the 24h snapshots floor data
    // axios
    //   .get(FLOOR_DATA_URI)
    //   .then(({ data }) => {
    //     setFloorData(data)

    // then add LIVE floor data to the fetched snapshots
    axios
      .get(FLOOR_DATA_LIVE_URI)
      .then(({ data }) =>
        setFloorData((prev) => {
          const newState = { ...prev }

          Object.entries(data).forEach(([key, val]) => {
            newState[key].push({ ...val, timestamp: 'LIVE' })
          })

          return newState
        }),
      )
      .catch((error) => console.error(error))

    // })
    // .catch((error) => console.error(error))
  }, []) // eslint-disable-line

  const getCnftItems = async ({ sold }) => {
    let items = []

    if (sold) {
      try {
        const res = (await axios.get(CNFT_SOLD_URI)).data
        items = items.concat(res)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const res = (await axios.get(CNFT_LISTED_URI)).data
        items = items.concat(res)
      } catch (error) {
        console.error(error)
      }
    }

    return items
  }

  const getJpgItems = async ({ sold }) => {
    let items = []

    if (sold) {
      try {
        const res = (await axios.get(JPG_SOLD_URI)).data
        items = items.concat(res)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const res = (await axios.get(JPG_LISTED_URI)).data
        items = items.concat(res)
      } catch (error) {
        console.error(error)
      }
    }

    return items
  }

  return (
    <DataContext.Provider
      value={{
        bearsData,
        blockfrostData,
        floorData,
        getCnftItems,
        getJpgItems,
      }}>
      {children}
    </DataContext.Provider>
  )
}
