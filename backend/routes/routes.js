import express from 'express'
import DatabaseManager from '../util/databaseManager.js'
import Logger from '../util/logger.js'
import FetchManager from '../util/fetchManager.js'
import ResponseManager from '../util/responseManager.js'

const router = express.Router()
const fileName = 'routes.js'

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
            // en este punto hay que ver si proceder a devolver la respuesta en paralalelo a la persistencia

            const newCountryDataModel = await DatabaseManager.createCountryDataModel(countryDataJson)

            const countryDataResponseJson = await ResponseManager.buildCountryDataResponseJson(newCountryDataModel, ip)
            res.json(countryDataResponseJson)
        }

    } catch (err) {
        next(err) 
    }
})




export default router    
