const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


const User = require('./../models/User.js')
const Otp = require('./../models/Otp.js')
const funcDailyTasks = require('./../models/funcDailytasks.js')
let DailyTasksList

let todayDate = Date().slice(0,15).replace(" ","_").replace(" ","_").replace(" ","_")
console.log(todayDate, 'todayDate', typeof(todayDate))
let dateObj = {date: todayDate}
console.log(dateObj)
// let todayOtherDate = {...todayDate}
// console.log(todayOtherDate)

const sendOTP = require('./../utilities/sendOtp.js')
const getNewDBname = require('./../utilities/getNewDBname.js')

class UserClass {
    constructor(name, email, password, isEmployer, employerEmail) {
        this.name = name
        this.email = email
        this.password = password
        this.isEmployer = isEmployer
        this.employerEmail = employerEmail
    }
}


const cookieOptions = {maxAge: 1000 * 60 * 60 * 12, httpOnly: true, path: '/'}



module.exports.dashboard = (req, res, next) => {
    let {email} = req.body.user
    User.findOne({email: email}, async (err, user) => {
        if(err) return next(err)

        console.log(req.cookies, 'req cookies')

        
        console.log(user, 'dashboard1')
        delete user._doc.password
        console.log(user, 'dashboard2')


        try {
            console.log(email, 'email bofore going to DailyTaskList')
            DailyTasksList = await funcDailyTasks(email)

            DailyTasksList.findOne({date: todayDate}, (err, todaysTasks) => {
                if(err) return next(err)
                console.log(todayDate)
                console.log(todaysTasks, !todaysTasks, '!todaysTasks')
                if(!todaysTasks) {
                    console.log(todayDate)
                    let dateObj = {date: todayDate}
                    todaysTasks = new DailyTasksList(dateObj)
                    console.log(todaysTasks, 'todaysTasks before saving')
                    todaysTasks.save()
                    .then(response => {
                        console.log(response, 'response saving todaysTasks')
                        
                        
                
                    })
                    .catch(reject => console.log(reject))
                }


                if(user.isEmployer) {
                    User.find({employerEmail: email}, async (err, employees) => {
                        if(err) return next(err)

                        console.log(employees, 'employees')
                        let employeesWaiting = employees.filter(employee => !employee.allowedByEmployer)
                        employeesWaiting = employeesWaiting.map(employee => {
                            return {
                                name: employee.name,
                                email: employee.email
                            }
                        })
                        console.log(employees, 'mapped employees')

                        let allowedEmployees = employees.filter(employee => employee.allowedByEmployer)
                        allowedEmployees = allowedEmployees.map(employee => {
                            return {
                                name: employee.name,
                                email: employee.email
                            }
                        })
                        // try {
                        //     console.log(email, 'email bofore going to DailyTaskList')
                        //     DailyTasksList = await funcDailyTasks(email)
        
                        // } catch(err) {
                        //     console.log(err, 'err')
                        // }
                        // let todayObj = new DailyTasksList({name: `${email}-employer`})
                        // todayObj.save()
                        // .then(response => console.log(response))
                        // .catch(reject => console.log(reject))
        
                        console.log(todaysTasks, 'todaysTasks before res.json')
                        res.json({
                            successLogin: true,
                            user: user,
                            allowedEmployees: allowedEmployees,
                            employeesWaiting: employeesWaiting,
                            token: req.body.token,
                            todaysTasks: todaysTasks
                        })
        
        
                    })
                } else {
        
                    // try {
                    //     console.log(email, 'email bofore going to DailyTaskList')
                    //     DailyTasksList = await funcDailyTasks(email)
        
                    // } catch(err) {
                    //     console.log(err, 'err')
                    // }
                    // let todayObj = new DailyTasksList({name: `${user.employerEmail}'s-employee`})
                    // todayObj.save()
                    // .then(response => console.log(response))
                    // .catch(reject => console.log(reject))
        
                    User.findOne({email: user.employerEmail}, (err, employer) => {
                        if(err) return next(err)


                        res.json({
                            successLogin: true,
                            user: user,
                            employerName: employer.name,
                            token: req.body.token,
                            todaysTasks: todaysTasks
                        })

                    })


                    
                }




            })

            

        } catch(err) {
            console.log(err, 'err')
        }



 


    })


}

module.exports.postLogin = (req, res, next) => {
    let {
        email,
        password
    } = req.body

    // res.clearCookie("token", {maxAge: 1000 * 60 * 60 * 12, httpOnly: true})
console.log(req.cookies.token, 'cookie postLogin')
    User.findOne({email: email}, async (err, user) => {
        if(err) return next(err)
        if(!user) return next({name: "invalidData", message: "unauthorized"})
        if(user.isLoggedIn) return next({name: "bad request", message: "Logged in already"})

        if(bcrypt.compareSync(password, user.password)) {
            let token = jwt.sign({email: email}, process.env.jwtPrivateKey, {expiresIn: 1000 * 60 * 60 * 12})
            res.cookie("token", token, cookieOptions)

            console.log(token, 'token postLogin')
   
            console.log(user, 'postLogin1')

            user.isLoggedIn = true

            console.log(user, 'postLogin2')

            user.save().then(user => {
                delete user._doc.password

                req.body = {}
                req.body.user = user
                req.body.token = token
                next()
               
            })
            
        } else {

            next({name: "invalidData", message: "unauthorized"})
        }

       
    })
   
   
}

