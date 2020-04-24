import Logger from './logger.js'
import CurrenciesModel from '../models/currencies.model.js'
import CountryDataModel from '../models/countryData.model.js'
import FetchManager from './fetchManager.js'



const fileName = 'databaseManager.js'

async function updateOrCreateCurrenciesInfo(jsonData) {
    Logger.info(fileName, "Updating or creating currencies info database registry")
    try {
        await CurrenciesModel.findOne(({}, (err, persisted) => {
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
        }))       
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

        countryDataModel.currencyRate = {
            rate: jsonCountryData.currencies[0].code,
            symbol: jsonCountryData.currencies[0].symbol
        }

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

async function createOrUpdateCountryData(countryCode3) {
    Logger.info(fileName, "Updating or creating CountryData model")
    try {
        await CountryDataModel.findOne({ISOcode : countryCode3}, async (err, persisted) => {
            if (persisted) {
                persisted.requestCount ++
                persisted.save()
                Logger.info(fileName, `Updated CountryData model for '${persisted.name.name}'. With this request its counter reached ${persisted.requestCount}`)
            } else {
                const countryDataJson = await FetchManager.fetchCountryData(countryCode3)
                await createCountryData(countryCode3, countryDataJson)
            }
            Logger.info(fileName, "Succesfully updated or created CountryData model")
        })
    } catch (err) {
        Logger.error(fileName, "Failed while trying to update or create CountryData model", err)
        throw err
    }
}



export default {
    updateOrCreateCurrenciesInfo, createOrUpdateCountryData
}