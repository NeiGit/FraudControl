import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {Logger} from './util/logger.js'

const logger = new Logger('database.js')



async function init() {
    dotenv.config()
    const uri = process.env.ATLAS_URI

    logger.info("Connecting to MongoDB database")

    try {
        await mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
        mongoose.Model.on('index', function(err) {
            if (err) logger.error(err);
          })
        logger.info( 'Succesfully connected to MongoDB database')
    } catch (err) {
        logger.error('Failed to connect to MongoDB database', err)
    }
}

function checkStatus() {
    return mongoose.connection.readyState
} 

export default {init, checkStatus}
