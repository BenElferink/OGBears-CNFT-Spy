import { useState } from 'react'
import { useMarket } from '../contexts/MarketContext'
import traits from '../data/traits'
import { MenuItem, Select } from '@mui/material'
import Header from '../components/Header'
import Toggle from '../components/Toggle'
import MarketAssets from '../components/MarketAssets'

export default function Markets() {
  const { listedAssets, soldAssets } = useMarket()
  const sold = false
  const [highToLow, setHighToLow] = useState(false)
  const [filters, setFilters] = useState({})

  const sortedAssets = (sold ? soldAssets : listedAssets).sort((a, b) =>
    highToLow ? b.price - a.price : a.price - b.price
  )

  return (
    <main className='home-main'>
      <Header />
      <div className='flex-row' style={{ flexWrap: 'wrap' }}>
        {Object.entries(traits).map(([key, val]) => (
          <Select
            key={`select-${key}`}
            value={filters[key] ?? '-'}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, [key]: e.target.value }))
            }
          >
            <MenuItem value='-'>{key}</MenuItem>
            {/* {val.map(({ value, percent }) => (
              <MenuItem key={`select-${key}-item-${value}`} value={value}>
                {percent.toFixed(2)}% - {value}
              </MenuItem>
            ))} */}
            <MenuItem value='soon'>Coming soon...</MenuItem>
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
      <MarketAssets data={sortedAssets} />
    </main>
  )
}
