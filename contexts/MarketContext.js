import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

// init context
const MarketContext = createContext()

// export the consumer
export function useMarket() {
  return useContext(MarketContext)
}

// export the provider (handle all the logic here)
export function MarketProvider({ children }) {
  const [listedAssets, setListedAssets] = useState([])
  const [soldAssets, setSoldAssets] = useState([])

  const getListedBears = async ({ sold, page }) => {
    try {
      const res = (await axios.get(`/api/listings/bears?sold=${sold}&page=${page}`)).data
      return res
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const fetchAndSetListed = () => {
    // Get all LIVE listings from marketplaces
    getListedBears({ sold: false, page: 0 }).then((jpgItems) => {
      setListedAssets(jpgItems.sort((a, b) => new Date(b.date) - new Date(a.date)))
    })
  }

  const fetchAndSetSold = () => {
    // Get all SOLD listings from marketplaces
    getListedBears({ sold: true, page: 0 }).then((jpgItems) => {
      setSoldAssets(jpgItems.sort((a, b) => new Date(b.date) - new Date(a.date)))
    })
  }

  useEffect(() => {
    fetchAndSetListed()
    fetchAndSetSold()
  }, []) // eslint-disable-line

  return (
    <MarketContext.Provider
      value={{
        listedAssets,
        soldAssets,
      }}
    >
      {children}
    </MarketContext.Provider>
  )
}
