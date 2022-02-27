import { useState } from 'react'
import { useMarket } from '../contexts/MarketContext'
import { useData } from '../contexts/DataContext'
import { useScreenSize } from '../contexts/ScreenSizeContext'
import traits from '../data/traits'
import { MenuItem, Select } from '@mui/material'
import Header from '../components/Header'
import Toggle from '../components/Toggle'
import MarketAssets from '../components/MarketAssets'

const BLANK = '-'

export default function Markets() {
  const { listedAssets } = useMarket()
  const { blockfrostData } = useData()
  const { isMobile } = useScreenSize()
  const [filters, setFilters] = useState({})
  const [highToLow, setHighToLow] = useState(false)

  const renderAssets = () => {
    const assetsWithMetaData = listedAssets.map((obj) => ({
      ...obj,
      attributes: blockfrostData.assets.find(
        ({ asset }) => asset === obj.assetId
      ).onchain_metadata.attributes,
    }))

    const filteredAssets = assetsWithMetaData.filter((obj) => {
      let isOk = true

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== BLANK && obj.attributes[key] !== value) {
          isOk = false
        }
      })

      return isOk
    })

    const sortedAssets = filteredAssets.sort((a, b) =>
      highToLow ? b.price - a.price : a.price - b.price
    )

    return sortedAssets
  }

  return (
    <main className='home-main'>
      <Header />
      <div className='flex-evenly' style={{ flexWrap: 'wrap' }}>
        {Object.entries(traits).map(([key, val]) => (
          <Select
            key={`select-${key}`}
            value={filters[key] ?? BLANK}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, [key]: e.target.value }))
            }
            style={{
              fontSize: isMobile ? '0.8rem' : '1rem',
              backgroundColor: filters[key] && filters[key] !== BLANK ? 'var(--yellow)' : 'unset',
            }}
          >
            <MenuItem value={BLANK}>{key}</MenuItem>
            {val.map(({ value, percent }) => (
              <MenuItem key={`select-${key}-item-${value}`} value={value}>
                {percent.toFixed(2)}% - {value}
              </MenuItem>
            ))}
          </Select>
        ))}

        <div
          style={{
            width: '150px',
            height: '58px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--opacity-white)',
            border: '1px solid black',
            borderRadius: '4px',
            fontSize: isMobile ? '0.8rem' : '1rem',
          }}
        >
          <Toggle
            labelLeft='Asc'
            labelRight='Desc'
            state={{
              value: highToLow,
              setValue: setHighToLow,
            }}
          />
        </div>
      </div>
      <MarketAssets data={renderAssets()} />
    </main>
  )
}
