const {
    Schema,
    model
} = require('mongoose')

const post = new Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    users: {
        ref: 'user',
        type: Schema.Types.ObjectId
    }
})

module.exports = model('Todo', post)