const mongoose = require('mongoose')
// field

const TeacherSchema = new mongoose.Schema({
    name:{
        type:String,
        Required:true
    },
    email:{
        type:String,
        Required:true
    }
},{timestamps:true})

//model

const TeacherModel = mongoose.model('teachers',TeacherSchema)
module.exports = TeacherModel