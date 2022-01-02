import { useEffect, useState } from 'react'
import { Button, Drawer, IconButton, TextField, Typography, useMediaQuery } from '@mui/material'
import {
  Fingerprint,
  AddCircle,
  CloseRounded,
  ArrowCircleUp,
  ArrowCircleDown,
  CircleOutlined,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import Modal from './Modal'
import Toggle from './Toggle'
import Loading from './Loading'
import ListItem from './ListItem'
import ChangeGreenRed from './ChangeGreenRed'
import { useLocalStorage } from '../hooks'
import {
  formatNumber,
  getAssetFromBlockfrost,
  getImageFromIPFS,
  getChartOptions,
  getPortfolioSeries,
} from '../functions'
import { ADA_SYMBOL, GREEN, POLICY_ID, RED } from '../constants'
import addImage from '../assets/images/add.png'
import styles from '../styles/Charts.module.css'

const OPACITY_WHITE = 'rgba(250, 250, 250, 0.4)'

function Portfolio({ floorData }) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [assets, setAssets] = useLocalStorage('ogb-assets', [])

  const [openModal, setOpenModal] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [showThirtyDay, setShowThirtyDay] = useState(false)

  const [adding, setAdding] = useState(false)
  const [addBearId, setAddBearId] = useState('')
  const [addBearIdError, setAddBearIdError] = useState(false)
  const [addBearPrice, setAddBearPrice] = useState('')
  const [addBearPriceError, setAddBearPriceError] = useState(false)

  const addAsset = async () => {
    setAdding(true)
    let idValid = false
    let priceValid = false
    const addBearrIdTrimmed = Number(addBearId.replace('#', ''))

    if (addBearrIdTrimmed >= 1 && addBearrIdTrimmed <= 10000) idValid = true
    if (addBearPrice) priceValid = true

    if (!idValid || !priceValid) {
      setAddBearIdError(!idValid)
      setAddBearPriceError(!priceValid)
      setAdding(false)
      return
    }

    const assetData = await getAssetFromBlockfrost(addBearrIdTrimmed)
    if (!assetData) {
      setAdding(false)
      return
    }

    const {
      onchain_metadata: {
        name,
        image,
        attributes: { Type },
      },
    } = assetData

    const newDate = new Date()
    newDate.setHours(0)
    newDate.setMinutes(0)
    newDate.setSeconds(0)
    newDate.setMilliseconds(0)
    newDate.setDate(newDate.getDate() - 1)
    const timestamp = newDate.getTime()

    const payload = {
      id: Number(addBearrIdTrimmed),
      name,
      type: Type,
      image: getImageFromIPFS(image),
      payed: Number(addBearPrice),
      timestamp,
    }

    setAssets((prev) => {
      if (prev.some((obj) => obj.id === payload.id)) {
        return prev.map((obj) => {
          if (obj.id === payload.id) {
            return { ...obj, payed: payload.payed }
          }

          return obj
        })
      }

      return [...prev, payload].sort((a, b) => a.id - b.id)
    })
    setAdding(false)
    setOpenDrawer(false)
    setAddBearId('')
    setAddBearPrice('')
  }

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

  const generateChartWidth = (width = window.innerWidth) => {
    const x = width - (width < 768 ? 50 : 420)
    return x > 1700 ? 1700 : x
  }
  const [chartWidth, setChartWidth] = useState(generateChartWidth())

  useEffect(() => {
    const handler = () => setChartWidth(generateChartWidth())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, []) // eslint-disable-line

  const chartOptions = getChartOptions(floorData, showThirtyDay)
  const chartSeries = getPortfolioSeries(assets, floorData, showThirtyDay)

  return (
    <>
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
              backgroundColor: OPACITY_WHITE,
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
              backgroundColor: OPACITY_WHITE,
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
                  value={((100 / totalBalance) * (totalBalance - totalPayed)).toFixed(0)}
                  suffix='%'
                  invert
                  withCaret
                />
                <ChangeGreenRed
                  value={formatNumber(totalBalance - totalPayed)}
                  prefix={ADA_SYMBOL}
                  invert
                  withCaret
                />
              </div>
            </div>
          </div>
        </div>

        <section className={styles.chartContainer}>
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
              width: isMobile ? 'calc(100vw - 2rem)' : `${generateChartWidth(window.innerWidth) + 100}px`,
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
                style={{ margin: '1rem', backgroundColor: OPACITY_WHITE }}
                flipToSide={isMobile}
                price='DD NEW'
                name='Click to add new asset'
                imageSrc={addImage}
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
                    style={{ margin: '1rem', backgroundColor: OPACITY_WHITE }}
                    flipToSide={isMobile}
                    name={name}
                    price={formatNumber(payed)}
                    imageSrc={image}
                    itemUrl={`https://pool.pm/${POLICY_ID}.${id}`}
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

      <Drawer
        anchor='bottom'
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{ zIndex: '999999' }}>
        <div
          className='flex-col'
          style={{
            maxWidth: '550px',
            width: '100%',
            margin: '1rem auto',
            padding: '0.5rem 1rem',
            alignItems: 'unset',
          }}>
          <TextField
            label='Bear ID'
            placeholder='#5935'
            varient='outlined'
            value={addBearId}
            onChange={(e) => {
              setAddBearId(e.target.value)
              setAddBearIdError(false)
            }}
            error={addBearIdError}
            sx={{ margin: '0.4rem 0' }}
          />
          <TextField
            label='ADA Payed'
            placeholder={`${ADA_SYMBOL}200`}
            varient='outlined'
            value={addBearPrice}
            onChange={(e) => {
              setAddBearPrice(e.target.value)
              setAddBearPriceError(false)
            }}
            error={addBearPriceError}
            sx={{ margin: '0.4rem 0' }}
          />

          {adding ? (
            <Loading />
          ) : (
            <Button
              variant='contained'
              color='secondary'
              size='large'
              startIcon={<AddCircle />}
              onClick={addAsset}
              sx={{ margin: '0.4rem 0' }}>
              Add
            </Button>
          )}
        </div>
      </Drawer>
    </>
  )
}

export default Portfolio
