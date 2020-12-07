const express = require('express');
const router = express.Router();
const {signup, signin, signout, test} = require('../controllers/auth')
const { check } = require('express-validator');


router.post("/signup",[
	check("name","Name should be atlease 3 char").isLength({min:3}),
	check("email","Email is required").isEmail(),
	check("password","password should be atlease 3 char").isLength({min:3}),
], signup);

router.post("/signin",[
	check("email","Email is required").isEmail(),
	check("password","password should be atlease 3 char").isLength({min:3}),
], signin);

router.get("/signout",signout);
// router.get("/test",isSignedIn, (req,res) =>{
// 	//decode token
// 	res.json(req.auth);
// });
module.exports = router;