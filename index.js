const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const config = require('./config.json')
const router = require('./routes/todosRoute')
const path = require('path')

const port = config.PORT

const app = express()

const hbs = exphbs.create({
    extname: 'hbs'
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(router)

const start = async () => {
    try {
        await mongoose.connect(config.dbURL, {
            useNewUrlParser: true,
            useFindAndModify: false, useUnifiedTopology: true
        })

        app.listen(port, () => {
            console.log(`server start on port ${port}`)
        })

    } catch (e) {
        console.log(e)
    }
}
start()