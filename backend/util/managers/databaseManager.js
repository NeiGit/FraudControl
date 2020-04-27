import {Logger} from '../services/logger.js'
import CurrenciesModel from '../../models/currencies.model.js'
import CounterModel from '../../models/counter.model.js'
import CountryDataModel from '../../models/countryData.model.js'
import Err from '../services/errorBuilder.js'
import Database from '../../database.js'
import DistanceCalculator from '../calculators/distanceCalculator.js'

const logger =  new Logger('databaseManager.js')

async function updateOrCreateCurrenciesInfo(currenciesInfoJson) {
    logger.info("Persisting currencies info model")
    try {
        await CurrenciesModel.findOne((err, persisted) => {
            const currenciesInfoModel = persisted ? persisted : new CurrenciesModel()
            const {base, date, rates} = currenciesInfoJson
                currenciesInfoModel.base = base
                currenciesInfoModel.date = date
                currenciesInfoModel.rates = rates
                currenciesInfoModel.save()
                logger.info("Succesfully persisted currencies info model")
        })       
    } catch (err) {
        logger.error("Failed when trying to persist currencies info model - ", err)
    }
}

function incrementCounter(ISOcode) {
    const hit = new CounterModel()
    hit.ISOcode = ISOcode
    persist(hit)
}

async function createCountryDataModel(countryDataJson) {
    logger.info(`Creating CountryData model for ${countryDataJson.name}`)
    try {
        const countryDataModel = new CountryDataModel()

        countryDataModel.ISOcode = countryDataJson.countryCode3 
        countryDataModel.name = {
            name: countryDataJson.name,
            native: countryDataJson.nativeName
        }

        countryDataJson.languages.forEach(l => {
            countryDataModel.languages.push({
                nativeName: l.nativeName,
                iso639_1: l.iso639_1
            })
        })

        countryDataModel.currency = countryDataJson.currencies[0].code,

        countryDataJson.timezones.forEach(tz => {
            countryDataModel.timezones.push(tz)
        })
        countryDataModel.coordinates = {
           latitude: countryDataJson.latlng[0],
           longitude: countryDataJson.latlng[1],
           distanceToBsAs: DistanceCalculator.getDistanceToBsAs(countryDataJson.latlng[0], countryDataJson.latlng[1], 0)
        }
        if(persist(countryDataModel))
            logger.info(`Created CountryData model for '${countryDataJson.name}'`)
        return countryDataModel
    } catch(err) {
        throw Err(500, `Failed when trying to create new CountryData model. ${err}` )
    }
}

function persist(model) {
    try {
        validateDatabaseStatus()
        model.save(function(err) {
            if(err)
                logger.warning("Model will not be persisted ", err)
        })
        return true
    } catch (err) {
        logger.error("Failed when trying to persist model", err)
        return false
    }
}

async function findPersistedCountryDataModel(countryCode3) {
    validateDatabaseStatus()
    return CountryDataModel.findOne({ISOcode: countryCode3}, function(err, result) {
        if (err) return undefined
        else return result
    }) 
}

async function getAllCountryDataStatRecords() {
    validateDatabaseStatus()
    if (await getDocumentCount(CountryDataModel) > 0)
        return CountryDataModel.find({}, ('ISOcode name.native coordinates.distanceToBsAs requestCount'), function(err, result) {
            if(err)
                throw err
            else {
                return result
            }
        })
    else throw Err(400, 'No hay peticiones registradas hasta el momento')     
             
}
async function getDocumentCount(model) {
    validateDatabaseStatus()
    return await model.countDocuments({},function(err, count) { 
        if(err)
            throw err
        else {
            return count
        }
})}

function getCurrenciesModel() {
    validateDatabaseStatus()
        return CurrenciesModel.findOne()
}

function validateDatabaseStatus(){
    if(!isDatabaseConnected())
        throw Err(500, 'Database is not connected')
}

function isDatabaseConnected() {
    return Database.checkStatus() === 1
}

async function initDatabase () {
    await Database.init()
}

async function getCounterCount(ISOcode) {
    return await CounterModel.countDocuments({ISOcode: ISOcode}, function(err, count) { 
        if(err)
            throw err
        else {
            return count
        }
    })
}


export default {
    initDatabase,
    updateOrCreateCurrenciesInfo, 
    createCountryDataModel, 
    incrementCounter, 
    findPersistedCountryDataModel,
    isDatabaseConnected,
    getAllCountryDataStatRecords,
    getCurrenciesModel,
    getCounterCount
}