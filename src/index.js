import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './App'
import { ScreenSizeProvider } from './contexts/ScreenSizeContext'
import { FloorProvider } from './contexts/FloorContext'

ReactDOM.render(
  <React.StrictMode>
    <ScreenSizeProvider>
      <FloorProvider>
        <App />
      </FloorProvider>
    </ScreenSizeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
