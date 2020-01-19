const mongoose = require("mongoose")
const Schema = mongoose.Schema
const moment = require('moment')

const Categoria = new Schema({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: moment()
    }
})

mongoose.model("categorias",Categoria)