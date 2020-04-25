class CountryDataDTO {
    setIp(ip){this.ip = `IP: ${ip}`}
    setRequestDate(requestDate){this.requestDate = `Fecha actual: ${requestDate}`}
    setNameInfo(nativeName, name){this.name = `País: ${nativeName} (${name})`}
    setISOcode(ISOcode){this.ISOcode = `ISO Code: ${ISOcode}`}
    setCurrencyInfo(currency, USDequivalence){this.currencyInfo = `Moneda: ${currency} (1 ${currency} = ${USDequivalence} U$S)`}
    setLanguages(languages){
        this.languages = "Idiomas:"
        languages.forEach(l => this.languages += ` ${l.nativeName} (${l.iso639_1})`)
    }
    addLanguage(language){languages.push(`${language.nativeNamee}(${language.iso639_1})`)}
    setCurrentTimes(currentTimes){
        this.currentTimes = "Hora:"
        currentTimes.forEach(ct => this.currentTimes += ` ${ct.date.getHours()}:${ct.date.getMinutes()}:${ct.date.getSeconds()} (${ct.offset})`)
    }
    setDistanceInfo(coordinates, bsAsLtdLng){this.distanceInfo = `Distancia estimada: ${coordinates.distanceToBsAs}, (${bsAsLtdLng.latitude}, ${bsAsLtdLng.longitude}) a (${coordinates.latitude}, ${coordinates.longitude})`}
}

function create() {
    return new CountryDataDTO()
}

export default { 
    create
}