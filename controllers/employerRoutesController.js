const User = require("./../models/User.js")
let DailyTasksList
const funcDailyTasks = require("./../models/funcDailytasks.js")

let todayDate = Date().slice(0,15).replace(" ","_").replace(" ","_").replace(" ","_")

const notifyEmployee = require("./../utilities/notifyEmployee.js")


class AssignmentClass {
    constructor(assignTo, title, details) {
        
        this.assignedTo = assignTo.map(employeeEmail => {
            return {employeeEmail: employeeEmail}
        })
        console.log(this.assignedTo, typeof(this.assignedTo), 'assignedTo')
        this.title = title
        this.details = details
    }
}


module.exports.assignNewTask = async (req, res, next) => {
    console.log(req.body, 'req.body at assignNewTask')
    let {
        user,
        assignTo,
        title,
        details
    } = req.body
    if(!user.isEmployer) return next({name:"unauthorized", message: "unauthorized"})

    for(i = assignTo.length - 1; i > 0; i--) {
        assignTo = assignTo.replace(" ","")
    }
    assignTo = assignTo.split(",")
  

    DailyTasksList = await funcDailyTasks(user.email)


    try {

        let employees = await User.find({employerEmail: user.email})
        console.log(employees, 'employees assignNewTask')
        employees = employees.filter(employee => employee.allowedByEmployer)
        employees = employees.map(employee => employee.email)
        console.log(employees, "mapped employees assignNewTask")

        let errMessageArr = []
        for(employeeEmail of assignTo) {
            if(!employees.includes(employeeEmail)) errMessageArr.push(`No such allowed employee having email ${employeeEmail}`)
        }
        console.log(errMessageArr, "errMessageArr")
        if(errMessageArr.length) return next({name: "bad data", message: errMessageArr})



        //send notifiacation
        notifyEmployee(assignTo, title, details)
        
        //store todaysTasks in DB
        // DailyTasksList.findOneAndUpdate({date: todayDate}, {$push: {todaysTasks: new AssignmentClass(assignTo, title, details)}}, {new: true}, (err, doc) => {
        DailyTasksList.findOneAndUpdate({date: todayDate}, {$push: {tasks: new AssignmentClass(assignTo, title, details)}}, {new: true}, (err, doc) => {

            if(err) {
                console.log(err, "err while pushing assignment")
                return next("err while pushing assignment")
            }
            console.log(doc, 'doc')
            next()

        })


    } catch(err) {
        console.log("err catch")
        next(err)
    }

}