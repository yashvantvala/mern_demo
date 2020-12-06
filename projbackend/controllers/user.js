const User = require('../models/user');
const Order = require('../models/order');
//get all users
exports.getAllUsers = (req,res) =>{
	User.find().exec((error,users)=>{
		if(error || !users || !users.length){
			return res.status(400).json({error:'No user Found'});
		}
		return res.status(200).json({users:users});
	})
}
//get user by id
exports.getUserById = (req,res,next,id) =>{
	User.findById(id).exec((error,user)=>{
		if(error || !user){
			return res.status(400).json({error:'No user found.'});
		}
		req.profile = user;
		next();
	})	
}
// update user
exports.updateUser = (req,res) =>{
	User.findByIdAndUpdate(
		{_id:req.profile._id},
		{$set:req.body},
		{new:true, useFindAndModify:false},
		(error,user)=>{
			if(error){
				return res.status(400).json({error:'You are not authorized to perform updation.'})
			}
			user.salt = undefined;
			user.encry_password = undefined;
			res.json(user);
		}
	)
}
exports.getUser = (req,res) =>{
	req.profile.encry_password = undefined;
	req.profile.salt = undefined;
	req.profile.createdAt = undefined;
	req.profile.updatedAt = undefined;
	return res.json(req.profile);
};
//get user orders
exports.userPurchaseList = (req,res)=>{
	Order.find({user:req.profile._id})
	.populate("user","_id name")
	.exec((error,order)=>{
		if(error){
			return res.status(400).json({error:'No order in this accound'});
		}
		return res.status(200).json(order);
	})
}

exports.pushOrderInPurchaseList = (req,res,next)=>{
	let purchases = [];
	req.body.order.products.forEach((product)=>{
		purchases.push({
			_id:product._id,
			name:product.name,
			description:product.description,
			category:product.category,
			quantity:product.quantity,
			amount:req.body.order.amount,
			transaction_id:req.body.order.transaction_id
		});
	})
	//store to DB
	User.findOneAndUpdate(
		{_id:req.profile._id},
		{$push: {purchases:purchases}},
		{new :true},
		(error,purchase)=>{
			if(error){
				return res.status(400).json({error:"Unable to save purchase list"});
			}
			next();
		}
	)
}