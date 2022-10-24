const mongoose = require('mongoose')

const Schema = mongoose.Schema

let CartSchema = new Schema({
    uname: {
        type: String,
        required: true
    },
    fruit_no: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    checked: {
        type: Boolean,
        required: true
    },
})

module.exports = mongoose.model('Cart', CartSchema)