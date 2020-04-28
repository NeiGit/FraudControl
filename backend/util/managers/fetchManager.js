import fetch from 'node-fetch'
import {Logger} from '../services/logger.js'
import Urls from '../../routes/urls.js'
import Error from '../services/errorBuilder.js'

const logger = new Logger('fetchManager.js')

async function  fetchCurrenciesInfo() {
    logger.info(`Fetching currencies info`)
    const r = await fetch(Urls.CURRENCY_INFO_URL())
    if (r.status === 200) {
        logger.info("Succesfully fetched currencies daily info.")
        const currenciesInfoJson = await r.json()
        if (currenciesInfoJson.success)
            return currenciesInfoJson
        else 
            throw Error(400, 'Invalid currencies info json')

    } else {
        logger.error( 'Bad currencies request')
        throw Error(r.status, 'Bad currencies request')
    }
}

async function fetchCountryData(countryCode3) {
    logger.info(`Fetching country data for ${countryCode3}`)
    const r = await fetch(Urls.COUNTRY_INFO_URL(countryCode3))
    if (r.status === 200) {
        logger.info(`Succesfully fetched country data for ${countryCode3}`)
        return r.json()
    } else {
        logger.error( `Failed while fetching country data for ${countryCode3}`)
        throw Error(r.status, 'La dirección ip ingresada no corresponde a ningún país')
    }
}


async function fetchIpData(ip) {
    logger.info(`Fetching ip data for ${ip}`)
    const r = await fetch(Urls.IP_TRACKING_URL(ip))
    if (r.status === 200) {
        logger.info(`Succesfully fetched ip data for ${ip}`)
        return r.json()
    } else {
        logger.error( `Failed while fetching ip data for ${ip}`)
        throw Error(r.status, 'Dirección ip inválida')
    }
}

export default {fetchCountryData, fetchIpData, fetchCurrenciesInfo}