module.exports.postRegisterEmployer = async (req, res, next) => {
    let {
        name,
        email,
        password,
        rePassword
    } = req.body

    if(password != rePassword) return next({name: "invalidData", message: "Re-write the same password!!!"})

    let hash = bcrypt.hashSync(password, 10)

    let newUser = new UserClass(name, email, hash, true)

    newUser.isLoggedIn = true


    newUser = new User(newUser)

    newUser.save().then((user) => {

        try {
            let token = jwt.sign({email: email}, process.env.jwtPrivateKey, {expiresIn: 1000 * 60 * 60 * 12})
            res.cookie("token", token, cookieOptions)
            
            console.log(token, 'token postRegisterEmployer')
            // req.body.isEmailVerified = user.isEmailverified
            req.body = {}

            delete user._doc.password
            req.body.user = user
            req.body.token = token

            next()
        } catch(err) {
            return next(err)
        }

    }).catch((err) => {
        console.log(err)
        next(err)
    })
}

module.exports.makeEmployerDB = (req, res, next) => {
    let {name, email} = req.body.user
    User.find({isEmployer: true}, (err, res) => {
        if(err) return next(err)
        let DBlist = res.map(employer => employer.DBname)
        console.log(DBlist, 'DBlist')

        let newDBname = getNewDBname(name, email, DBlist)
        console.log(newDBname, 'newDBname')

        User.findOneAndUpdate({email: email}, {DBname: newDBname}, {new: true}, (err, user) => {
            if(err) return next(err)

            console.log(user, "employer with DBname")
            next()
        })




    })
    
}


module.exports.postRegisterEmployee = (req, res, next) => {
    let {
        employerEmail,
        name,
        email,
        password,
        rePassword
    } = req.body

    if(password != rePassword) return next({name: "invalidData",message: "Re-write the same password!!!"})

    User.findOne({email: employerEmail}, (err, employer) => {
        if(err) return next(next)
        if(!employer) return next({name: "invalidData",message: "Company's email does not exist."})

        let hash = bcrypt.hashSync(password, 10)

        let newUser = new UserClass(name, email, hash, false, employerEmail)
        
        newUser.isLoggedIn = true
        newUser.allowedByEmployer = false
        newUser.DBname = employer.DBname
    
        newUser = new User(newUser)
        newUser.save().then((user) => {
    
            try {
                let token = jwt.sign({email: email}, process.env.jwtPrivateKey, {expiresIn: 1000 * 60 * 60 * 12})
                res.cookie("token", token, cookieOptions)
                
                console.log(token, 'token postRegisterEmployee')
                // req.body.isEmailVerified = user.isEmailverified
                req.body = {}

                delete user._doc.password
                req.body.user = user
                req.body.token = token

                next()
            } catch(err) {
                return next(err)
            }
        }).catch((err) => {
            console.log(err)
            next(err)
        })
    })
}

module.exports.sendOTP = (req, res, next) => {
    console.log(req.body)
    let otp
    let {email,isEmailverified} = req.body.user
    let {token} = req.body
    console.log(token, 'token sendOtp1')

    console.log(isEmailverified, 'isEmailVerified')
    console.log(email, 'email')
    if(!isEmailverified) {
        console.log('creating OTP')
        otp = Math.floor(Math.random() *10000)
        let newOtpObj = {
            email: email,
            otp: otp            
        }

        newOtpObj = new Otp(newOtpObj)
        newOtpObj.save()
        .then(newOtpObj => {
            
             
            sendOTP(email, otp)

            console.log(token, 'token sendOtp2')


            res.json({
               user: req.body.user,
               token: token,
               OTPsent: true
            })
        })
        .catch(err => {
            console.log(err)
            next(err)
        })
    }
}

module.exports.verifyEmailByOtp = async (req, res, next) => {
    console.log(req.body, 'at cont')
    let {otp, user} = req.body
    let email = user.email

    try {
        let userInOtps = await Otp.findOne({email: email})
        console.log(userInOtps)
        if(userInOtps.otp == otp) {
               

            // user = await User.findOne({email: email})
            // console.log(user)


            await Otp.findOneAndRemove({otp: otp})
            let filter = {email: email}
            let update = {isEmailverified: true}
            let user = await User.findOneAndUpdate(filter, update, {new: true})
  
            console.log(user)


            delete user._doc.password
            req.body = {}
            req.body.user = user
            // req.body.token = token
            next()

           
        } else {
            next({name: "invalidData",message: "Wrong OTP"})
        }
    } catch(err) {
        console.log(err)
        next(err)
    }

    

}

module.exports.deleteLogout = async (req, res, next) => {
    console.log('loggin out')
    // console.log(req, 'req logout')
    // console.log(req.cookies, 'req logout')
    console.log(req.cookies.token, 'req logout')


    let {email} = req.body.user

    try {
        let user = await User.findOneAndUpdate({email: email}, {isLoggedIn: false}, {new: true})
        
        console.log(req.cookies.token, 'cookie1')
        res.clearCookie("token", cookieOptions)
        console.log(req.cookies.token, 'cookie2')
    
        console.log(user, 'logged out')
    
        res.json({
            loggedOut: true
        })    
    } catch (err) {
        next(err)
    }
    


}


module.exports.patchAllowEmployee = async (req, res, next) => {
    console.log(req.body.employeeEmail, 'allowEmployee')
    let {employeeEmail} = req.body
    let employee = await User.findOneAndUpdate({email: employeeEmail}, {allowedByEmployer: true}, {new: true}) 
    res.json({
        allowedEmployee: employee,
        allow: true
    })
}

module.exports.deleteRejectedEmployee = async (req, res, next) => {
    console.log(req.body)
    let {employeeEmail} = req.params

    console.log(employeeEmail)
    await User.findOneAndRemove({email: employeeEmail})

    res.json({
        rejected: employeeEmail
    })
}