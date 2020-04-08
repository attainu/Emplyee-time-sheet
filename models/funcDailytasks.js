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

    const dailyTasksListSchema = new mongoose.Schema({
        date: {
            type: String,
            unique: true
        },
        tasks: [
            {
                assignedTo: [
                    {
                        employeeEmail: {
                            type: String,
                            require: true
                        },
                        in: String,
                        out: String
                    }
                ],
                title: {
                    type: String,
                    trim: true
                },
                details: String,
                report: [
                    String
                ]
            }
        ]

    })

    return employerDB.model('dailytasks', dailyTasksListSchema)

}