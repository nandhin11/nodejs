const express = require("express")
const authController = require('./../controllers/authController')
////// ---------- use express router  -------- /////
const router = express.Router(); //router middleware

router.route('/signup').post(authController.createUser)

module.exports = router