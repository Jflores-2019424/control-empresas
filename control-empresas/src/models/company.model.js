'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companyModel = Schema ({
    name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    companyType: {
        type: String,
        required: true
    },
    branch: [{
        name: String,
        ubication: String,
    }]
})

module.exports = mongoose.model("company", companyModel)