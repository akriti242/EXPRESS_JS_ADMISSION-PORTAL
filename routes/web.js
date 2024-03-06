const express = require('express')
const FrontController = require('../controllers/frontController')
const route = express.Router()
const checkUserAuth = require('../middleware/auth')
const CourseController = require('../controllers/CourseController')
const AdminController = require('../controllers/AdminController')
// const CourseController = require('../controllers/CourseController')

// // routing  == important ==

// route.get('/', (req, res)=>{
//     res.send("Home Page")
// })

// route.get('/about', (req, res)=>{
//     res.send("About Page")
// })

// route.get('/team', (req, res)=>{
//     res.send("Team Page")
// })



// ======== route path ======= 

// ( after '/home ' === url   )
//  ( after ClassName .home  === method   )

route.get('/', FrontController.login)


route.get('/registration', FrontController.registration)
route.get('/dashboard', checkUserAuth, FrontController.dashboard)
route.get('/about', checkUserAuth, FrontController.about)
route.get('/course', checkUserAuth, FrontController.course)
route.get('/blog', checkUserAuth, FrontController.blog)
route.get('/contact', checkUserAuth, FrontController.contact)
route.get('/profile', checkUserAuth, FrontController.profile)

//form method post

route.post('/insertreg', FrontController.insertReg)
route.post('/verifylogin', FrontController.verifyLogin)
route.get('/logout', FrontController.logOut)
route.post('/updateProfile', checkUserAuth, FrontController.updateProfile)
route.post('/changePassword', checkUserAuth, FrontController.changePassword)

// forget password
route.get('/forget-password', FrontController.forgetPassword)
route.post('/forget-password', FrontController.forgetVerify)

//reset password
route.get('/reset-password',FrontController.resetPassword)

route.post('/reset_Password1',FrontController.reset_Password1)


route.get('/verify', FrontController.verifyEmail)

// COURSE CONTROLLER
route.post('/btechFormInsert', checkUserAuth, CourseController.btechFormInsert)
route.post('/bbaFormInsert', checkUserAuth, CourseController.bbaFormInsert)
route.post('/bcaFormInsert', checkUserAuth, CourseController.bcaFormInsert)

route.get('/courseDisplay', checkUserAuth, CourseController.courseDisplay)

route.get('/courseView/:id', checkUserAuth, CourseController.courseView)
route.get('/courseEdit/:id', checkUserAuth, CourseController.courseEdit)
route.get('/courseDelete/:id', checkUserAuth, CourseController.courseDelete)


route.post('/courseUpdate/:id', checkUserAuth, CourseController.courseUpdate)


// ADMIN CONTROLLER

route.get('/admin/dashboard', checkUserAuth ,AdminController.getUserDisplay)

route.get('/admin/userView/:id', checkUserAuth, AdminController.userView)
route.get('/admin/userEdit/:id', checkUserAuth, AdminController.userEdit)
route.get('/admin/userDelete/:id', checkUserAuth, AdminController.userDelete)

route.post('/update_status/:id', checkUserAuth, AdminController.updateStatus)
// route.get('/admin/userEdit/:id', checkUserAuth, AdminController.updateStatus)
// route.get('/admin/userDelete/:id', checkUserAuth, AdminController.userDelete)

module.exports = route