import express from 'express'
import fetch from 'node-fetch'
import DataModel from '../models/countryData.model.js'
import RequestValidator from '../util/requestValidator.js'
import Urls from './urls.js'
import DatabaseManager from '../util/databaseManager.js'
import Logger from '../util/logger.js'
import FetchManager from '../util/fetchManager.js'
import ResponseManager from '../util/responseManager.js'

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

/* router.get('/traceip/:ip', async (req, res) => {
    try {
        Logger.info(fileName, `Fetching ip data for ${req.params.ip}`)
        const ipDataFetch = await fetch(Urls.IP_TRACKING_URL(req.params.ip))
        const ipDataJson = await ipDataFetch.json()
        Logger.info(fileName, `Successfully fetched ip data for ${req.params.ip}`)

        await DatabaseManager.createOrUpdateCountryData(ipDataJson.countryCode3)

        res.status(200).send("OK")
    } catch (err) {
        res.send(err)
    }    
}) */

/* router.get('/traceip/:ip', (req, res, next) => {
    const ip = req.params.ip
    FetchManager.fetchIpData(ip)
    .then(ipDataJson => {
        const countryCode3 = ipDataJson.countryCode3
        FetchManager.fetchCountryData(countryCode3)
        .then(countryDataJson => res.json(countryDataJson))
        .catch(err => next(err))
    })
    .catch(err => next(err))    
}) */

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
