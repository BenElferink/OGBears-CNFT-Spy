import React from 'react'
import Header from './Header'
import Charts from './Charts'
import Footer from './Footer'
import Loading from './Loading'

function Main({ bearsData, floorData, isDesktop }) {
  return (
    <main className='main'>
      <Header />
      {bearsData && floorData ? (
        <Fragment>
          <Charts bearsData={bearsData} floorData={floorData} isDesktop={isDesktop} />
          <Footer floorData={floorData} isDesktop={isDesktop} />
        </Fragment>
      ) : (
        <Loading />
      )}
    </main>
  )
}

export default Main
