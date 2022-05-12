import dynamic from 'next/dynamic'
import { Fragment, useState } from 'react'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import { useData } from '../../../contexts/DataContext'
import { useLocalStorage } from '../../../hooks'
import getChartOptions from '../../../functions/chart/getChartOptions'
import getPortfolioSeries from '../../../functions/chart/getPortfolioSeries'
import Modal from '..'
import Balance from './Balance'
import MyAssets from './MyAssets'
import AddAsset from './AddAsset'
import Toggle from '../../Toggle'
import { GREEN, RED } from '../../../constants/colors'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

function Portfolio({ open, onClose }) {
  const { isMobile, chartWidth } = useScreenSize()
  const { floorData } = useData()

  const [assets, setAssets] = useLocalStorage('ogb-assets', [])
  const [adding, setAdding] = useState(false)

  const [openDrawer, setOpenDrawer] = useState(false)
  const [showThirtyDay, setShowThirtyDay] = useState(!isMobile)

  const chartOptions = getChartOptions(floorData, showThirtyDay)
  const chartSeries = getPortfolioSeries(assets, floorData, showThirtyDay)

  return (
    <Fragment>
      <Modal title='Portfolio' open={open} onClose={onClose}>
        <Balance
          totalPayed={(() => {
            let val = 0
            assets.forEach(({ payed }) => {
              val += payed
            })
            return val
          })()}
          totalBalance={(() => {
            let val = 0
            assets.forEach(({ type }) => {
              val += floorData[type][floorData[type].length - 1]?.floor ?? 0
            })
            return val
          })()}
        />

        <section className='chart-container'>
          <div
            className='flex-row'
            style={{ width: '100%', justifyContent: 'space-evenly' }}
          >
            <Toggle
              labelLeft='7d'
              labelRight='30d'
              state={{
                value: showThirtyDay,
                setValue: setShowThirtyDay,
              }}
            />
            <div style={{ width: '42%' }} />
          </div>
          <Chart
            width={chartWidth}
            type='area'
            options={{
              ...chartOptions,
              colors: [
                'var(--yellow)',
                chartSeries[1].data[0] <
                chartSeries[1].data[chartSeries[1].data.length - 1]
                  ? GREEN
                  : RED,
              ],
              grid: {
                show: false,
              },
            }}
            series={chartSeries}
          />
        </section>

        <MyAssets
          assets={assets}
          setAssets={setAssets}
          setOpenDrawer={setOpenDrawer}
          adding={adding}
        />
      </Modal>

      <AddAsset
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        adding={adding}
        setAdding={setAdding}
        setAssets={setAssets}
      />
    </Fragment>
  )
}

export default Portfolio
