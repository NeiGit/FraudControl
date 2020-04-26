import express from 'express'
import DatabaseManager from '../util/databaseManager.js'
import FetchManager from '../util/fetchManager.js'
import ResponseManager from '../util/responseManager.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.send("Welcome to Fraud Control. Trace an ip by requesting /traceip/AN_IP")
})

router.get('/traceip/:ip', async (req, res, next) => {
    try {
        const ip = req.params.ip
        const ipDataJson = await FetchManager.fetchIpData(ip)

        const countryCode3 = ipDataJson.countryCode3
        const persistedCountryDataModel = await DatabaseManager.findPersistedCountryDataModel(countryCode3)
        if (persistedCountryDataModel) {
            const countryDataResponseJson = await ResponseManager.buildCountryDataResponseJson(persistedCountryDataModel, ip)
            res.json(countryDataResponseJson)
            DatabaseManager.incrementCountryDataModelCounter(persistedCountryDataModel)
        } else {
            const countryDataJson = await FetchManager.fetchCountryData(countryCode3)
            countryDataJson.countryCode3 = countryCode3

            const newCountryDataModel = await DatabaseManager.createCountryDataModel(countryDataJson)

            const countryDataResponseJson = await ResponseManager.buildCountryDataResponseJson(newCountryDataModel, ip)
            res.json(countryDataResponseJson)
        }

    } catch (err) {
        next(err) 
    }
})

router.get('/statistics' , async (req, res, next) => {
    const countryDataStatRecords = await DatabaseManager.getAllCountryDataStatRecords()
    if(countryDataStatRecords.length) {
        const countryDataStatsResponseJson = ResponseManager.buildCountryDataStatsResponseJson(countryDataStatRecords)
        res.status(200).json(countryDataStatsResponseJson)
    } else {
        res.status(200).send("No hay peticiones registradas hasta el momento")
    }    
})




export default router    
