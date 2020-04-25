class CountryDataStatsDTO {
    constructor() {
        this.countryDataStats = []
    }
    addCountryDataStat(countryDataStat) {
        this.countryDataStats.push(`País: ${countryDataStat.name.native} - Distancia: ${countryDataStat.coordinates.distanceToBsAs} kms - Invocaciones: ${countryDataStat.requestCount}`)
    } 
    setAverageDistance(averageDistance){this.averageDistance = `Distancia promedio: ${averageDistance}`}
}    

function create() {
    return new CountryDataStatsDTO()
}

export default { 
    create
}