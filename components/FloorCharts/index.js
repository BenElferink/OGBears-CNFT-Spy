import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { useData } from '../../contexts/DataContext'
import { useLocalStorage } from '../../hooks'
import getChartOptions from '../../functions/chart/getChartOptions'
import getChartSeries from '../../functions/chart/getChartSeries'
import { MenuItem, Select } from '@mui/material'
import Toggle from '../Toggle'
import { BLACK, BROWN, POLAR_MALE, POLAR_FEMALE, ZOMBIE, ICY } from '../../constants/colors'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

function FloorCharts() {
  const { isMobile, chartWidth } = useScreenSize()
  const { floorData, bearsTraitsData } = useData()

  const [showThirtyDay, setShowThirtyDay] = useState(!isMobile)
  const [selectedType, setSelectedType] = useLocalStorage('ogb-selected-type', 'All')

  const chartOptions = getChartOptions(floorData, showThirtyDay)
  const chartSeries = getChartSeries(
    selectedType === 'All' ? bearsTraitsData.types : bearsTraitsData.types.filter((type) => type === selectedType),
    floorData,
    showThirtyDay
  )

  return (
    <section className='chart-container'>
      <div className='floor-chart-controls'>
        <Toggle
          labelLeft='7d'
          labelRight='30d'
          state={{
            value: showThirtyDay,
            setValue: setShowThirtyDay,
          }}
        />

        <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <MenuItem value='All'>All</MenuItem>
          {bearsTraitsData.types.map((type) => (
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

export default FloorCharts
