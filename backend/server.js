import express from 'express'
import morgan from 'morgan'
import routes from './routes/routes.js'
import cors from 'cors'
import DatabaseManager from './util/databaseManager.js'
import FetchManager from './util/fetchManager.js'
import TimeCalculator from './util/timeCalculator.js'
import {Logger} from './util/logger.js'


const app = express()
const logger = new Logger('server.js')


// config
app.set('port', process.env.PORT || 3000)
app.use(cors())

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
    res.status(err.status || 500).send(err.message)
})

// invalid route handler
app.use((req, res, next) => {
    res.status(404).send('Not found')
})

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

async function refreshCurrenciesInfo() {
    try {
        const currenciestInfoJson = await FetchManager.fetchCurrenciesInfo()
        await DatabaseManager.updateOrCreateCurrenciesInfo(currenciestInfoJson)
    } catch (err) {
        logger.error("An error ocurred while fetching currencies daily info: ", err)
    }
}

async function afterStartup() {
    await DatabaseManager.initDatabase()
    if (DatabaseManager.isDatabaseConnected()) {
        clearInterval(databaseRetryProcess)
       // await refreshCurrenciesInfo()
        /* logger.info(`Currencies info will be refetched every ${CURRENCIES_INFO_REFETCH_INTERVAL} minutes`)
        setInterval(refreshCurrenciesInfo, TimeCalculator.minutes(CURRENCIES_INFO_REFETCH_INTERVAL)); */
    }
}







