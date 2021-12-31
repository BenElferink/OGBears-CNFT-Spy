import getDates from './getDates'

function getChartOptions(floorData, isMonth) {
  const options = {
    chart: {
      id: 'floor-chart-lines',
      type: 'line',
      stacked: false,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      // type: 'datetime',
      categories: getDates(floorData, isMonth),
    },
  }

  return options
}

export default getChartOptions
