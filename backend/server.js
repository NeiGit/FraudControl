import express from 'express'
import morgan from 'morgan'
import routes from './routes/routes.js'
import Database from './database.js'


const app = express()

Database.init()

// config
app.set('port', process.env.PORT || 3000)
app.listen()


// middleware
app.use(morgan('dev'))
app.use('/', routes)

app.listen(app.get('port'), () => {
    console.log("Server listening on port ", app.get('port'))
})