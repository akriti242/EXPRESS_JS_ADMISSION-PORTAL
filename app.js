const express = require('express')
// console.log(express)

const app = express() // // // method
const port = 3000
const web = require("./routes/web")
const connectDb = require('./db/connect_db')

const fileUpload = require("express-fileupload");
// for file upload
app.use(fileUpload({useTempFiles: true}));

// cookies parser for getting token
const cookieparser = require('cookie-parser')
app.use(cookieparser())

//connect flash and sessions
const session = require('express-session')
const flash = require('connect-flash');

// connect Db
connectDb()

//template engines html css views
app.set('view engine', 'ejs')

//static files css image link
app.use(express.static('public'))


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))


//messages
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }));
//Flash messages
app.use(flash());


//route load  ====== most imp =====
app.use('/', web)



// ======== server create ////
app.listen(port, () => {
    console.log(`Server Start localhost: ${port}`)
})