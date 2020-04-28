import express from 'express'
import morgan from 'morgan'
import routes from './routes/routes.js'
import cors from 'cors'
import DatabaseManager from './util/managers/databaseManager.js'
import FetchManager from './util/managers/fetchManager.js'
import TimeCalculator from './util/calculators/timeCalculator.js'
import {Logger} from './util/services/logger.js'


const app = express()
const logger = new Logger('server.js')


// config
app.set('port', process.env.PORT || 3000)
app.use(cors())

// middleware
app.use(morgan('dev'))
app.use('/', routes)

// express error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).send(err.message)
})

// invalid route handler 
app.use((req, res, next) => {
    res.status(404).send('Ups, parece que solicitaste una ruta que no existe')
})

// currencies refresh rate
const CURRENCIES_INFO_REFRESH_INTERVAL = 2

// database connection retry process
let databaseRetryProcess
const DATABASE_RETRY_INTERVAL = 3


app.listen(app.get('port'), () => {
    logger.info("Server listening on port " + app.get('port'))
    afterStartup().then(() => {
        if(!DatabaseManager.isDatabaseConnected()) {
            databaseRetryProcess = setInterval(afterStartup, TimeCalculator.seconds(DATABASE_RETRY_INTERVAL))
            logger.info(`Database connection retry every ${DATABASE_RETRY_INTERVAL} seconds`)
        }
    console.log('- server is ready -')
    }).catch(err => logger.error(500, 'An error ocurred after the server started', err))
})

/** Tries to initialize Database and then fetches updated currencies info. On failure, this function is called again until database 
 * is connected.
 */
async function afterStartup() {
    await DatabaseManager.initDatabase()
    if (DatabaseManager.isDatabaseConnected()) {
        clearInterval(databaseRetryProcess)
        await refreshCurrenciesInfo()
        logger.info(`Currencies info will be refreshed every ${CURRENCIES_INFO_REFRESH_INTERVAL} minutes`)
        setInterval(refreshCurrenciesInfo, TimeCalculator.minutes(CURRENCIES_INFO_REFRESH_INTERVAL));
    }
}

/** Fetches and creates/updates currencies info. Since currencies rates fluctuate constantly, this function is called regularly based on CURRENCIES_INFO_REFETCH_INTERVAL
 */
async function refreshCurrenciesInfo() {
    try {
        const currenciestInfoJson = await FetchManager.fetchCurrenciesInfo()
        await DatabaseManager.updateOrCreateCurrenciesInfo(currenciestInfoJson)
    } catch (err) {
        logger.error("An error ocurred while fetching currencies daily info: ", err)
    }
}