import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import getCurrentFloors from './data/functions/getCurrentFloors.js'
import crawlJPG from './data/functions/crawlJPG.js'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const bearsJsonFile = require('./data/bears.json')
const blockfrostJsonFile = require('./data/blockfrost.json')

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(cors({ origin: '*' }))

app.get('/current-floor', async (req, res) => {
  try {
    const floorData = await getCurrentFloors(bearsJsonFile, blockfrostJsonFile)
    res.status(200).json(floorData)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})

app.get('/jpg-listings', async (req, res) => {
  try {
    const result = await crawlJPG({ sold: false })
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})

app.get('/jpg-sales', async (req, res) => {
  try {
    const result = await crawlJPG({ sold: true })
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))
