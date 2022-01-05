import { useState } from 'react'
import { Button, Chip, useMediaQuery } from '@mui/material'
import { CreditCard, ContentCopy } from '@mui/icons-material'
import Modal from './Modal'
import { ADA_ADDRESS, ADA_ADDRESS_QR } from '../constants'

function Donate() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [open, setOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const copyAddress = () => {
    if (!isCopied) {
      navigator.clipboard.writeText(ADA_ADDRESS)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }

  return (
    <>
      <Button
        variant='contained'
        color='secondary'
        size={isMobile ? 'medium' : 'large'}
        startIcon={<CreditCard />}
        onClick={() => setOpen(true)}>
        Donate
      </Button>

      <Modal title='Donate (ADA address)' open={open} onClose={() => setOpen(false)}>
        <div
          style={{
            width: 'fit-content',
            height: 'fit-content',
            margin: '2rem 0',
            padding: '11px',
            borderRadius: '11px',
            backgroundColor: 'whitesmoke',
          }}>
          <img src={ADA_ADDRESS_QR} alt='' />
        </div>

        <Chip
          sx={{
            width: '200px',
            backgroundColor: 'whitesmoke',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '&:hover': {
              backgroundColor: 'whitesmoke',
            },
          }}
          label={isCopied ? 'Copied 👍' : ADA_ADDRESS}
          onClick={copyAddress}
          onDelete={copyAddress}
          deleteIcon={<ContentCopy />}
        />
      </Modal>
    </>
  )
}

export default Donate
