import { useState } from 'react'
import { Chip } from '@mui/material'
import { ContentCopy } from '@mui/icons-material'
import Modal from '../'
import { ADA_ADDRESS, ADA_ADDRESS_QR } from '../../../constants/ada'

function Tip({ open, onClose }) {
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
    <Modal title='Tip Jar' open={open} onClose={onClose}>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Please consider supporting the development and hosting of this FREE TO
        USE market tool.
        <br />
        Below is my ADA address, any tips and donations are welcome and
        appreciated!
      </p>

      <div
        style={{
          width: 'fit-content',
          height: 'fit-content',
          margin: '2rem 0',
          padding: '11px',
          borderRadius: '11px',
          backgroundColor: 'whitesmoke',
        }}
      >
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
  )
}

export default Tip
