const courseModel = require('../models/course')
const nodemailer = require('nodemailer')

class AdminController {


    static getUserDisplay = async (req, res) => {
        try {
            const { name, image } = req.user
            const course = await courseModel.find()
            res.render('admin/getUserDisplay', { n: name, i: image, c: course })
        } catch {
            console.log('error')
        }
    }

    static userView = async (req, res) => {
        try {
            // console.log(req.params.id)
            const { name, id, image } = req.user
            const view = await courseModel.findById(req.params.id)
            //    console.log(view)
            res.render('admin/getUserView', { courseview: view, n: name, i: image })
        } catch (error) {
            console.log(error)
        }
    }

    static userEdit = async (req, res) => {
        try {
            // console.log(req.params.id)
            const { name, id, image } = req.user
            const edit = await courseModel.findById(req.params.id)
            //    console.log(view)
            res.render('admin/getUserEdit', { courseedit: edit, n: name, i: image })
        } catch (error) {
            console.log(error)
        }
    }

    static userDelete = async (req, res) => {
        try {
            // console.log(req.params.id)
            await courseModel.findByIdAndDelete(req.params.id)
            req.flash('success', 'successfully deleted')
            res.redirect('admin/getUserDisplay')
        } catch (error) {
            console.log(error)
        }
    }

    static updateStatus = async (req, res) => {
        try {
            const { comment, name, email, status } = req.body
            await courseModel.findByIdAndUpdate(req.params.id, {
                comment: comment,
                status: status
            })
            this.sendMail(name,email,status,comment)
            res.redirect('/admin/dashboard')
        } catch (error) {
            console.log(error)
        }
    }

    static sendMail = async (name, email, status, comment) => {
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
            subject: ` Course ${status}`, // Subject line
            text: "hello", // plain text body
            html: `<b>${name}</b> Course  <b>${status}</b> successful! <br>
             <b>Comment from Admin</b> ${comment} `, // html body
        });
        //console.log("Messge sent: %s", info.messageId);
    };
}

module.exports = AdminController