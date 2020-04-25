import Logger from './logger.js'
import CountryDataDTO from '../DTOs/countryDataDTO.js'
import CurrencyCalculator from './currencyCalculator.js'
import DistanceCalculator from './distanceCalculator.js'

const fileName = 'responseManager.js'

async function buildCountryDataResponseJson(countryDataModel, ip) {
    Logger.info(fileName, 'Building CountryData json response')

    const dto = CountryDataDTO.create()
    dto.setIp(ip)

    const currentUtcDate = new Date()
    dto.setRequestDate(currentUtcDate.toLocaleString())

    dto.setNameInfo(countryDataModel.name.native, countryDataModel.name.name)
    dto.setISOcode(countryDataModel.ISOcode)
    //countryDataModel.languages.forEach(l => dto.addLanguage(l))
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
    const distanceToBsAs = DistanceCalculator.calculateDistanceBetweenCoordinates(countryDataModel.coordinates.latitude, countryDataModel.coordinates.longitude, bsAsLtdLng.latitude, bsAsLtdLng.longitude)
    dto.setDistanceInfo(countryDataModel.coordinates, bsAsLtdLng, distanceToBsAs.toFixed(0))

    return formatResponse(dto)
    // calculate current currency
}

function getHourDifference(timezone) {
    const hourDifference = parseFloat(timezone.substring(3))
    return isNaN(hourDifference) ? 0 : hourDifference
}

function formatResponse(dto) {
    return Object.keys(dto).map(function (key) { return dto[key]; })
}

const bsAsLtdLng = {latitude: -34, longitude: -64}
const currentUTCDate = (date) => {
    const utcMiliseconds = date.getTime()
    return new Date(utcMiliseconds)
}

function currentUTC () {
    return new Date(new Date().setHours(new Date().getHours() + 3)).getHours()
}

export default {buildCountryDataResponseJson}