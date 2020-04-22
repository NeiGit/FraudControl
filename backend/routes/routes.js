import express from 'express'
import fetch from 'node-fetch'

const router = express.Router()

router.get('/', (req, res) => {
    res.send("Todo ok")
})

router.route('/home')
    .get((req, res) => {
        res.status(200).json({name: 'This is the placeholder HOME get form meli excercise'})
    })

router.route('/country/:name')
    .get((req, res) => {
        const country_query = req.params.name
        fetch(`https://restcountries.eu/rest/v2/name/${country_query}?fullText=true`)
        .then(res => {
            return res.json()
        })
        .then(data => {
            res.json(data)
            console.log(data)
        })
        .catch( err =>  {
            console.log(err)
        })
    })

router.get('/traceip/:ip', (req, res) => {
    res.send("Se consultó la ip: " + req.params.ip)
})        

export default router    
