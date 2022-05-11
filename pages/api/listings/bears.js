import Axios from 'axios'
import formatJpgItem from '../../../functions/formatters/formatJpgItem'
import { BEAR_POLICY_ID } from '../../../constants/policy-ids'

const getJpgItems = (options = {}) => {
  const policyId = options.policyId ?? BEAR_POLICY_ID
  const sold = options.sold ?? false
  const page = options.page ?? 1

  return new Promise((resolve, reject) => {
    console.log('crawling jpg.store')

    Axios.get(`https://server.jpgstoreapis.com/policy/${policyId}/${sold ? 'sales' : 'listings'}?page=${page}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        const payload = response.data
        console.log(`got ${payload.length} items from jpg.store`)

        return resolve(payload)
      })
      .catch((error) => {
        console.error(error)

        return reject(error)
      })
  })
}

export default async (req, res) => {
  try {
    switch (req.method) {
      case 'GET': {
        const sold = req.query.sold == 'true'
        let page = (() => {
          const num = Number(req.query.page)
          return isNaN(num) ? 1 : num >= 1 ? num : 1
        })()

        const data = (await getJpgItems({ sold, page })).map((item) => formatJpgItem(item, { sold }))

        res.status(200).json(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
        break
      }

      default: {
        res.status(404).json({})
        break
      }
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({})
  }
}
