import mongoose from 'mongoose'

const Schema = mongoose.Schema

const dataSchema = new Schema({
    countryData : String,
    currencyData : String,
    ipData : String
})

export default mongoose.model('Data', dataSchema, 'Data')