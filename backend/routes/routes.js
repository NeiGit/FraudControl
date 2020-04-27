import express from 'express'
import DatabaseManager from '../util/managers/databaseManager.js'
import FetchManager from '../util/managers/fetchManager.js'
import ResponseManager from '../util/managers/responseManager.js'
const router = express.Router()

router.get('/', (req, res) => {
    res.send("Bienvenido al control de peticiones. Consulte información sobre cualquier dirección ip con un GET a /traceip/:ip. O consulte estadísticas con un GET a /stats")
})

router.get('/traceip/:ip', async (req, res, next) => {
    try {
        const ip = req.params.ip
        const ipDataJson = await FetchManager.fetchIpData(ip)

        const countryCode3 = ipDataJson.countryCode3
        const persistedCountryDataModel = await DatabaseManager.findPersistedCountryDataModel(countryCode3)

        if (persistedCountryDataModel) {
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
    try{
        const countryDataStatRecords = await DatabaseManager.getAllCountryDataStatRecords()
        if(countryDataStatRecords) {
            const countryDataStatsResponseJson = await ResponseManager.buildCountryDataStatsResponseJson(countryDataStatRecords)
            res.status(200).json(countryDataStatsResponseJson)
        } else {
            next()
        }
    } catch(err) {
        next(err) 
    }    
})

export default router    
