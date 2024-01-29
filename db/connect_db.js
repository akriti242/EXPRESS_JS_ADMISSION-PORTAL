const mongoose =  require('mongoose')

const liveDb = 'mongodb+srv://arokritika278:kritikamongo123@cluster0.ltvbbnw.mongodb.net/admission-portal?retryWrites=true&w=majority'

const localDb = 'mongodb://127.0.0.1:27017/admission-portal'

const connectDb = () => {
    return mongoose.connect(liveDb)
    .then(()=>{
        console.log("Connected sucessfully");
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports = connectDb