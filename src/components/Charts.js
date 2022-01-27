import { useEffect, useState } from 'react'
import { useScreenSize } from '../contexts/ScreenSizeContext'
import { useData } from '../contexts/DataContext'
import { useLocalStorage } from '../hooks'
import { generateChartWidth, getChartOptions, getChartSeries } from '../functions'
import { MenuItem, Select } from '@mui/material'
import Chart from 'react-apexcharts'
import Toggle from './Toggle'
import { BLACK, BROWN, POLAR_MALE, POLAR_FEMALE, ZOMBIE, ICY } from '../constants'

function Charts() {
  const { isDesktop } = useScreenSize()
  const { floorData, bearsData } = useData()

  const [showThirtyDay, setShowThirtyDay] = useState(false)
  const [selectedType, setSelectedType] = useLocalStorage('ogb-selected-type', 'All')

  const [chartWidth, setChartWidth] = useState(generateChartWidth(window.innerWidth, isDesktop))

  useEffect(() => {
    const handler = () => setChartWidth(generateChartWidth(window.innerWidth, isDesktop))
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, []) // eslint-disable-line

  const chartOptions = getChartOptions(floorData, showThirtyDay)
  const chartSeries = getChartSeries(
    selectedType === 'All' ? bearsData.bears : bearsData.bears.filter(({ type }) => type === selectedType),
    floorData,
    showThirtyDay,
  )

  return (
    <section className='chart-container'>
      <div className='floor-chart-controls'>
        <Toggle
          name='chart-days'
          labelLeft='7d'
          labelRight='30d'
          state={{
            value: showThirtyDay,
            setValue: setShowThirtyDay,
          }}
        />

        <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <MenuItem value='All'>All</MenuItem>
          {bearsData.bears.map(({ type }) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </div>

      <Chart
        width={chartWidth}
        type='line'
        options={{
          ...chartOptions,
          colors:
            selectedType === 'All'
              ? [BROWN, BLACK, POLAR_MALE, POLAR_FEMALE, ZOMBIE, ICY]
              : selectedType === 'Brown'
              ? [BROWN]
              : selectedType === 'Black'
              ? [BLACK]
              : selectedType === 'Polar Bear (Male)'
              ? [POLAR_MALE]
              : selectedType === 'Polar Bear (Female)'
              ? [POLAR_FEMALE]
              : selectedType === 'Zombie'
              ? [ZOMBIE]
              : selectedType === 'Icy'
              ? [ICY]
              : [],
          grid: {
            show: false,
            row: {
              colors: ['var(--opacity-white)', 'transparent'],
            },
          },
        }}
        series={chartSeries}
      />
    </section>
  )
}

export default Charts
