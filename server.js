const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")


const app = express()


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())


const userRoutes = require("./routes/userRoutes/userRoutes.js")
const employerRoute = require("./routes/appRoutes/employerRoutes.js")
const employeeRoute = require("./routes/appRoutes/employeeRoutes.js")


dotenv.config({
    path: "./privateData.env"
})


require("./db.js")



app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'null', '*')

    console.log(req.headers.origin, 'req.headers.origin')
    var allowedOrigins = ['null', '*', 'http://localhost:1234', 'http://localhost:8080'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Headers', 'authorization, Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
})

app.use(userRoutes)
app.use(employerRoute)
app.use(employeeRoute)




app.use((err, req, res, next) => {
    console.log(err, "errorHandler")
    res.json(err)
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Server is running on port ${port}`))