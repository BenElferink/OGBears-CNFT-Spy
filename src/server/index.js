import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import getCurrentFloors from './data/functions/getCurrentFloors.js'
import crawlCNFT from './data/functions/crawlCNFT.js'
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

app.get('/cnft-listed', async (req, res) => {
  try {
    const data = []

    for (let page = 1; true; page++) {
      const results = await crawlCNFT({ sold: false, sort: { price: 1 }, page })

      if (!results.length) break
      results.forEach((item) => data.push(item))
    }

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})

app.get('/cnft-sold', async (req, res) => {
  try {
    const data = []

    for (let page = 1; true; page++) {
      const results = await crawlCNFT({ sold: true, sort: { price: 1 }, page })

      if (!results.length) break
      results.forEach((item) => data.push(item))
    }

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})

app.get('/jpg-listed', async (req, res) => {
  try {
    const data = await crawlJPG({ sold: false })

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})

app.get('/jpg-sold', async (req, res) => {
  try {
    const data = await crawlJPG({ sold: true })

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))
