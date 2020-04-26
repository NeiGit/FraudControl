import CurrenciesModel from '../models/currencies.model.js'
import {Logger} from './logger.js'

const logger = new Logger('currencyCalculator.js')


/** Returns the result of converting given amount of sourceRate currency to the targetRate. Since the context chart (stored in CurrenciesModel) uses EUR as base rate for all currencies, the conversion is performed in two steps. The first one is to obtain the baseAmount, that is the equivalent EUR of sourceAmount, and then the final conversion (targetAmount) is obtained by multiplying targetRate by baseAmount.
 * @param  {String} sourceRate
 * @param  {String} targetRate
 * @param  {Number} sourceAmount
 */
async function convert(sourceRate, targetRate, sourceAmount) {
    try {
        const currencies = await CurrenciesModel.findOne()
        const {rates} = currencies
        logger.info(`About to convert ${sourceAmount} ${sourceRate} to ${targetRate}`)
        const baseAmount = sourceAmount / rates[sourceRate]
        const targetAmount = baseAmount * rates[targetRate]
        logger.info(`${sourceAmount} ${sourceRate} are equivalent to ${targetAmount.toFixed(4)} ${targetRate}`)
        return targetAmount
    } catch (err) {
        logger.info('Failed to convert', err)
    }
}

async function getUSDEquivalence(sourceRate) {
    logger.info("Requested USD equivalence for " + sourceRate)
    return await convert(sourceRate, USD, UNIT)
}

const USD = 'USD'
const UNIT = 1



export default {convert, getUSDEquivalence}