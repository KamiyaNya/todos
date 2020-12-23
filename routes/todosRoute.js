const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const controller = require('../controller/auth')
const config = require('../config.json')
const secretKey = config.secretKey
const User = require('../model/User')
const Todo = require('../model/Todo')
const router = express()
router.use(cookieParser())
router.use(express.urlencoded({
    extended: true
}))

router.get('/', (req, res) => {
    res.render('login', {
        title: "Авторизация"
    })
})

router.get('/register', (req, res) => {
    res.render('register', {
        title: "Регистрация"
    })
})
router.post("/", async (req, res) => {
    try {
        const userEmail = req.body.email
        const password = req.body.password
        const user = await User.findOne({
            email: userEmail
        })
        if (!user) {
            res.status(404).send(`<p>Такого пользователя не существует <a href="/">Вернуться</a></p>`)
        }
        const validPass = await bcrypt.compareSync(password, user.password)
        if (!validPass) {
            res.status(401).send(`<p>Пароль не совпал <a href="/">Вернуться</a></p>`)
        }
        const token = jwt.sign({
            email: user.email,
            userId: user._id
        }, secretKey, {
            expiresIn: '1h'
        })
        res.status(200).json({
            token: token
        })
        res.cookie(
            'token', token
        )

        res.redirect('/posts')
    } catch (e) {
        console.log(e)
    }
})
router.post("/register", controller.register)

router.get("/posts", passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        const todosss = await Todo.find({}).lean()
        res.render('index', {
            title: "Главная",
            isIndex: true,
            todosss
        })
    } catch (error) {
        console.log(error)
    }
    // res.send('<h2>Вы не авторизованы <a href="/">Войти</a></h2>')
})

router.get("/create", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.render('create', {
        title: "Добавить задачу",
        isCreate: true,
    })
})

router.post("/create", passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        const todo = new Todo({
            title: req.body.title,
            users: req.user.id
        })
        console.log(todo)
        await todo.save()
        res.redirect('/posts')
    } catch (e) {
        console.log(e)
    }

})

router.post("/complete", passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        const todo = await Todo.findById(req.body.id)
        todo.completed = true
        await todo.save()
        res.redirect('/posts')
    } catch (error) {
        console.log(error)
    }

})

router.post('/delete', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        const todo = await Todo.findOne(req.body.id)
        await todo.remove({
            id: todo
        })
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }

})

module.exports = router