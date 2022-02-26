import { useState } from 'react'
import { useData } from '../../../contexts/DataContext'
import toHex from '../../../functions/toHex'
import getImageFromIPFS from '../../../functions/getImageFromIPFS'
import { Button, Drawer, TextField } from '@mui/material'
import { AddCircle } from '@mui/icons-material'
import Loading from '../../Loading'
import { ADA_SYMBOL } from '../../../constants/ada'
import { BEARS_POLICY_ID } from '../../../constants/policy-ids'

function AddAsset({ openDrawer, setOpenDrawer, adding, setAdding, setAssets }) {
  const { blockfrostData } = useData()

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

  return (
    <Drawer anchor='bottom' open={openDrawer} onClose={() => setOpenDrawer(false)} sx={{ zIndex: '999999' }}>
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
  )
}

export default AddAsset
