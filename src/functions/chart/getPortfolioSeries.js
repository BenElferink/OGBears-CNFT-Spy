import getTypeSeries from './getTypeSeries'

function getPortfolioSeries(assets, floorData, isMonth) {
  const floorSeries = {
    name: 'Market Floors',
    data: new Array(isMonth ? 30 : 7).fill(null),
  }
  const assetSeries = {
    name: 'Expenses',
    data: new Array(isMonth ? 30 : 7).fill(null),
  }

  assets.forEach(({ type, payed, timestamp }) => {
    const typeObjects = floorData[type]
    const typeSeries = getTypeSeries(typeObjects, isMonth)[0]
    const isTimestampValid = (idx) => {
      const thisStamp = typeObjects[typeObjects.length - ((isMonth ? 30 : 7) - idx)]?.timestamp

      if (thisStamp === 'LIVE' || thisStamp >= timestamp) {
        return true
      }

      return false
    }

    floorSeries.data = floorSeries.data.map((num, i) => {
      if (isTimestampValid(i)) return num + typeSeries.data[i]
      return num
    })

    assetSeries.data = assetSeries.data.map((num, i) => {
      if (isTimestampValid(i)) return num + payed
      return num
    })
  })

  return [assetSeries, floorSeries]
}

export default getPortfolioSeries
