const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        city: {
            type: String,
            default: "Hanoi"
        },
        district: {
            type: String,
            default: "Cau Giay"
        },
        ward: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        }
    }
})

module.exports = mongoose.model('users', userSchema)