import { CircularProgress } from '@mui/material'

function Loading() {
  return (
    <div style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
      <CircularProgress color='secondary' />
    </div>
  )
}

export default Loading
