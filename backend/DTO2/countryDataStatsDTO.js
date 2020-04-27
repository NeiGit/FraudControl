export class CountryDataStatsDTO {
    constructor() {
        this.stats = []
    }
    addCountryDataStat(countryDataStat) {
        this.stats.push({
            countryName: countryDataStat.name.native,
            distance: countryDataStat.coordinates.distanceToBsAs,
            requestCount: countryDataStat.requestCount
        })
    }
    setAverageDistance(averageDistance) {
        this.averageDistance = averageDistance }

    setFarestRequestInfo(countryName, distance) { 
        this.farestRequestInfo = {countryName : countryName, distance: distance}
    }    
    setNearestRequestInfo(countryName, distance) {this.nearestRequestInfo = {countryName : countryName, distance: distance}}
}    