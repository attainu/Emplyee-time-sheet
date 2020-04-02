const express = require("express")


const router = express.Router()

const {auth} = require("./../../middleware/auth.js")
const {assignNewTask} = require("./../../controllers/employerRoutesController")



router.post('/employer/assignNewTask', auth, assignNewTask)

module.exports = router