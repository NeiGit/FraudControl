export class CountryDataStatsDTO {
    constructor() {
        this.countryDataStats = []
    }
    /* addCountryDataStat(countryDataStat) {
        this.countryDataStats.push(`País: ${countryDataStat.name.native} - Distancia: ${countryDataStat.coordinates.distanceToBsAs} kms - Invocaciones: ${countryDataStat.requestCount}`)
    }  */
    addCountryDataStat(countryDataStat) {
        this.countryDataStats.push({
            country: countryDataStat.name.native,
            distance: countryDataStat.coordinates.distanceToBsAs,
            hits: countryDataStat.requestCount
        })
    }
    setAverageDistance(averageDistance){this.averageDistance = `Distancia promedio: ${averageDistance} kms`}

    setFarestRequestInfo(country, distance) {this.farestRequestInfo = `Invocación más lejana: ${country} ${distance} kms`}
    setNearestRequestInfo(country, distance) {this.nearestRequestInfo = `Invocación más cercana: ${country} ${distance} kms`}
}    