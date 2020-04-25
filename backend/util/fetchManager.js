import fetch from 'node-fetch'
import Logger from './logger.js'
import Urls from '../routes/urls.js'
import express from 'express'
import Error from './errorManager.js'

const fileName = 'fetchManager.js'

/* async function fetchCountryData(countryCode3) {
    try {
        Logger.info((fileName, `Fetching country data for ${countryCode3}`))
        const countryDataFetch = await fetch(Urls.COUNTRY_INFO_URL(countryCode3))
        const countryDataJson = await countryDataFetch.json()
        Logger.info((fileName, `Succesfully fetched country data for ${countryCode3}`))
        return countryDataJson

    } catch (err) {
        Logger.error(fileName, `Failed while trying to fetch country data for ${countryCode3}`, err)
        throw err
    }    
} */

async function fetchCountryData(countryCode3) {
    Logger.info(fileName, `Fetching country data for ${countryCode3}`)
    const r = await fetch(Urls.COUNTRY_INFO_URL(countryCode3))
    if (r.status === 200) {
        Logger.info(fileName, `Succesfully fetched country data for ${countryCode3}`)
        return r.json()
    } else {
        throw Error(r.status, 'Bad country request')
    }
}

/* async function fetchIpData(ip) {
    Logger.info(fileName, `Fetching ip data for '${ip}'`)
    try {
        const r = await fetch(Urls.IP_TRACKING_URL(ip))
        if (r.status === 200) {
            Logger.info(fileName, `Successfully fetched ip data for ${ip}`)
            return r.json()
        }
        else {
            const err = new Error('Bad ip request')
            err.status = r.status
            throw err
        }
    }
    catch (err) {
        throw err
    }
} */

async function fetchIpData(ip) {
    Logger.info(fileName, `Fetching ip data for ${ip}`)
    const r = await fetch(Urls.IP_TRACKING_URL(ip))
    if (r.status === 200)
        return r.json()
    else {
        throw Error(r.status, 'Bad ip request')
    }
}

export default {fetchCountryData, fetchIpData}