import Logger from './logger.js'
import CurrenciesModel from '../models/currencies.model.js'



const fileName = 'databaseManager.js'

async function updateOrCreateCurrenciesInfo(jsonData) {
    Logger.info(fileName, "Updating or creating currencies info database registry")
    try {
        CurrenciesModel.findOne(({}, (err, persisted) => {
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

export default {
    updateOrCreateCurrenciesInfo
}