import dynamic from 'next/dynamic'
import { Fragment, useState } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { useData } from '../../contexts/DataContext'
import { useLocalStorage } from '../../hooks'
import formatNumber from '../../functions/formatters/formatNumber'
import getChartOptions from '../../functions/chart/getChartOptions'
import getPortfolioSeries from '../../functions/chart/getPortfolioSeries'
import { Button, IconButton, Typography } from '@mui/material'
import {
  Fingerprint,
  AddCircle,
  CloseRounded,
  ArrowCircleUp,
  ArrowCircleDown,
  CircleOutlined,
} from '@mui/icons-material'
import Modal from '../Modal'
import Toggle from '../Toggle'
import Loading from '../Loading'
import ListItem from '../ListItem'
import ChangeGreenRed from '../ChangeGreenRed'
import { ADA_SYMBOL } from '../../constants/ada'
import { BEARS_POLICY_ID } from '../../constants/policy-ids'
import { GREEN, RED } from '../../constants/colors'
import AddAsset from './AddAsset'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

function Portfolio() {
  const { isMobile, chartWidth } = useScreenSize()
  const { floorData } = useData()

  const [assets, setAssets] = useLocalStorage('ogb-assets', [])
  const [adding, setAdding] = useState(false)

  const [openModal, setOpenModal] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [showThirtyDay, setShowThirtyDay] = useState(false)

  const removeAsset = (id) => {
    setAssets((prev) => prev.filter((obj) => obj.id !== id))
  }

  const totalPayed = (() => {
    let totalPayed = 0
    assets.forEach(({ payed }) => {
      totalPayed += payed
    })
    return totalPayed
  })()

  const totalBalance = (() => {
    let totalBalance = 0
    assets.forEach(({ type }) => {
      totalBalance += floorData[type][floorData[type].length - 1]?.floor ?? 0
    })
    return totalBalance
  })()

  const chartOptions = getChartOptions(floorData, showThirtyDay)
  const chartSeries = getPortfolioSeries(assets, floorData, showThirtyDay)

  return (
    <Fragment>
      <Button
        variant='contained'
        color='secondary'
        size={isMobile ? 'medium' : 'large'}
        startIcon={<Fingerprint />}
        onClick={() => setOpenModal(true)}>
        Portfolio
      </Button>

      <Modal title='Portfolio' open={openModal} onClose={() => setOpenModal(false)}>
        <div className='flex-row' style={{ width: '100%', padding: '1rem' }}>
          <div
            className='flex-col'
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--opacity-white)',
              borderRadius: '0.5rem',
            }}>
            <p style={{ marginBottom: '11px' }}>Total Payed</p>
            <div className='flex-row'>
              <span style={{ fontSize: '2rem' }}>
                {ADA_SYMBOL}
                {formatNumber(totalPayed)}
              </span>
            </div>
          </div>
          <div
            className='flex-col'
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--opacity-white)',
              borderRadius: '0.5rem',
            }}>
            <p style={{ marginBottom: '11px' }}>Current Balance</p>
            <div className='flex-row'>
              <span style={{ fontSize: '2rem' }}>
                {ADA_SYMBOL}
                {formatNumber(totalBalance)}
              </span>
              <div className='flex-col' style={{ marginLeft: '0.5rem' }}>
                <ChangeGreenRed
                  value={formatNumber((((totalBalance - totalPayed) / totalPayed) * 100).toFixed(0))}
                  suffix='%'
                  invert
                  withCaret
                />
                <ChangeGreenRed
                  value={formatNumber((totalBalance - totalPayed).toFixed(0))}
                  prefix={ADA_SYMBOL}
                  invert
                  withCaret
                />
              </div>
            </div>
          </div>
        </div>

        <section className='chart-container'>
          <div className='flex-row' style={{ width: '100%', justifyContent: 'space-evenly' }}>
            <Toggle
              name='chart-days'
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
                chartSeries[1].data[0] < chartSeries[1].data[chartSeries[1].data.length - 1] ? GREEN : RED,
              ],
              grid: {
                show: false,
              },
            }}
            series={chartSeries}
          />
        </section>

        <div style={{ overflow: 'unset' }}>
          <div
            style={{
              width: '90%',
              height: '2px',
              margin: '2rem auto 1rem auto',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '11px',
            }}
          />
          <Typography variant='h6' sx={{ textAlign: 'center' }}>
            My Assets ({assets.length})
          </Typography>
          <div
            style={{
              width: isMobile ? 'calc(100vw - 2rem)' : `${chartWidth + 100}px`,
              height: 'fit-content',
              display: 'flex',
              flexFlow: 'row wrap',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {adding ? (
              <Loading />
            ) : (
              <ListItem
                htmlToolTipContent={<div>add new asset</div>}
                style={{ margin: '1rem', backgroundColor: 'var(--opacity-white)' }}
                flipToSide={isMobile}
                price='DD NEW'
                name='Click to add new asset'
                imageSrc='/assets/images/add.png'
                imageStyle={{ padding: '1rem' }}
                onClick={() => setOpenDrawer((prev) => !prev)}
                iconArray={[
                  {
                    icon: AddCircle,
                    txt: '',
                  },
                ]}
              />
            )}
            {assets.map(({ id, name, type, image, payed }) => {
              const priceDiff = floorData[type][floorData[type].length - 1]?.floor - payed

              return (
                <div key={id} style={{ position: 'relative' }}>
                  <IconButton
                    onClick={() => removeAsset(id)}
                    sx={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: '1' }}>
                    <CloseRounded />
                  </IconButton>
                  <ListItem
                    style={{ margin: '1rem', backgroundColor: 'var(--opacity-white)' }}
                    flipToSide={isMobile}
                    name={name}
                    price={formatNumber(payed)}
                    imageSrc={image}
                    itemUrl={`https://pool.pm/${BEARS_POLICY_ID}.${id}`}
                    iconArray={[
                      {
                        icon:
                          priceDiff > 0 ? ArrowCircleUp : priceDiff < 0 ? ArrowCircleDown : CircleOutlined,
                        txt: formatNumber(priceDiff),
                      },
                    ]}
                  />
                </div>
              )
            })}
          </div>
        </div>
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
