const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")



const app = express()


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())


const userRoutes = require("./routes/userRoutes/userRoutes.js")


dotenv.config({
    path: "./private.env"
})


require("./db.js")

const User = require("./models/User.js")


app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'null')
    res.setHeader('Access-Control-Allow-Headers', 'authorization, Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE')

    // res.setHeader('Access-Control-Allow-Methods', 'DELETE')

    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
})

app.use(userRoutes)


// let user = new User({
//     email: "user@mail",
//     password: "password",
//     isEmployer: false,
//     employerEmail: "employer@mail" 
// })

// user.save()
// .then((user) => console.log(user))
// .catch((err) => console.log(err))


app.use((err, req, res, next) => {

    res.json({err: err})
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Server is running on port ${port}`))