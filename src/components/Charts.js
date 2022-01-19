import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import Toggle from './Toggle'
import styles from '../styles/Charts.module.css'
import { getChartOptions, getChartSeries } from '../functions'
import { useLocalStorage } from '../hooks'
import { MenuItem, Select } from '@mui/material'
import { BLACK, BROWN, POLAR_MALE, POLAR_FEMALE, ZOMBIE, ICY } from '../constants'

function Charts({ bearsData, floorData, isDesktop }) {
  const generateChartWidth = (width = window.innerWidth) => width - (isDesktop ? 750 : 70)
  const [chartWidth, setChartWidth] = useState(generateChartWidth())
  const [showThirtyDay, setShowThirtyDay] = useState(false)
  const [selectedType, setSelectedType] = useLocalStorage('ogb-selected-type', 'All')

  useEffect(() => {
    const handler = () => setChartWidth(generateChartWidth())
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
    <section className={styles.chartContainer}>
      <div className={styles.controls}>
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
        }}
        series={chartSeries}
      />
    </section>
  )
}

export default Charts
