import { Fragment, useEffect, useState } from 'react'
import { useScreenSize } from '../contexts/ScreenSizeContext'
import { useData } from '../contexts/DataContext'
import { useLocalStorage } from '../hooks'
import {
  formatNumber,
  getImageFromIPFS,
  getChartOptions,
  getPortfolioSeries,
  toHex,
  generateChartWidth,
} from '../functions'
import { Button, Drawer, IconButton, TextField, Typography } from '@mui/material'
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
import addImage from '../assets/images/add.png'
import { ADA_SYMBOL, BEARS_POLICY_ID, GREEN, RED } from '../constants'

function Portfolio() {
  const { isMobile, isDesktop } = useScreenSize()
  const { blockfrostData, floorData } = useData()

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
    const addBearIdTrimmed = Number(addBearId.replace('#', ''))

    if (addBearIdTrimmed >= 1 && addBearIdTrimmed <= 10000) idValid = true
    if (addBearPrice) priceValid = true

    if (!idValid || !priceValid) {
      setAddBearIdError(!idValid)
      setAddBearPriceError(!priceValid)
      setAdding(false)
      return
    }

    const assetId = `${BEARS_POLICY_ID}${toHex(addBearIdTrimmed)}`
    const blockfrostAsset = blockfrostData.assets.find((item) => item.asset === assetId)

    if (!blockfrostAsset) {
      setAdding(false)
      return
    }

    const {
      onchain_metadata: {
        name,
        image,
        attributes: { Type },
      },
    } = blockfrostAsset

    const newDate = new Date()
    newDate.setHours(0)
    newDate.setMinutes(0)
    newDate.setSeconds(0)
    newDate.setMilliseconds(0)
    newDate.setDate(newDate.getDate() - 1)
    const timestamp = newDate.getTime()

    const payload = {
      id: Number(addBearIdTrimmed),
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

  const [chartWidth, setChartWidth] = useState(generateChartWidth(window.innerWidth, isDesktop))

  useEffect(() => {
    const handler = () => setChartWidth(generateChartWidth(window.innerWidth, isDesktop))
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, []) // eslint-disable-line

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
              width: isMobile ? 'calc(100vw - 2rem)' : `${generateChartWidth(window.innerWidth, isDesktop) + 100}px`,
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
    </Fragment>
  )
}

export default Portfolio
