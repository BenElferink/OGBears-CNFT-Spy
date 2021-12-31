import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import Toggle from './Toggle'
import styles from '../styles/Charts.module.css'
import { getChartOptions, getChartSeries } from '../functions'

function Charts({ bearsData, floorData, isDesktop }) {
  const generateChartWidth = (width = window.innerWidth) => width - (isDesktop ? 750 : 70)
  const [chartWidth, setChartWidth] = useState(generateChartWidth())
  const [showThirtyDay, setShowThirtyDay] = useState(false)

  useEffect(() => {
    const handler = () => setChartWidth(generateChartWidth())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, []) // eslint-disable-line

  const chartOptions = getChartOptions(floorData, showThirtyDay)
  const chartSeries = getChartSeries(bearsData, floorData, showThirtyDay)

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
      </div>

      <Chart
        width={chartWidth}
        type='line'
        options={chartOptions}
        series={chartSeries}
      />
    </section>
  )
}

export default Charts
