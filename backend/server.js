import express from 'express'
import morgan from 'morgan'
import routes from './routes/routes.js'
import Database from './database.js'
import DatabaseManager from './util/databaseManager.js'
import Logger from './util/logger.js'
import FetchManager from './util/fetchManager.js'
import TimeCalculator from './util/timeCalculator.js'


const app = express()
const fileName = "server.js"


// config
app.set('port', process.env.PORT || 3000)
app.listen()

// currencies refresh rate
const CURRENCIES_INFO_REFETCH_INTERVAL = 2

// database connection retry process
let databaseRetryProcess
const DATABASE_RETRY_INTERVAL = 3

// middleware
app.use(morgan('dev'))
app.use('/', routes)

// express error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: {
            status: err.status,
            message: err.message
        }
    })
})

app.listen(app.get('port'), async () => {
    Logger.info(fileName, "Server listening on port ", app.get('port'))
    await afterStartup()
    if(!DatabaseManager.isDatabaseConnected()) {
        databaseRetryProcess = setInterval(afterStartup, TimeCalculator.seconds(DATABASE_RETRY_INTERVAL))
        Logger.info(fileName, `Database connection retry every ${DATABASE_RETRY_INTERVAL} seconds`)
    }
    console.log('- server is ready -')
})

async function refreshCurrenciesInfo() {
    try {
        const currenciestInfoJson = await FetchManager.fetchCurrenciesInfo()
        await DatabaseManager.updateOrCreateCurrenciesInfo(currenciestInfoJson)
    } catch (err) {
        Logger.error(fileName, ("An error ocurred while fetching currencies daily info: " + err))
    }
}

async function afterStartup() {
    await DatabaseManager.initDatabase()
    if (DatabaseManager.isDatabaseConnected()) {
        clearInterval(databaseRetryProcess)
        await refreshCurrenciesInfo()
        Logger.info(fileName, `Currencies info will be refetched every ${CURRENCIES_INFO_REFETCH_INTERVAL} minutes`)
        setInterval(refreshCurrenciesInfo, TimeCalculator.minutes(CURRENCIES_INFO_REFETCH_INTERVAL));
    }
}







