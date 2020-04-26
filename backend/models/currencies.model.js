import mongoose from 'mongoose'

const Schema = mongoose.Schema

const currenciesSchema = new Schema({
    json : String,
    base: String,
    date: String,
    rates: {}
})

export default mongoose.model('Currencies', currenciesSchema, 'Currencies')