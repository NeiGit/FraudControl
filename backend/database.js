import mongoose from 'mongoose'
import dotenv from 'dotenv'

function init() {
    dotenv.config()
    const uri = process.env.ATLAS_URI

    console.log("Connecting to MongoDB database")

    mongoose
    .connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
    .then(db => console.log('MongoDB connection succesfull'))
    .catch(err => console.log(err))
}

export default {init}
