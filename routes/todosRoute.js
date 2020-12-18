const {
    Router
} = require('express')
const Todo = require('../model/Todo')
const router = Router()

router.get("/", async (req, res) => {
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