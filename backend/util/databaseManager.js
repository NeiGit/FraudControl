import Logger from './logger.js'
import CurrenciesModel from '../models/currencies.model.js'
import CountryDataModel from '../models/countryData.model.js'
import FetchManager from './fetchManager.js'
import Error from './errorManager.js'



const fileName = 'databaseManager.js'

async function updateOrCreateCurrenciesInfo(jsonData) {
    Logger.info(fileName, "Updating or creating currencies info database registry")
    try {
        await CurrenciesModel.findOne((err, persisted) => {
            if (persisted) {
                persisted.json = JSON.stringify(jsonData)
                persisted.save()
                Logger.info(fileName, "Currencies info succesfully updated")
            }
            else {
                const currenciesInfo = new CurrenciesModel(jsonData)
                currenciesInfo.save()
                Logger.info(fileName, "Currencies info succesfully created")
            }
        })       
    } catch (err) {
        Logger.error(fileName, "failed to update or create currencies info - " + err)
    }
}

async function createCountryData(countryCode3, jsonCountryData) {
    Logger.info(fileName, `Creating CountryData model for ${jsonCountryData.name}`)
    try {
        const countryDataModel = new CountryDataModel()

        countryDataModel.ISOcode = countryCode3 
        countryDataModel.name = {
            name: jsonCountryData.name,
            native: jsonCountryData.nativeName
        }

        jsonCountryData.languages.forEach(l => {
            countryDataModel.languages.push({
                nativeName: l.nativeName,
                iso639_1: l.iso639_1
            })
        })

        countryDataModel.currency = jsonCountryData.currencies[0].code,
        
        jsonCountryData.timezones.forEach(tz => {
            countryDataModel.timezones.push(tz)
        })
        countryDataModel.coordinates = {
           latitude: jsonCountryData.latlng[0],
           longitude: jsonCountryData.latlng[1] 
        }
        countryDataModel.save()
        Logger.info(fileName, `Created CountryData model for '${jsonCountryData.name}'`)
        return countryDataModel
    } catch(err) {
        Logger.error(fileName, "Failed when trying to create new CountryData model", err)
        throw err
    }
}

/* async function createOrUpdateCountryData(countryCode3) {
    Logger.info(fileName, "Updating or creating CountryData model")
    try {
        await CountryDataModel.findOne({ISOcode : countryCode3}, 
            async (err, persisted) => {
                try{
            if (persisted) {
                perssisted.requestCount ++
                persisted.save()
                Logger.info(fileName, `Updated CountryData model for '${persisted.name.name}'. With this request its counter reached ${persisted.requestCount}`)
            } else {
                const countryDataJson = await FetchManager.fetchCountryData(countryCode3)
                await createCountryData(countryCode3, countryDataJson)
            }
            Logger.info(fileName, "Succesfully updated or created CountryData model")
            } catch (err) { throw err }
        })
    } catch (err) {
        Logger.error(fileName, "Failed while trying to update or create CountryData model", err)
        throw err
    }
} */

function incrementCountryDataModelCounter(persistedCountryDataModel) {
    persistedCountryDataModel.requestCount ++
    persistedCountryDataModel.save()
    Logger.info(fileName, `Updated CountryData model for '${persistedCountryDataModel.name.name}'. With this request its counter reached ${persistedCountryDataModel.requestCount}`)
}

async function createCountryDataModel(countryDataJson) {
    Logger.info(fileName, `Creating CountryData model for ${countryDataJson.name}`)
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
           longitude: countryDataJson.latlng[1] 
        }
        countryDataModel.save()
        Logger.info(fileName, `Created CountryData model for '${countryDataJson.name}'`)
        return countryDataModel
    } catch(err) {
        Logger.error(fileName, "Failed when trying to create new CountryData model", err)
        throw Error(500, `Failed when trying to create new CountryData model. Error: ${err}` )
    }
}


async function findPersistedCountryDataModel(countryCode3) {
    return CountryDataModel.findOne({ISOcode: countryCode3})
}


export default {
    updateOrCreateCurrenciesInfo, createCountryDataModel, incrementCountryDataModelCounter, findPersistedCountryDataModel
}