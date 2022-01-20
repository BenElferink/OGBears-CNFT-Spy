import cron from 'node-cron'
import fs from 'fs'
import { exec } from 'child_process'
import getCurrentFloorData from './functions/getCurrentFloorData.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const bearsJsonFile = require('./bears.json')

const runCronJob = () => {
  console.log('running cron job')

  const newDate = new Date()
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  const timestamp = newDate.getTime()

  // manage git pull
  exec('cd ../../ && git fetch && git pull --no-rebase', async (gitPullError, gitPullStdout, gitPullStderr) => {
    const floorData = await getCurrentFloorData(bearsJsonFile)

    Object.entries(floorData).forEach(([key, val]) => {
      const thisType = key
      const thisFloor = val.floor

      try {
        // save floor data to local database
        const floorData = JSON.parse(fs.readFileSync('./floor-data.json', 'utf8'))
        floorData[thisType].push({ floor: thisFloor, timestamp })
        while (floorData[thisType].length > 30) floorData[thisType].shift()
        fs.writeFileSync('./floor-data.json', JSON.stringify(floorData), 'utf8')
      } catch (error) {
        console.error(error)
      }
    })

    // manage git push
    exec(
      'cd ../../ && git add ./src/data/floor-data.json && git commit -m "🤖 BOT: updated database" && git push',
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
