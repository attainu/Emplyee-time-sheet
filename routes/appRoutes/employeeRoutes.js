const express = require("express")


const router = express.Router()

const {auth} = require("./../../middleware/auth.js")
const {dashboard} =require("./../../controllers/userControllers.js")
const {addInTime} = require("./../../controllers/employeeRoutesController.js")
const {addOutTime} = require("./../../controllers/employeeRoutesController.js")



router.patch('/employee/addInTime', auth, addInTime, dashboard)

router.patch('/employee/addOutTime', auth, addOutTime, dashboard)

module.exports = router