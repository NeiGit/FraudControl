import fetch from 'node-fetch'
import Logger from './logger.js'
import Urls from '../routes/urls.js'
import express from 'express'
import Error from './errorManager.js'

const fileName = 'fetchManager.js'

async function  fetchCurrenciesInfo() {
    Logger.info(fileName, `Fetching currencies info`)
    const r = await fetch(Urls.CURRENCY_INFO_URL())
    if (r.status === 200) {
        Logger.info(fileName, "Succesfully fetched currencies daily info.")
        const currenciesInfoJson = await r.json()
        if (currenciesInfoJson.success)
            return currenciesInfoJson
        else 
            throw Error(400, 'Invalid currencies info json')

    } else {
        Logger.error(fileName, 'Bad currencies request')
        throw Error(r.status, 'Bad currencies request')
    }
}

async function fetchCountryData(countryCode3) {
    Logger.info(fileName, `Fetching country data for ${countryCode3}`)
    const r = await fetch(Urls.COUNTRY_INFO_URL(countryCode3))
    if (r.status === 200) {
        Logger.info(fileName, `Succesfully fetched country data for ${countryCode3}`)
        return r.json()
    } else {
        Logger.error(fileName, `Failed while fetching country data for ${countryCode3}`)
        throw Error(r.status, 'Bad country request')
    }
}


async function fetchIpData(ip) {
    Logger.info(fileName, `Fetching ip data for ${ip}`)
    const r = await fetch(Urls.IP_TRACKING_URL(ip))
    if (r.status === 200) {
        Logger.info(fileName, `Succesfully fetched ip data for ${ip}`)
        return r.json()
    }
    else {
        Logger.error(fileName, `Failed while fetching ip data for ${ip}`)
        throw Error(r.status, 'Bad ip request')
    }
}

export default {fetchCountryData, fetchIpData, fetchCurrenciesInfo}