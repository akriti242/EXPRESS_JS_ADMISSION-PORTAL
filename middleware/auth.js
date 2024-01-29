const jwt = require('jsonwebtoken')
const UserModel = require('../models/user') // to get user detail (name)


const checkUserAuth = async (req,res,next) =>{
    // console.log("hello middleware")

    const {token} = req.cookies
    // console.log(token)

    if(!token){
        req.flash('error', 'unauthorized login')
        res.redirect('/')
    }

    else{
        const verifytoken = jwt.verify(token, 'honey123456money')
        // console.log(verifytoken)
        const user = await UserModel.findOne({_id:verifytoken.ID}) //getting user id
        // console.log(user)
        req.user = user
        next()
    }

  
}



module.exports = checkUserAuth