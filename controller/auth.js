const bcrypt = require('bcryptjs')
const User = require('../model/User')
module.exports.login = async function (req, res) {
    try {


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