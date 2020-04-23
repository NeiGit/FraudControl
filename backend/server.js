import express from 'express'
import morgan from 'morgan'
import routes from './routes/routes.js'
import Database from './database.js'
import DatabaseManager from './util/databaseManager.js'
import fetch from 'node-fetch'
import Urls from './routes/urls.js'
import Logger from './util/logger.js'
import CurrencyCalculator from './util/currencyCalculator.js'


const app = express()
const fileName = "server.js"

// config
app.set('port', process.env.PORT || 3000)
app.listen()


// middleware
app.use(morgan('dev'))
app.use('/', routes)

app.listen(app.get('port'), () => {
    Logger.info(fileName, "Server listening on port ", app.get('port'))
    afterStartUp()
})

// after start up
async function afterStartUp() {

    await Database.init()

    Logger.info(fileName, "Fetching currencies daily info")
    try {
        const response = await fetch(Urls.CURRENCY_INFO_URL())
        const jsonData = await response.json()
        Logger.info(fileName, "Succesfully fetched currencies daily info.")
        DatabaseManager.updateOrCreateCurrenciesInfo(jsonData)
    } catch (err) {
        Logger.error(fileName, ("An error ocurred while fetching currencies daily info: " + err))
    }

    CurrencyCalculator.convert('ARS', 'USD', 110000)
}