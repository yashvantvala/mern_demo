const express = require('express');
const router = express.Router();
const {signup} = require('../controllers/auth')
const { check } = require('express-validator');


router.post("/signup",[
	check("name","Name should be atlease 3 char").isLength({min:3}),
	check("email","Email is required").isEmail(),
	check("password","password should be atlease 3 char").isLength({min:3}),
], signup);

module.exports = router;