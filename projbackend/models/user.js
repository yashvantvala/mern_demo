const mongoose = require("mongoose");
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
var userSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true,
		maxlength:32,
		trim:true
	},
	lastname:{
		type:String,
		required:true,
		maxlength:32,
		trim:true
	},
	email:{
		type:String,
		required:true,
		trim:true,
		unique:true
	},
	userinfo:{
		type:String,
		trim:true
	},
	encry_password:{
		type:String,
		trim:true,
		required:true
	},
	salt:String,
	role:{
		type:Number,
		default:0
	},
	purchases:{
		type:Array,
		default:[]
	}
},{timestamps:true});
//virtual fields
userSchema.virtual("password")
	.set(function(password){
		this._password = password;
		this.salt = uuidv1();
		this.encry_password = this.securePassword(this._password);
	})
	.get(function(){
		return this._password;
	})
//methods
userSchema.methods = {
	//match password
	authenticate:function(plainPassword){
		return this.securePassword(plainPassword)===this.encry_password;
	},
	//encrypt the password
	securePassword:function(plainPassword){
		if(!plainPassword) return ""
		try{
			return crypto.createHmac('sha256',this.salt)
			.update(plainPassword)
			.digest('hex')
		}catch(err){
			return "";
		}
	}
}

module.exports = mongoose.model("User",userSchema);