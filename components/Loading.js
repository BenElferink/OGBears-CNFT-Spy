import { CircularProgress } from '@mui/material'

function Loading({ color = 'var(--yellow)' }) {
  return (
    <div style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
      <CircularProgress style={{ color }} />
    </div>
  )
}

export default Loading
