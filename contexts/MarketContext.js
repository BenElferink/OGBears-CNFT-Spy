import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const CNFT_LISTED_URI = '/api/listings/cnft?page=0'
const CNFT_SOLD_URI = '/api/listings/cnft?page=0&sold=true'
const JPG_LISTED_URI = '/api/listings/jpg?page=0'
const JPG_SOLD_URI = '/api/listings/jpg?page=0&sold=true'

const CNFT_ENDPOINT = '/api/listings/cnft'
const JPG_ENDPOINT = '/api/listings/jpg'

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

  const getCnftItems = async ({ page = 1, sold = false }) => {
    try {
      const res = (
        await axios.get(`${CNFT_ENDPOINT}?page=${page}&sold=${sold}`)
      ).data
      return res
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const getJpgItems = async ({ page = 0, sold = false }) => {
    try {
      const res = (await axios.get(`${JPG_ENDPOINT}?page=${page}&sold=${sold}`))
        .data
      return res
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const fetchAndSetListed = () => {
    // Get all LIVE listings from marketplaces
    getJpgItems({ sold: false, page: 0 }).then((jpgItems) => {
      setListedAssets(jpgItems)
      getCnftItems({ sold: false, page: 1 }).then((cnftItems) => {
        setListedAssets((prev) =>
          [...prev, ...cnftItems].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )
        )
      })
    })
  }

  const fetchAndSetSold = () => {
    // Get all SOLD listings from marketplaces
    getJpgItems({ sold: true, page: 0 }).then((jpgItems) => {
      setSoldAssets(jpgItems)
      getCnftItems({ sold: true, page: 1 }).then((cnftItems) => {
        setSoldAssets((prev) =>
          [...prev, ...cnftItems].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )
        )
      })
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
