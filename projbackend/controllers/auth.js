const User = require('../models/user');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
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

exports.signin = (req,res) =>{
	const {email,password} = req.body;
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(400).json({error:errors.array()[0].msg});
	}
	User.findOne({email}, (error,user)=>{
		if(!user || error){
			return res.status(400).json({error:'User email does not exists'});
		}

		if(!user.authenticate(password)){
		return res.status(401).json({error:'Invalid email or password.'});
		}
		//create a token
		const token = jwt.sign({_id:user._id},process.env.SECRET);
		//put token in cookie
		res.cookie("token",token,{expire:new Date()+9999});
		//send response to front-end
		const {_id,name,email,role} = user;
		return res.status(200).json({token,user:{_id,name,email,role}});
	})
}

exports.signout = (req,res) =>{
	res.clearCookie("token");
	res.json({message:'User signout successfully.'});
}

//protected routes
exports.isSignedIn = expressjwt({
	secret:process.env.SECRET,
	userProperty:"auth"
})
//custom middlewares
exports.isAuthenticated = (req,res,next)=>{
	let checker = req.profile && req.auth && req.profile._id==req.auth._id;
	if(!checker){
		return res.status(403).json({error:'ACCESS DENIED'});
	}
	next();
}
exports.isAdmin = (req,res,next)=>{
	if(req.profile.role === 0){
		return res.status(403).json({error:'You are not admin'});
	}
	next();
}