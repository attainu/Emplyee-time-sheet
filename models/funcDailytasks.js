const mongoose = require("mongoose")
const User = require("./User.js")

module.exports = async email => {


    let {DBname} = await User.findOne({email: email})
    
    console.log(DBname, 'DBname')

    let employerDB = await mongoose.createConnection(`mongodb+srv://jay:${process.env.mongoDBAtlasPassword}@cluster0-oz65c.mongodb.net/${DBname}?retryWrites=true&w=majority`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false        
    })

    const dailyTasksListSchema = new mongoose.Schema({
        name: {
            type: String,
            // unique: true
        }
    })

    return employerDB.model('dailytasks', dailyTasksListSchema)

}