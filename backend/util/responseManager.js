import Logger from './logger.js'
import CountryDataDTO from '../DTOs/countryDataDTO.js'
import CurrencyCalculator from './currencyCalculator.js'
import DistanceCalculator, {ARG_COORDINATES} from './distanceCalculator.js'
import CountryDataStatsDTO from '../DTOs/countryDataStatsDTO.js'

const fileName = 'responseManager.js'

async function buildCountryDataResponseJson(countryDataModel, ip) {
    Logger.info(fileName, 'Building CountryData json response')

    const dto = CountryDataDTO.create()
    dto.setIp(ip)

    const currentUtcDate = new Date()
    dto.setRequestDate(currentUtcDate.toLocaleString())

    dto.setNameInfo(countryDataModel.name.native, countryDataModel.name.name)
    dto.setISOcode(countryDataModel.ISOcode)

    dto.setLanguages(countryDataModel.languages)
    const USDEquivalence = await CurrencyCalculator.getUSDEquivalence(countryDataModel.currency)
    dto.setCurrencyInfo(countryDataModel.currency, USDEquivalence.toFixed(4))

    const currentTimes = []

    countryDataModel.timezones.forEach(tz => {
        const hourDifference = getHourDifference(tz)
        const currentTime = new Date().setHours(currentUTC() + hourDifference)
        currentTimes.push({date : new Date(currentTime), offset: tz})
    })
    dto.setCurrentTimes(currentTimes)
    dto.setDistanceInfo(countryDataModel.coordinates, ARG_COORDINATES)

    return formatResponse(dto)
}

function getHourDifference(timezone) {
    const hourDifference = parseFloat(timezone.substring(3))
    return isNaN(hourDifference) ? 0 : hourDifference
}

function formatResponse(dto) {
    return Object.keys(dto).map(function (key) { return dto[key]; })
}

const currentUTCDate = (date) => {
    const utcMiliseconds = date.getTime()
    return new Date(utcMiliseconds)
}

function currentUTC () {
    return new Date(new Date().setHours(new Date().getHours() + 3)).getHours()
}

function buildCountryDataStatsResponseJson (countryDataStatRecords) {
    Logger.info(fileName, 'Building CountryDataStats json response')
    const dto = CountryDataStatsDTO.create()
    
    let distanceAccumulator = 0
    let requestAccumulator = 0

    let farestRequestDistance = Number.NEGATIVE_INFINITY
    let farestRequestCountry = ""

    let nearestRequestDistance = Number.POSITIVE_INFINITY
    let nearestRequestCountry = ""

    countryDataStatRecords.forEach(record => {
        if (record.coordinates.distanceToBsAs > farestRequestDistance) {
            farestRequestDistance = record.coordinates.distanceToBsAs
            farestRequestCountry = record.name.native
        }
        if (record.coordinates.distanceToBsAs < nearestRequestDistance) {
            nearestRequestDistance = record.coordinates.distanceToBsAs
            nearestRequestCountry = record.name.native
        }

        const distanceMetric = DistanceCalculator.getDistanceMetric(record)
        distanceAccumulator += distanceMetric
        requestAccumulator += record.requestCount
        dto.addCountryDataStat(record)
    })

    const averageDistance = DistanceCalculator.calculateAverageDistance(distanceAccumulator, requestAccumulator, 0)
    dto.setAverageDistance(averageDistance)

    dto.setFarestRequestInfo(farestRequestCountry, farestRequestDistance)
    dto.setNearestRequestInfo(nearestRequestCountry, nearestRequestDistance)

    return formatResponse(dto)
}


export default {buildCountryDataResponseJson, buildCountryDataStatsResponseJson}