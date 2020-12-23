const JwtStrategy = require('passport-jwt').Strategy
const ExractJwt = require('passport-jwt').ExtractJwt
const User = require('../model/User')
const config = require('../config.json')

const options = {
    jwtFromRequest: ExractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey
}
module.exports = passport => {
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await User.findOne({
                    email: payload.email
                })
                console.log(user)
                if (user) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            } catch (e) {
                console.log(e)
            }
        })
    )

}