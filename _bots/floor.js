const cron = require('node-cron')
const fs = require('fs')
const { exec } = require('child_process')
const getBearsFloor = require('../functions/markets/getBearsFloor')
const getCubsFloor = require('../functions/markets/getCubsFloor')

const getBears = async (timestamp) =>
  new Promise((resolve, reject) => {
    // manage git pull
    exec('git fetch && git pull --no-rebase', async (gitPullError, gitPullStdout, gitPullStderr) => {
      const floorData = await getBearsFloor()

      Object.entries(floorData).forEach(([key, val]) => {
        const thisType = key
        const thisFloor = val.floor

        try {
          // save floor data to local database
          const floorData = JSON.parse(fs.readFileSync('./data/floor/bears.json', 'utf8'))
          floorData[thisType].push({ floor: thisFloor, timestamp })
          while (floorData[thisType].length > 30) floorData[thisType].shift()
          fs.writeFileSync('./data/floor/bears.json', JSON.stringify(floorData), 'utf8')
        } catch (error) {
          console.error(error)
        }
      })

      // manage git push
      exec(
        'git add ./data/floor/bears.json && git commit -m "🤖 BOT: updated bears database" && git push',
        (gitPushError, gitPushStdout, gitPushStderr) => {
          resolve(true)
        }
      )
    })
  })

const getCubs = async (timestamp) =>
  new Promise((resolve, reject) => {
    // manage git pull
    exec('git fetch && git pull --no-rebase', async (gitPullError, gitPullStdout, gitPullStderr) => {
      const floorData = await getCubsFloor()

      Object.entries(floorData).forEach(([key, val]) => {
        const thisType = key
        const thisFloor = val.floor

        try {
          // save floor data to local database
          const floorData = JSON.parse(fs.readFileSync('./data/floor/cubs.json', 'utf8'))
          floorData[thisType].push({ floor: thisFloor, timestamp })
          while (floorData[thisType].length > 30) floorData[thisType].shift()
          fs.writeFileSync('./data/floor/cubs.json', JSON.stringify(floorData), 'utf8')
        } catch (error) {
          console.error(error)
        }
      })

      // manage git push
      exec(
        'git add ./data/floor/cubs.json && git commit -m "🤖 BOT: updated cubs database" && git push',
        (gitPushError, gitPushStdout, gitPushStderr) => {
          resolve(true)
        }
      )
    })
  })

const runCronJob = async () => {
  console.log('running cron job')

  const newDate = new Date()
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  const timestamp = newDate.getTime()

  try {
    await getBears(timestamp)
  } catch (error) {
    console.error(error)
  }

  try {
    await getCubs(timestamp)
  } catch (error) {
    console.error(error)
  }

  console.log('cron job finished')
}

cron.schedule('0 0 * * *', runCronJob, {
  scheduled: true,
  timezone: 'Asia/Jerusalem',
})
