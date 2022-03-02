const puppeteer = require('puppeteer')
const crawlJPG = require('../functions/markets/crawlJPG')

const POLICY_ID = require('../constants/policy-ids').BEAR_POLICY_ID
const SYNC_X_PATH = '//*[@id="app"]/div[2]/section[1]/div/div[2]/div[1]/div[2]/img'

const syncAsset = async (page, asset) => {
  await page.goto(`https://jpg.store/asset/${asset}`)
  await page.waitForXPath(SYNC_X_PATH)
  const [syncBtn] = await page.$x(SYNC_X_PATH)
  await syncBtn.click()
}

const run = async () => {
  try {
    const jpgFetchedData = (await crawlJPG({ policyId: POLICY_ID, sold: false })).sort((a, b) => a.price_lovelace - b.price_lovelace)
    console.log(`got ${jpgFetchedData.length} listings from jpg.store`)

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    for (let i = 0; i < jpgFetchedData.length; i++) {
      const { asset } = jpgFetchedData[i]
      console.log(`syncing asset ${i + 1}/${jpgFetchedData.length}: ${asset}`)
      
      try {
        await syncAsset(page, asset)
      } catch (error) {
        console.error(error)
        try {
          await syncAsset(page, asset)
        } catch (error) {
          console.error(error)
        }
      }
    }

    await browser.close()

    console.log('done!')
  } catch (error) {
    console.error(error)
  }
}

run()
