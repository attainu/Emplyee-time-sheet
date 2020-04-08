const mongoose = require("mongoose")
const User = require("./User.js")

module.exports = async email => {

    let {DBname} = await User.findOne({email: email})
    
    let employerDB = await mongoose.createConnection(`mongodb+srv://jay:${process.env.mongoDBAtlasPassword}@cluster0-oz65c.mongodb.net/${DBname}?retryWrites=true&w=majority`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false        
    })

    const monthlyAttendanceSchema = new mongoose.Schema({
        month: {
            type: String,
            default: (new Date()).toLocaleString('default', {month: "long", year: "numeric"})
        },
        employees: [{
            email: String,
            tasks: Number,
            hours: Number
        }],
        monthCompleted: {
            type: Boolean,
            default: false
        },
        sentToEmployer: Boolean
    })


    return employerDB.model('monthlyattendances', monthlyAttendanceSchema)

}