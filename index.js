const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const router = require('./routes/todosRoute')
const path = require('path')

const port = process.env.PORT || 4000

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
        await mongoose.connect("", {
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
