const express = require('express')
const {
    check
} = require('express-validator')
const controller = require('../controller/auth')
const Todo = require('../model/Todo')
const router = express()

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
router.post("/", controller.login)
router.post("/register", [
    check('email').isEmail(),
    check('password').isLength({
        min: 4
    })
], controller.register)

router.get("/posts", async (req, res) => {
    const todosss = await Todo.find({}).lean()
    res.render('index', {
        title: "Главная",
        isIndex: true,
        todosss
    })
})

router.get("/create", (req, res) => {
    res.render('create', {
        title: "Добавить задачу",
        isCreate: true,
    })
})
router.post("/create", async (req, res) => {
    const todo = new Todo({
        title: req.body.title
    })
    console.log(todo)
    await todo.save()
    res.redirect('/')
})

router.post("/complete", async (req, res) => {
    const todo = await Todo.findById(req.body.id)
    todo.completed = true
    await todo.save()
    res.redirect('/')
})
router.post('/delete', async (req, res) => {
    const todo = await Todo.findOne(req.body.title)
    await todo.remove({
        title: todo
    })
    res.redirect('/')
})

module.exports = router