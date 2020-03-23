const express = require("express")


const userRoutes = require("./routes/userRoutes/userRoutes.js")


const app = express()


app.use(userRoutes)


const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Server is running on port ${port}`))