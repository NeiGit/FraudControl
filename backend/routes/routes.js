import express from 'express'
import fetch from 'node-fetch'
import DataModel from '../models/data.model.js'
import RequestValidator from '../util/requestValidator.js'
import Urls from './urls.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.send("Todo ok")
})

router.route('/home')
    .get((req, res) => {
        res.status(200).json({name: 'This is the placeholder HOME get form meli excercise'})
    })

router.route('/country/:code')
    .get((req, res) => {
        const country_query = req.params.code
        fetch(Urls.COUNTRY_INFO_URL(country_query))
        .then(res => {
            return res.json()
        })
        .then(data => {
            console.log(data)
            const stringData = JSON.stringify(data)
            const entry = new DataModel({
                countryData : stringData})
            entry.save().then(() => res.json(entry))
        })
        .catch( err =>  {
            console.log(err)
        })
    })

router.get('/traceip/:ip', async (req, res) => {
    console.log("Consultando ip " + req.params.ip)
    try {
        const fetched = await fetch(Urls.IP_TRACKING_URL(req.params.ip))
        const data = await fetched.json()
        res.json(data)
    } catch (err) {
        res.send(err)
    }    
})



export default router    
