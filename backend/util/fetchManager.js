import fetch from 'node-fetch'
import Logger from './logger.js'
import Urls from '../routes/urls.js'

const fileName = 'fetchManager.js'

async function fetchCountryData(countryCode3) {
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
}

export default {fetchCountryData}