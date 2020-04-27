import {Logger} from './logger.js'
import CurrenciesModel from '../models/currencies.model.js'
import CountryDataModel from '../models/countryData.model.js'
import Err from './errorManager.js'
import Database from '../database.js'
import DistanceCalculator from './distanceCalculator.js'




const logger =  new Logger('databaseManager.js')

async function updateOrCreateCurrenciesInfo(currenciesInfoJson) {
    logger.info("Persisting currencies info model")
    try {
        await CurrenciesModel.findOne((err, persisted) => {
            const currenciesInfoModel = persisted ? persisted : new CurrenciesModel()
                currenciesInfoModel.base = currenciesInfoJson.base
                currenciesInfoModel.date = currenciesInfoJson.date
                currenciesInfoModel.rates = currenciesInfoJson.rates
                currenciesInfoModel.save()
                logger.info("Succesfully persisted info model")
        })       
    } catch (err) {
        logger.error( "failed to persist currencies info model - ", err)
    }
}


function incrementCountryDataModelCounter(persistedCountryDataModel) {
    persistedCountryDataModel.requestCount ++
    if(persist(persistedCountryDataModel))
        logger.info(`Updated CountryData model for '${persistedCountryDataModel.name.name}'. With this request its counter reached ${persistedCountryDataModel.requestCount} hits`)
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
        checkDatabaseStatus()
        model.save()
        return true
    } catch (err) {
        logger.error( "Failed when trying to create new CountryData model", err)
        return false
    }
}

async function findPersistedCountryDataModel(countryCode3) {
    if(isDatabaseConnected()) 
        return CountryDataModel.findOne({ISOcode: countryCode3}, function(err, result) {
            if (err) return undefined
            else return result
        })
    else return undefined    
}

async function getAllCountryDataStatRecords() {
    checkDatabaseStatus()
    if (await getDocumentCount(CountryDataModel) > 0)
        return CountryDataModel.find({}, ('name.native coordinates.distanceToBsAs requestCount'), function(err, result) {
            if(err)
                throw err
            else {
                return result
            }
        })
    else throw Err(400, 'No hay peticiones registradas hasta el momento')     
             
}
async function getDocumentCount(model) {
    return await model.countDocuments({},function(err, count) { 
        if(err)
            throw err
        else {
            return count
        }
})}

function getCurrenciesModel() {
    checkDatabaseStatus()
        return CurrenciesModel.findOne()
}
function checkDatabaseStatus(){
    if(!isDatabaseConnected())
        throw Err(500, 'Database is not connected')
}

function isDatabaseConnected() {
    return Database.checkStatus() === 1
}

async function initDatabase () {
    await Database.init()
}

export default {
    initDatabase,
    updateOrCreateCurrenciesInfo, 
    createCountryDataModel, 
    incrementCountryDataModelCounter, 
    findPersistedCountryDataModel,
    isDatabaseConnected,
    getAllCountryDataStatRecords,
    getCurrenciesModel
}