const mongoose = require("mongoose")

mongoose.connect(`mongodb+srv://jay:${process.env.mongoDBAtlasPassword}@cluster0-oz65c.mongodb.net/usersDB?retryWrites=true&w=majority`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log(`Database Connected`))
.catch((err) => console.log(err))