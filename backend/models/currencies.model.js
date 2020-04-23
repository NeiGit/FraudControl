import mongoose from 'mongoose'

const Schema = mongoose.Schema

const currenciesSchema = new Schema({
    json : String
})

export default mongoose.model('Currencies', currenciesSchema, 'Currencies')