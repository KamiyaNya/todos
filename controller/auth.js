const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const config = require('../config.json')
const secretKey = config.secretKey
module.exports.login = async function (req, res) {
    try {
        const userEmail = req.body.email
        const password = req.body.password

        const user = await User.findOne({
            email: userEmail
        })
        if (!user) {
            res.status(404).json({
                message: 'Такого пользователя не существует'
            })
        }
        const validPass = bcrypt.compareSync(password, user.password)
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
    } catch (e) {
        console.log(e)
    }
}

module.exports.register = async function (req, res) {
    try {
        const userEmail = req.body.email
        const password = req.body.password
        console.log(userEmail)
        console.log(password)
        const candidate = await User.findOne({
            email: userEmail
        })
        if (candidate) {
            res.status(400).json({
                message: `User with email ${userEmail} already exist`
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email: userEmail,
            password: hashPassword
        })
        await user.save()
        console.log('user created')
        res.status(200).redirect('/')
    } catch (e) {
        console.log(e)
    }

}