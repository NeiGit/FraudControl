import mongoose from 'mongoose'

const Schema = mongoose.Schema

const counterSchema = new Schema({
    ISOcode : String,
})

export default mongoose.model('Counter', counterSchema, 'Counter')