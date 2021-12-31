import React from 'react'
import Header from './Header'
import Charts from './Charts'
import Footer from './Footer'

function Main({ bearsData, floorData, isDesktop }) {
  return (
    <main className='main'>
      <Header />
      <Charts bearsData={bearsData} floorData={floorData} isDesktop={isDesktop} />
      <Footer floorData={floorData} isDesktop={isDesktop} />
    </main>
  )
}

export default Main
