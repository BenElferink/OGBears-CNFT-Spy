import getTypeSeries from './getTypeSeries'

function getPortfolioSeries(assets, floorData, isMonth) {
  const floorSeries = {
    name: 'Market Floors',
    data: new Array(isMonth ? 30 : 7).fill(0),
  }
  const assetSeries = {
    name: 'Expenses',
    data: new Array(isMonth ? 30 : 7).fill(0),
  }

  assets.forEach(({ type, payed, timestamp }) => {
    const typeObjects = floorData[type]
    const typeSeries = getTypeSeries(typeObjects, isMonth)[0]
    const isTimestampValid = (idx) =>
      typeObjects[typeObjects.length - ((isMonth ? 30 : 7) - idx)]?.timestamp >= timestamp

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
