import CurrenciesModel from '../models/currencies.model.js'
import Logger from './logger.js'

const fileName = 'currencyCalculator.js'


function convert(sourceRate, targetRate, sourceAmount) {
    CurrenciesModel.findOne({}, (err, currencies) => {
        try {
            const rates = JSON.parse(currencies.json).rates
            Logger.info(fileName, `About to convert ${sourceAmount} ${sourceRate} to ${targetRate}`)
            const baseAmount = sourceAmount / rates[sourceRate]
            const targetAmount = baseAmount * rates[targetRate]
            Logger.info(fileName, `${sourceAmount} ${sourceRate} are equivalent to ${targetAmount} ${targetRate}`)
        } catch (err) {
            Logger.info(fileName, 'Failed to convert', err)
        }
    })
}

function getUSDEquivalece(sourceRate) {
   return convert(sourceRate, USD, 1)
}

const USD = 'USD'
const EUR = 'EUR'


export default {convert}