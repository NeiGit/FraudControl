const COUNTRY_INFO_URL = (query) => {
    return `https://restcountries.eu/rest/v2/alpha/${query}?fields=name;nativeName;capital;currencies;languages;latlng;timezones`
}

const IP_TRACKING_URL = (query) => {
    return `https://api.ip2country.info/ip?${query}`
}

const CURRENCY_INFO_URL = () => `http://data.fixer.io/api/latest?access_key=4505deab3de167c7928d0626eaffca17`


export default {
    IP_TRACKING_URL,
    COUNTRY_INFO_URL,
    CURRENCY_INFO_URL
}    
