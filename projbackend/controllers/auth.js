const { request } = require("express");

const User = require('../models/user');
const {check, validationResult} = require('express-validator');
//controllers
exports.signup = (req,res) =>{

	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(400).json({error:errors.array()[0].msg})
	}
	const user = new User(req.body);
	user.save((error,user)=>{
		if(error){
			return res.status(400).json({
				error:'Something went wrong, please try again later.'
			})
		}
		res.json({
			name:user.name,
			email:user.email,
			id:user._id
		});
	})
}