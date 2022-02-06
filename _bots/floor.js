const cron = require('node-cron')
const fs = require('fs')
const { exec } = require('child_process')
const getBearsFloor = require('../functions/markets/getBearsFloor')
const bearsJsonFile = require('../data/bears')
const blockfrostJsonFile = require('../data/blockfrost')

const runCronJob = async () => {
  console.log('running cron job')

  const newDate = new Date()
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  const timestamp = newDate.getTime()

  // manage git pull
  exec('git fetch && git pull --no-rebase', async (gitPullError, gitPullStdout, gitPullStderr) => {
    const floorData = await getBearsFloor(bearsJsonFile, blockfrostJsonFile)

    Object.entries(floorData).forEach(([key, val]) => {
      const thisType = key
      const thisFloor = val.floor

      try {
        // save floor data to local database
        const floorData = JSON.parse(fs.readFileSync('./data/floor.json', 'utf8'))
        floorData[thisType].push({ floor: thisFloor, timestamp })
        while (floorData[thisType].length > 30) floorData[thisType].shift()
        fs.writeFileSync('./data/floor.json', JSON.stringify(floorData), 'utf8')
      } catch (error) {
        console.error(error)
      }
    })

    // manage git push
    exec(
      'git add ./data/floor.json && git commit -m "🤖 BOT: updated database" && git push',
      (gitPushError, gitPushStdout, gitPushStderr) => {
        console.log('cron job finished')
      },
    )
  })
}

cron.schedule('0 0 * * *', runCronJob, {
  scheduled: true,
  timezone: 'Asia/Jerusalem',
})
