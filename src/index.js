import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './App'
import { ScreenSizeProvider } from './contexts/ScreenSizeContext'
import { DataProvider } from './contexts/DataContext'

ReactDOM.render(
  <React.StrictMode>
    <ScreenSizeProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </ScreenSizeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
