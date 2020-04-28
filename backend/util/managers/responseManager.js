import {Logger} from '../services/logger.js'
import {CountryDataDTO} from '../../DTO/countryDataDTO.js'
import CurrencyCalculator from '../calculators/currencyCalculator.js'
import DistanceCalculator, {ARG_COORDINATES} from '../calculators/distanceCalculator.js'
import {CountryDataStatsDTO} from '../../DTO/countryDataStatsDTO.js'
import TimeCalculator from '../calculators/timeCalculator.js'
import DatabaseManager from './databaseManager.js'

const logger = new Logger('responseManager.js')

/** Builds and returns a DTO from a given CountryDataModel and the requested ip. This is the final response the client gets. 
 * Adds required not-persisted info like USDequivalence and timezones. 
 * @param  {} countryDataModel
 * @param  {} ip
 */
async function buildCountryDataResponseJson(countryDataModel, ip) {
    logger.info( 'Building CountryData json response DTO from model')

    const dto = new CountryDataDTO()
    dto.setIp(ip)

    const currentUtcDate = new Date()
    dto.setRequestDate(currentUtcDate.toLocaleString())

    dto.setNameInfo(countryDataModel.name.native, countryDataModel.name.name)
    dto.setISOcode(countryDataModel.ISOcode)

    dto.setLanguages(countryDataModel.languages)

    const USDEquivalence = await CurrencyCalculator.getUSDEquivalence(countryDataModel.currency)

    dto.setCurrencyInfo(countryDataModel.currency, USDEquivalence)

    const currentTimes = []

    countryDataModel.timezones.forEach(tz => {
        const hourDifference = getHourDifference(tz)
        const currentTime = new Date().setHours(TimeCalculator.getCurrentUTCHours() + hourDifference)
        currentTimes.push({date : TimeCalculator.toTimeOnly(new Date(currentTime)), offset: tz})
    })
    
    dto.setCurrentTimes(currentTimes)
    dto.setDistanceInfo(countryDataModel.coordinates, ARG_COORDINATES)

    return dto
}


function getHourDifference(timezone) {
    const hourDifference = parseFloat(timezone.substring(3))
    return isNaN(hourDifference) ? 0 : hourDifference
}

function local(distanceToBsAs) {
    return distanceToBsAs === 0
}

/** Builds and returns a DTO response from a given array of statistics. This array consist in specific attributes collected from CountryDataModel database
 * collection. Also calculates not-persisted statistics like requests total count or average distance. 
 * @param  {} countryDataModel
 * @param  {} ip
 */

async function buildCountryDataStatsResponseJson (countryDataStatRecords) {
    logger.info('Building CountryDataStats json response DTO')
    const dto = new CountryDataStatsDTO()
    
    let distanceAccumulator = 0
    let requestAccumulator = 0

    let farestRequestDistance = Number.NEGATIVE_INFINITY
    let farestRequestCountry = ''

    let nearestRequestDistance = Number.POSITIVE_INFINITY
    let nearestRequestCountry = ''
    
    for (const record of countryDataStatRecords) {
        const {distanceToBsAs} = record.coordinates
        if ( distanceToBsAs > farestRequestDistance) {
            farestRequestDistance = distanceToBsAs
            farestRequestCountry = record.name.native
        }
        if (distanceToBsAs < nearestRequestDistance) {
            nearestRequestDistance = distanceToBsAs
            nearestRequestCountry = record.name.native
        }
        const requestCount = await DatabaseManager.getCounterCount(record.ISOcode)
        const distanceMetric = DistanceCalculator.getDistanceMetric(record, requestCount)
        requestAccumulator += requestCount
        distanceAccumulator += distanceMetric
        dto.addCountryDataStat(record, requestCount)
    }

    const averageDistance = DistanceCalculator.calculateAverageDistance(distanceAccumulator, requestAccumulator, 0)
    dto.setAverageDistance(averageDistance)

    dto.setFarestRequestInfo(farestRequestCountry, farestRequestDistance)
    dto.setNearestRequestInfo(nearestRequestCountry, nearestRequestDistance)

    return dto
}


export default {buildCountryDataResponseJson, buildCountryDataStatsResponseJson}