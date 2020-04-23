import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Logger from './util/logger.js'

const fileName = 'database.js'

async function init() {
    dotenv.config()
    const uri = process.env.ATLAS_URI

    Logger.info(fileName, "Connecting to MongoDB database")

    try {
        await mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
        Logger.info(fileName, 'Succesfully connected to MongoDB database')
    } catch (err) {
        Logger.error(fileName, 'Failed to connect to MongoDB database', + err)
    }
}

export default {init}
