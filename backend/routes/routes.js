import express from 'express'
import fetch from 'node-fetch'
import DataModel from '../models/countryData.model.js'
import RequestValidator from '../util/requestValidator.js'
import Urls from './urls.js'
import DatabaseManager from '../util/databaseManager.js'
import Logger from '../util/logger.js'

const router = express.Router()
const fileName = 'routes.js'

router.get('/', (req, res) => {
    res.send("Todo ok")
})

router.route('/home')
    .get((req, res) => {
        res.status(200).json({name: 'This is the placeholder HOME get form meli excercise'})
        DatabaseManager.createCountryData()
    })

router.route('/country/:code')
    .get((req, res) => {
        const country_query = req.params.code
        fetch(Urls.COUNTRY_INFO_URL(country_query))
        .then(res => {
            return res.json()
        })
        .then(data => {
            console.log(data)
            const stringData = JSON.stringify(data)
            const entry = new DataModel({
                countryData : stringData})
            entry.save().then(() => res.json(entry))
        })
        .catch( err =>  {
            console.log(err)
        })
    })

router.get('/traceip/:ip', async (req, res) => {
    try {
        Logger.info((fileName, `Fetching ip data for ${req.params.ip}`))
        const ipDataFetch = await fetch(Urls.IP_TRACKING_URL(req.params.ip))
        const ipDataJson = await ipDataFetch.json()
        Logger.info((fileName, `Successfully fetched ip data for ${req.params.ip}`))

        DatabaseManager.createOrUpdateCountryData(ipDataJson.countryCode3)

        /* Logger.info((fileName, `Fetching country data for ${ipDataJson.countryCode3}`))
        const countryDataFetch = await fetch(Urls.COUNTRY_INFO_URL(ipDataJson.countryCode3))
        const countryDataJson = await countryDataFetch.json()
        Logger.info((fileName, `Succesfully fetched country data for ${ipDataJson.countryCode3}`))

        DatabaseManager.createCountryData(countryDataJson) */

        res.status(200).send("OK")
    } catch (err) {
        res.send(err)
    }    
})



export default router    
