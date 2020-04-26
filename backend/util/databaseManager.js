import Logger from './logger.js'
import CurrenciesModel from '../models/currencies.model.js'
import CountryDataModel from '../models/countryData.model.js'
import Err from './errorManager.js'
import Database from '../database.js'
import DistanceCalculator from './distanceCalculator.js'




const fileName = 'databaseManager.js'

async function updateOrCreateCurrenciesInfo(currenciesInfoJson) {
    Logger.info(fileName, "Persisting currencies info model")
    try {
        await CurrenciesModel.findOne((err, persisted) => {
            const currenciesInfoModel = persisted ? persisted : new CurrenciesModel()
                currenciesInfoModel.base = currenciesInfoJson.base
                currenciesInfoModel.date = currenciesInfoJson.date
                currenciesInfoModel.rates = currenciesInfoJson.rates
                currenciesInfoModel.save()
                Logger.info(fileName, "Succesfully persisted info model")
        })       
    } catch (err) {
        Logger.error(fileName, "failed to persist currencies info model - ", err)
    }
}


function incrementCountryDataModelCounter(persistedCountryDataModel) {
    persistedCountryDataModel.requestCount ++
    persistedCountryDataModel.save()
    Logger.info(fileName, `Updated CountryData model for '${persistedCountryDataModel.name.name}'. With this request its counter reached ${persistedCountryDataModel.requestCount} hits`)
}

async function createCountryDataModel(countryDataJson) {
    Logger.info(fileName, `Creating CountryData model for ${countryDataJson.name}`)
    try {
        if(!isDatabaseConnected()) throw new Error('Database is not connected')
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
        countryDataModel.save()
        Logger.info(fileName, `Created CountryData model for '${countryDataJson.name}'`)
        return countryDataModel
    } catch(err) {
        Logger.error(fileName, "Failed when trying to create new CountryData model", err)
        throw Err(500, `Failed when trying to create new CountryData model. ${err}` )
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

async function initDatabase () {
    await Database.init()
}

function isDatabaseConnected() {
    return Database.checkStatus() === 1
}

function getAllCountryDataStatRecords() {
    if(isDatabaseConnected()) 
        return CountryDataModel.find({}, ('name.native coordinates.distanceToBsAs requestCount'), function(err, result) {
            if(err)
                return undefined
            else {
                return result
            }
        })
    else return undefined    
}

export default {
    initDatabase,
    updateOrCreateCurrenciesInfo, 
    createCountryDataModel, 
    incrementCountryDataModelCounter, 
    findPersistedCountryDataModel,
    isDatabaseConnected,
    getAllCountryDataStatRecords
}