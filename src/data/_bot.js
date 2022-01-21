import express from 'express'
import cron from 'node-cron'
import cors from 'cors'
import fs from 'fs'
import { exec } from 'child_process'
import getCurrentFloors from './functions/getCurrentFloors.js'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const bearsJsonFile = require('./bears.json')
const blockfrostJsonFile = require('./blockfrost.json')

const app = express()
app.use(express.json())
app.use(cors({ origin: '*'}))

app.get('/current-floor', async (req, res) => {
  try {
    const floorData = await getCurrentFloors(bearsJsonFile, blockfrostJsonFile)
    res.status(200).json(floorData)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})

const runCronJob = () => {
  console.log('running cron job')

  const newDate = new Date()
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  const timestamp = newDate.getTime()

  // manage git pull
  exec(
    'cd ../../ && git fetch && git pull --no-rebase',
    async (gitPullError, gitPullStdout, gitPullStderr) => {
      const floorData = await getCurrentFloors(bearsJsonFile, blockfrostJsonFile)

      Object.entries(floorData).forEach(([key, val]) => {
        const thisType = key
        const thisFloor = val.floor

        try {
          // save floor data to local database
          const floorData = JSON.parse(fs.readFileSync('./floor.json', 'utf8'))
          floorData[thisType].push({ floor: thisFloor, timestamp })
          while (floorData[thisType].length > 30) floorData[thisType].shift()
          fs.writeFileSync('./floor.json', JSON.stringify(floorData), 'utf8')
        } catch (error) {
          console.error(error)
        }
      })

      // manage git push
      exec(
        'cd ../../ && git add ./src/data/floor.json && git commit -m "🤖 BOT: updated database" && git push',
        (gitPushError, gitPushStdout, gitPushStderr) => {
          console.log('cron job finished')
        },
      )
    },
  )
}

cron.schedule('0 0 * * *', runCronJob, {
  scheduled: true,
  timezone: 'Asia/Jerusalem',
})

app.listen(8080, () => console.log('server running on port 8080'))
