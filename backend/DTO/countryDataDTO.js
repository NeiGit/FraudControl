export class CountryDataDTO {
    
    setIp(ip){this.ip = ip}
    setRequestDate(requestDate){this.requestDate = requestDate}
    setNameInfo(nativeName, name){this.nameInfo = {nativeName, name}}
    setISOcode(ISOcode){this.ISOcode = ISOcode}
    setCurrencyInfo(rate, USDequivalence){
        this.currencyInfo = {rate: rate, USDequivalence: USDequivalence ? USDequivalence.toFixed(4) : undefined }
    }
    setLanguages(languages) {
        this.languages = ''
        languages.forEach(l => this.languages += `${l.nativeName} (${l.iso639_1}) `)
    }
    setCurrentTimes(currentTimes){
        this.currentTimes = ''
        currentTimes.forEach(ct => this.currentTimes += 
            `${ct.date} (${ct.offset}) `)
    }
    setDistanceInfo(coordinates, argLtdLng){
        this.distanceInfo = {
            distanceToBsAs: coordinates.distanceToBsAs,
            argLtdLng: `${argLtdLng.latitude}, ${argLtdLng.longitude}`,
            ltdLng: `${coordinates.latitude}, ${coordinates.longitude}`
        }
    }
}    
