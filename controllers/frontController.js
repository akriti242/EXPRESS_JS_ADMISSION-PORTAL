
// ==== making a class (FrontController) which has static method ======

// ==== this method calls an async function which sending request ====


const UserModel = require('../models/user')
const TeacherModel = require('../models/teacher')
const bcrypt = require("bcrypt"); // pwd encryption

const jwt = require('jsonwebtoken');  // token generate
const CourseModel = require('../models/course');


// for uploading image on cloudinary
// import {v2 as cloudinary} from 'cloudinary';
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dnnbr71hp',
  api_key: '998197194627869',
  api_secret: 'rZfFlJ3L-RBJv3ri503OgL4yTi4'
});   //cloudinary config 

class FrontController {

  static login = async (req, res) => {
    try {
      res.render('login', { message: req.flash('error') })
    } catch (error) {
      console.log(error)
    }
  }

  static registration = async (req, res) => {
    try {
      res.render('registration', { message: req.flash('error') }) //passing msg
    } catch (error) {
      console.log(error)
    }
  }

  static dashboard = async (req, res) => {
    try {
      const { name, id, image } = req.user  // extract name from user
      const btech = await CourseModel.findOne({ user_id: id, course: 'B.Tech' })  //

      const bba = await CourseModel.findOne({ user_id: id, course: 'BBA' })

      const bca = await CourseModel.findOne({ user_id: id, course: 'BCA' })

      res.render('dashboard', { n: name, btech: btech, bba: bba, bca: bca, i: image })  // show name on view
    } catch (error) {
      console.log(error)
    }
  }

  static about = async (req, res) => {
    try {
      const { name, image } = req.user
      res.render("about", { n: name, i: image })
    } catch (error) {
      console.log(error)
    }
  }

  static course = async (req, res) => {
    try {
      const { name, image } = req.user
      res.render('course', { n: name, i: image })
    } catch (error) {
      console.log(error)
    }
  }

  static blog = async (req, res) => {
    try {
      const { name, image } = req.user
      res.render('blog', { n: name, i: image })
    } catch (error) {
      console.log(error)
    }
  }

  static contact = async (req, res) => {
    try {
      const { name, image } = req.user
      res.render('contact', { n: name, i: image })
    } catch (error) {
      console.log(error)
    }
  }


  // inserting data insertReg


  static insertReg = async (req, res) => {
    try {

      // console.log(req.files.image)
      const file = req.files.image
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'profile'
      })

      // console.log(imageUpload)
      // console.log("hello data")
      // console.log(req.body)

      const { n, e, p, cp } = req.body
      const user = await UserModel.findOne({ email: e })
      // console.log(user)

      if (user) {
        req.flash('error', 'Email is already exist')
        res.redirect('/registration')
      }

      else {
        if (n && e && p && cp) {
          if (p == cp) {

            //for securing the password
            const hashpassword = await bcrypt.hash(p, 10) //secure pwd
            const result = new UserModel({
              //model : view
              name: n,
              email: e,
              password: hashpassword,
              image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url
              }

            })

            await result.save()
            res.redirect('/')

          }
          else {
            req.flash('error', 'Password and Confirm Password does not match')
            res.redirect('/registration')
          }
        }
        else {
          req.flash('error', 'All Fields are Required')
          res.redirect('/registration')
        }
      }


    }
    catch (error) {
      console.log(error)
    }
  }

  static verifyLogin = async (req, res) => {
    try {
      // console.log(req.body)
      const { email, password } = req.body
      if (email && password) {
        const user = await UserModel.findOne({ email: email })
        // console.log(user)

        if (user != null) {

          const ismatch = await bcrypt.compare(password, user.password)

          if (ismatch) {
            if (user.role == 'admin') {
              const token = jwt.sign({ ID: user._id }, 'honey123456money');
              // console.log(token)
              res.cookie('token', token)
              res.redirect('/admin/dashboard')
            }
            if (user.role == 'user') {
              const token = jwt.sign({ ID: user._id }, 'honey123456money');
              // console.log(token)
              res.cookie('token', token)
              res.redirect('/dashboard')
            }
            // jwt token for security
            const token = jwt.sign({ ID: user._id }, 'honey123456money');
            // console.log(token)
            res.cookie('token', token)
            res.redirect('/dashboard')
          }
          else {
            req.flash('error', 'Email or Password is not Valid.')
            res.redirect('/')
          }

        } else {
          req.flash('error', 'You are not a registered user')
          res.redirect('/')
        }
      }
      else {
        req.flash('error', 'All Fields are required')
        res.redirect('/')
      }
    } catch (error) {

    }
  }

  static logOut = async (req, res) => {
    try {
      res.clearCookie('token')
      res.redirect('/')

    } catch (error) {
      console.log(error)
    }
  }

  static profile = async (req, res) => {
    try {
      const { name, image, email } = req.user
      res.render('profile', { n: name, i: image, e: email, message: req.flash('success'), error: req.flash('error') })
    } catch (error) {
      console.log(error)
    }
  }

  static updateProfile = async (req, res) => {
    try {
      //  console.log(req.body)
      //  console.log(req.files.image)
      const { name, email, image } = req.body

      // console.log(userImg)
      if (req.files) {
        const userImg = await UserModel.findById(req.user.id)
        const imgId = userImg.image.public_id
        // console.log(imgId)
        await cloudinary.uploader.destroy(imgId) //delete img on cloud
        const file = req.files.image;
        const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
          //console.log(file)
          folder: 'profileImage'
        });
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageUpload.public_id,
            url: imageUpload.secure_url
          }
        }

      } else {
        var data = {
          name: name,
          email: email
        }
      }

      await UserModel.findByIdAndUpdate(req.user.id, data)
      req.flash('success', 'Profile Updated Successfully')
      res.redirect('/profile')

    } catch (error) {
      console.log(error)
    }
  }

  static changePassword = async (req, res) => {
    try {
      const { name, email, id, image } = req.user
      // console.log(req.body)
      const { oldpassword, newpassword, cnfpassword } = req.body
      if (oldpassword && newpassword && cnfpassword) {
        const user = await UserModel.findById(id)
        const ismatch = await bcrypt.compare(oldpassword, user.password)
        if (!ismatch) {
          req.flash('error', 'Old password is incorrect')
          res.redirect('/profile')
        } else {
          if (newpassword !== cnfpassword) {
            req.flash('error', 'Password does not match')
            res.redirect('/profile')
          }
          else {
            const hashhPassword = await bcrypt.hash(newpassword, 10)
            await UserModel.findByIdAndUpdate(id, {
              $set: { password: hashhPassword }

            })
            req.flash('message', 'password successfully updated')
            res.redirect('/profile')
          }
        }


      } else {
        req.flash('error', 'All fields are required')
        res.redirect('/profile')
      }
    } catch (error) {
      console.log(error)
    }
  }

  static forgetPassword = async (req, res) => {
    try {
      // const {email} = req.body;

      // const user = users.find((user) => user.email === email);
      // if(!user) {

      // }

      res.render('forget-password', { message: req.flash('error') }) //passing msg
    } catch (error) {
      console.log(error)
    }
  }


}





// verify login data  with static method




module.exports = FrontController