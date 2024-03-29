// ==== making a class (FrontController) which has static method ======

// ==== this method calls an async function which sending request ====

const UserModel = require("../models/user");
const TeacherModel = require("../models/teacher");
const bcrypt = require("bcrypt"); // pwd encryption

const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken"); // token generate
const CourseModel = require("../models/course");

// for uploading image on cloudinary
// import {v2 as cloudinary} from 'cloudinary';
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dnnbr71hp",
  api_key: "998197194627869",
  api_secret: "rZfFlJ3L-RBJv3ri503OgL4yTi4",
}); //cloudinary config

class FrontController {
  static login = async (req, res) => {
    try {
      res.render("login", {
        msg: req.flash("success"),
        message: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static registration = async (req, res) => {
    try {
      res.render("registration", { message: req.flash("error") }); //passing msg
    } catch (error) {
      console.log(error);
    }
  };

  static dashboard = async (req, res) => {
    try {
      const { name, id, image } = req.user; // extract name from user
      const btech = await CourseModel.findOne({
        user_id: id,
        course: "B.Tech",
      }); //

      const bba = await CourseModel.findOne({ user_id: id, course: "BBA" });

      const bca = await CourseModel.findOne({ user_id: id, course: "BCA" });

      res.render("dashboard", {
        n: name,
        btech: btech,
        bba: bba,
        bca: bca,
        i: image,
      }); // show name on view
    } catch (error) {
      console.log(error);
    }
  };

  static about = async (req, res) => {
    try {
      const { name, image } = req.user;
      res.render("about", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static course = async (req, res) => {
    try {
      const { name, image } = req.user;
      res.render("course", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static blog = async (req, res) => {
    try {
      const { name, image } = req.user;
      res.render("blog", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static contact = async (req, res) => {
    try {
      const { name, image } = req.user;
      res.render("contact", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  // inserting data insertReg

  static insertReg = async (req, res) => {
    try {
      // console.log(req.files.image)
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "profile",
      });

      // console.log(imageUpload)
      // console.log("hello data")
      // console.log(req.body)

      const { n, e, p, cp } = req.body;
      const user = await UserModel.findOne({ email: e });
      // console.log(user)

      if (user) {
        req.flash("error", "Email is already exist");
        res.redirect("/registration");
      } else {
        if (n && e && p && cp) {
          if (p == cp) {
            //for securing the password
            const hashpassword = await bcrypt.hash(p, 10); //secure pwd
            const result = new UserModel({
              //model : view
              name: n,
              email: e,
              password: hashpassword,
              image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url,
              },
            });
            // to save data
            const userData = await result.save();

            if (userData) {
              this.sendVerifyMail(n, e, userData._id);
              req.flash("error", "Please verify your email");
              res.redirect("/");
            }
          } else {
            req.flash("error", "Password and Confirm Password does not match");
            res.redirect("/registration");
          }
        } else {
          req.flash("error", "All Fields are Required");
          res.redirect("/registration");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //verify email

  static sendVerifyMail = async (name, email, user_id) => {
    // sendVerifyMail(n, e, user._id)

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "arokritika278@gmail.com",
        pass: "buzzphwxpiwvcavu",
      },
    });

    // let info = await transporter.sendVerifyMail({
    //   from: "test@gmail.com",
    //   to: email,
    //   subject: `For Email Verification`,
    //   html: '<p> Hi! ' + name + ', please click here to <a href="http://localhost:3000/verify?id='+user_id+'"> Verify </a> your mail. </p> '

    // });

    const mailOption = {
      from: "arokritika278@gmail.com",
      to: email,
      subject: "for Verification Email",
      html:
        "<p> Hi! " +
        name +
        ', please click here to <a href="https://admission-portal-xzpt.onrender.com/verify?id=' +
        user_id +
        '"> Verify </a> your mail. </p> ',
    };

    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  };

  static verifyEmail = async (req, res) => {
    try {
      const updateInfo = await UserModel.updateOne(
        { _id: req.query.id },
        { $set: { is_verified: 1 } }
      );

      console.log(updateInfo);
      res.render("email-verified");
      // if(updateInfo){
      //   res.redirect("dashboard")
      // }
    } catch (error) {
      console.log(error);
    }
  };

  //verify LOGIN

  static verifyLogin = async (req, res) => {
    try {
      // console.log(req.body)
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        // console.log(user)

        if (user != null) {
          const ismatch = await bcrypt.compare(password, user.password);

          if (ismatch) {
            if (user.role == "admin") {
              const token = jwt.sign({ ID: user._id }, "honey123456money");
              // console.log(token)
              res.cookie("token", token);
              res.redirect("/admin/dashboard");
            }
            if (user.is_verified === 0) {
              res.render("login", { message: "please verify your mail." });
            }
            if (user.role == "user") {
              const token = jwt.sign({ ID: user._id }, "honey123456money");
              // console.log(token)
              res.cookie("token", token);
              res.redirect("/dashboard");
            }

            // jwt token for security
            const token = jwt.sign({ ID: user._id }, "honey123456money");
            // console.log(token)
            res.cookie("token", token);
            res.redirect("/dashboard");
          } else {
            req.flash("error", "Email or Password is not Valid.");
            res.redirect("/");
          }
        } else {
          req.flash("error", "You are not a registered user");
          res.redirect("/");
        }
      } else {
        req.flash("error", "All Fields are required");
        res.redirect("/");
      }
    } catch (error) {
      console.log("error");
    }
  };

  static logOut = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  // USER PROFILE
  static profile = async (req, res) => {
    try {
      const { name, image, email } = req.user;
      res.render("profile", {
        n: name,
        i: image,
        e: email,
        message: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static updateProfile = async (req, res) => {
    try {
      //  console.log(req.body)
      //  console.log(req.files.image)
      const { name, email, image } = req.body;

      // console.log(userImg)
      if (req.files) {
        const userImg = await UserModel.findById(req.user.id);
        const imgId = userImg.image.public_id;
        // console.log(imgId)
        await cloudinary.uploader.destroy(imgId); //delete img on cloud
        const file = req.files.image;
        const imageUpload = await cloudinary.uploader.upload(
          file.tempFilePath,
          {
            //console.log(file)
            folder: "profileImage",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageUpload.public_id,
            url: imageUpload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }

      await UserModel.findByIdAndUpdate(req.user.id, data);
      req.flash("success", "Profile Updated Successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  static changePassword = async (req, res) => {
    try {
      const { name, email, id, image } = req.user;
      // console.log(req.body)
      const { oldpassword, newpassword, cnfpassword } = req.body;
      if (oldpassword && newpassword && cnfpassword) {
        const user = await UserModel.findById(id);
        const ismatch = await bcrypt.compare(oldpassword, user.password);
        if (!ismatch) {
          req.flash("error", "Old password is incorrect");
          res.redirect("/profile");
        } else {
          if (newpassword !== cnfpassword) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const hashhPassword = await bcrypt.hash(newpassword, 10);
            await UserModel.findByIdAndUpdate(id, {
              $set: { password: hashhPassword },
            });
            req.flash("message", "password successfully updated");
            res.redirect("/profile");
          }
        }
      } else {
        req.flash("error", "All fields are required");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // FORGET PASSWORD
  static forgetPassword = async (req, res) => {
    try {
      res.render("forget-password", { message: req.flash("error") }); //passing msg
    } catch (error) {
      console.log(error);
    }
  };

  static forgetVerify = async (req, res) => {
    try {
      const email = req.body.email;
      const user = await UserModel.findOne({ email: email });
      if (user) {
        if (user.is_verified === 0) {
          req.flash("error", "Please verify your mail");
          res.redirect("/");
          // res.render ("forget-password", {message:"Please verify your mail"});
        } else {
          const randomString = randomstring.generate();
          const updateData = await user.updateOne(
            { email: email },
            { $set: { token: randomString } }
          );
          this.sendResetPasswordMail(user.name, user.email, randomString);
          req.flash("success", "please check your email to reset password");
          res.redirect("/");
        }
      } else {
        req.flash("error", "incorrect email");
        res.redirect("/");
        // res.render('forget-password', { message: "incorrect email" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // reset password mail-sending

  static sendResetPasswordMail = async (name, email, token) => {
    // sendVerifyMail(n, e, user._id)

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "arokritika278@gmail.com",
        pass: "buzzphwxpiwvcavu",
      },
    });

    const mailOption = {
      from: "arokritika278@gmail.com",
      to: email,
      subject: "for Reset Password",
      html:
        "<p> Hi! " +
        name +
        ', please click here to <a href="https://admission-portal-xzpt.onrender.com/reset-password?token=' +
        token +
        '"> Reset </a> your password. </p> ',
      //https://admission-portal-xzpt.onrender.com/forget-password?token='
    };

    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  };

  static resetPassword = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      if (tokenData) {
        res.render("reset-password", { user_id: tokenData._id });
      } else {
        res.render("404");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static reset_Password1 = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const newHashPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(user_id, {
        password: newHashPassword,
        token: "",
      });
      req.flash("success", "Reset Password Updated successfully ");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
}

// verify login data  with static method

(module.exports = FrontController), this.verifyEmail;
