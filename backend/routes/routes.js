import express from 'express'
import DatabaseManager from '../util/managers/databaseManager.js'
import FetchManager from '../util/managers/fetchManager.js'
import ResponseManager from '../util/managers/responseManager.js'
import path from 'path'
import { fileURLToPath } from 'url';
import {Logger} from '../util/services/logger.js'

const router = express.Router()
const logger = new Logger('routes.js')


/** Default client view for consumig the server. Use only if cant access index.html
 */
router.get('/client', (req, res) => {
    const __dirname = fileURLToPath(import.meta.url);
    res.sendFile('index.html', {
        root: path.join(__dirname, '../../../client')
    })
})

router.get('/traceip/:ip', async (req, res, next) => {
    try {
        const ip = req.params.ip
        const ipDataJson = await FetchManager.fetchIpData(ip)

        const countryCode3 = ipDataJson.countryCode3
        const persistedCountryDataModel = await DatabaseManager.findPersistedCountryDataModel(countryCode3)

        if (persistedCountryDataModel) {
            logger.info(`Existing model found in database for ${countryCode3}`)
            DatabaseManager.incrementCounter(persistedCountryDataModel.ISOcode)
            const countryDataResponseJson = await ResponseManager.buildCountryDataResponseJson(persistedCountryDataModel, ip)
            res.json(countryDataResponseJson)

        } else {
            const countryDataJson = await FetchManager.fetchCountryData(countryCode3)
            countryDataJson.countryCode3 = countryCode3

            const newCountryDataModel = await DatabaseManager.createCountryDataModel(countryDataJson)
            DatabaseManager.incrementCounter(newCountryDataModel.ISOcode)

            const countryDataResponseJson = await ResponseManager.buildCountryDataResponseJson(newCountryDataModel, ip)
            res.json(countryDataResponseJson)
        }

    } catch (err) {
        next(err) 
    }
})

router.get('/stats' , async (req, res, next) => {
    try {
        const countryDataStatRecords = await DatabaseManager.getCountryDataStatsRecords()
        console.log(countryDataStatRecords)
        const countryDataStatsResponseJson = await ResponseManager.buildCountryDataStatsResponseJson(countryDataStatRecords)
        res.status(200).json(countryDataStatsResponseJson)
    } catch(err) {
        next(err) 
    }    
})

router.get('/stats/arg' , async (req, res, next) => {
    try {
        const countryDataStatRecords = await DatabaseManager.getCountryDataStatsRecords(true)
        console.log(countryDataStatRecords)
        const countryDataStatsResponseJson = await ResponseManager.buildCountryDataStatsResponseJson(countryDataStatRecords)
        res.status(200).json(countryDataStatsResponseJson)
    } catch(err) {
        next(err) 
    }    
})

export default router