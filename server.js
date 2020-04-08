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



app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'null')
    res.setHeader('Access-Control-Allow-Headers', 'authorization, Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE')
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