import React from 'react'
import { useScreenSize } from '../contexts/ScreenSizeContext'
import { Button } from '@mui/material'
import { Mouse as MouseIcon } from '@mui/icons-material'

function BaseButton({
  label = 'Button',
  onClick = () => alert('click'),
  icon: Icon = MouseIcon,
  bearTheme = false,
  selected = false,
}) {
  const { isMobile } = useScreenSize()

  return (
    <Button
      variant='contained'
      color='secondary'
      size={isMobile ? 'medium' : 'large'}
      fullWidth={isMobile}
      startIcon={<Icon />}
      onClick={onClick}
      style={
        bearTheme && selected
          ? {
              backgroundColor: 'var(--yellow)',
              color: 'var(--brown)',
            }
          : bearTheme && !selected
          ? {
              backgroundColor: 'var(--brown)',
              color: 'var(--yellow)',
            }
          : {}
      }
    >
      {label}
    </Button>
  )
}

export default BaseButton
