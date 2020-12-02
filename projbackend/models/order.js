const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;
const ProductCartSchema = new mongoose.Schema({
	product:{
		type:ObjectId,
		ref:"Product"
	},
	name:String,
	count:Number,
	price:Number
});

const orderShema = new mongoose.Schema({
		products:[ProductCartSchema],
		transaction_id:{},
		amount:{type:Number},
		address:String,
		updated:Date,
		user:{
			type:ObjectId,
			ref:"User"
		}
},{timestamps:true});

const order = mongoose.model("Order",orderShema);
const ProductCart = mongoose.model("ProductCart",ProductCart);

module.exports = {order,ProductCart}