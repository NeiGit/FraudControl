import {Logger} from '../services/logger.js'
import DatabaseManager from '../managers/databaseManager.js'

const logger = new Logger('currencyCalculator.js')


/** Returns the result of converting given amount of sourceRate currency to the targetRate. Since the context chart (stored in CurrenciesModel) uses an specific rate as base for all currencies, the conversion is performed in two steps. The first one is to obtain the baseAmount, that is the equivalent base rate of sourceAmount, and then the final conversion (targetAmount) is obtained by multiplying targetRate by baseAmount. If sourceRate is not found, returns undefined
 * @param  {String} sourceRate
 * @param  {String} targetRate
 * @param  {Number} sourceAmount
 */
async function convert(sourceRate, targetRate, sourceAmount) {
    try {
        const currencies = await DatabaseManager.getCurrenciesModel()
        const {rates} = currencies
        logger.info(`About to convert ${sourceAmount} ${sourceRate} to ${targetRate}`)
        if (typeof rates[sourceRate] != 'undefined') {
            const baseAmount = sourceAmount / rates[sourceRate]
            const targetAmount = baseAmount * rates[targetRate]
            logger.info(`${sourceAmount} ${sourceRate} are equivalent to ${targetAmount.toFixed(4)} ${targetRate}`)
            return targetAmount
        } else return undefined

    } catch (err) {
        logger.error('Failed to convert', err)
        throw err
    }
}

async function getUSDEquivalence(sourceRate) {
    logger.info("Requested USD equivalence for " + sourceRate)
    return await convert(sourceRate, USD, UNIT)
}

const USD = 'USD'
const UNIT = 1



export default {getUSDEquivalence}