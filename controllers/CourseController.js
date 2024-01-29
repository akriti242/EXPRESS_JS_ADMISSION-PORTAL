const CourseModel = require('../models/course')
const { findById } = require('../models/user')
const nodemailer = require('nodemailer')

class CourseController {
    static btechFormInsert = async (req, res) => {
        try {
            // console.log(req.body)

            const { name, email, mobileNo, dob, gender, address, college, course, branch } = req.body  //fields define under input name tag
            const result = new CourseModel({
                name: name,
                email: email,
                number: mobileNo,
                dob: dob,
                gender: gender,
                address: address,
                college: college,
                course: course,
                branch: branch,
                user_id: req.user.id
            })

            await result.save()
            this.sendMail(name, email)
            res.redirect('/courseDisplay')
        } catch (error) {
            console.log(error)
        }
    }


    static bbaFormInsert = async (req, res) => {
        try {
            // console.log(req.body)

            const { name, email, mobileNo, dob, gender, address, college, course, branch } = req.body  //fields define under input name tag
            const result = new CourseModel({
                name: name,
                email: email,
                number: mobileNo,
                dob: dob,
                gender: gender,
                address: address,
                college: college,
                course: course,
                branch: branch,
                user_id: req.user.id
            })

            await result.save()
            res.redirect('/courseDisplay')
        } catch (error) {
            console.log(error)
        }
    }


    static bcaFormInsert = async (req, res) => {
        try {
            // console.log(req.body)

            const { name, email, mobileNo, dob, gender, address, college, course, branch } = req.body  //fields define under input name tag
            const result = new CourseModel({
                name: name,
                email: email,
                number: mobileNo,
                dob: dob,
                gender: gender,
                address: address,
                college: college,
                course: course,
                branch: branch,
                user_id: req.user.id
            })

            await result.save()
            res.redirect('/courseDisplay')
        } catch (error) {
            console.log(error)
        }
    }







    static courseDisplay = async (req, res) => {
        try {
            const { name, id, image } = req.user
            const data = await CourseModel.find({ user_id: id })
            // console.log(data)
            res.render('course/courseDisplay', { n: name, d: data, i: image, message: req.flash('success') })
        } catch (error) {
            console.log(error)
        }
    }

    static courseView = async (req, res) => {
        try {
            // console.log(req.params.id)
            const { name, id, image } = req.user
            const view = await CourseModel.findById(req.params.id)
            //    console.log(view)
            res.render('course/courseView', { courseview: view, n: name, i: image })
        } catch (error) {
            console.log(error)
        }
    }
    
    static courseEdit = async (req, res) => {
        try {
            // console.log(req.params.id)
            const { name, id, image } = req.user
            const edit = await CourseModel.findById(req.params.id)
            //    console.log(edit)
            res.render('course/courseEdit', { courseedit: edit, n: name, i: image })
        } catch (error) {
            console.log(error)
        }
    }

    static courseUpdate = async (req, res) => {
        try {
            // console.log(req.params.id)
            const { id } = req.user
            const { name, email, mobileNo, dob, gender, address, college, course, branch } = req.body
            await CourseModel.findByIdAndUpdate(req.params.id, {
                name: name,
                email: email,
                number: mobileNo,
                dob: dob,
                gender: gender,
                address: address,
                college: college,
                course: course,
                branch: branch,
                user_id: req.user.id
            })
            //    console.log(edit)
            req.flash('success', 'course update successfully')
            res.redirect('/courseDisplay')
        } catch (error) {
            console.log(error)
        }
    }

    static courseDelete = async (req, res) => {
        try {
            // console.log(req.params.id)
            await CourseModel.findByIdAndDelete(req.params.id)
            req.flash('success', 'course delete successfully')
            res.redirect('/courseDisplay')
        } catch (error) {
            console.log(error)
        }
    }

    static sendMail = async (name, email) => {
        // console.log(name, email)

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "arokritika278@gmail.com",
                pass: "buzzphwxpiwvcavu",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Course created Succesfully", // Subject line
            text: "hello", // plain text body
            html: `<b>${name}</b> course insert is successful! , Please wait for approval.`, // html body
        });
        //console.log("Messge sent: %s", info.messageId);
    };
}


module.exports = CourseController