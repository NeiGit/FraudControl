import mongoose from 'mongoose'
import UpdateIfCurrentPlugin from 'mongoose-update-if-current';
//import timestamps from 'mongoose-timestamp'

const Schema = mongoose.Schema

const countryDataSchema = new Schema({
    ISOcode :{type: String, unique: true},
    name : {
        name: String,
        native: String
    },
    languages: [{
        nativeName: String,
        iso639_1: String
    }],
    currency: String,
    timezones: [],
    coordinates: {
        latitude: Number,
        longitude: Number,
        distanceToBsAs: Number,
    }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}
})

countryDataSchema.plugin(UpdateIfCurrentPlugin.updateIfCurrentPlugin, { strategy: 'timestamp' })

export default mongoose.model('CountryData', countryDataSchema, 'CountryData')