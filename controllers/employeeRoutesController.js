const User = require("./../models/User.js")
let DailyTasksList
const funcDailyTasks = require("./../models/funcDailytasks.js")

let todayDate = Date().slice(0,15).replace(" ","_").replace(" ","_").replace(" ","_")


module.exports.addInTime = async (req, res, next) => {
    // console.log(req.body, "req.body addInTime")
    let {
        employeeEmailObjId,
        taskId,
        inTime,
        user
    } = req.body

    try {
        DailyTasksList = await funcDailyTasks(user.email)

        let gotIt = await DailyTasksList.findOneAndUpdate({
            date: todayDate,
            // "tasks._id": taskId,
            // "tasks.assignedTo._id": employeeEmailObjId
        },{
             $set: {"tasks.$[task].assignedTo.$[to].in": inTime}
        },{
            arrayFilters: [{"task._id": taskId}, {"to._id": employeeEmailObjId}],
            new: true
        })
        // console.log(gotIt.tasks[0].assignedTo[0], "gotIt")
    
        next()
    } catch(err) {
        console.log(err)
        next(err)
    }

}

module.exports.addOutTime = async (req, res, next) => {
    console.log(req.body, "req.body addOutTime")

    let {
        employeeEmailObjId,
        taskId,
        outTime,
        user
    } = req.body

    try {
        DailyTasksList = await funcDailyTasks(user.email)

        let gotIt = await DailyTasksList.findOneAndUpdate({
            date: todayDate,
            // "tasks._id": taskId,
            // "tasks.assignedTo._id": employeeEmailObjId
        },{
             $set: {"tasks.$[task].assignedTo.$[to].out": outTime}
        },{
            arrayFilters: [{"task._id": taskId}, {"to._id": employeeEmailObjId}],
            new: true
        })
        // console.log(gotIt.tasks[0].assignedTo[0], "gotIt")
    
        next()
    } catch(err) {
        console.log(err)
        next(err)
    }
}