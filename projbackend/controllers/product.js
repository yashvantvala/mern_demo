const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getProductById = (req,res,next,id) => {
	Product.findById(id)
	.populate("category")
	.exec((error,item)=>{
		if(error){
			return res.status(400).json({error:'Product not found'});
		}
		req.product = item;
		next();
	})	
}

//create product
exports.createProduct = (req,res) =>{
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (error,fields,file)=>{
		if(error){
			return res.status(400).json({error:'Unable to save data'});
		}
		//destructure the fields
		const {name,description, price, category, stock} = fields;
		
		if(!name || !description || !price || !category || !stock){
			return res.status(400).json({error:'Please include all fields.'});
		}
		let product = new Product(fields);

		//handle file 
		if(file.photo){
			if(file.photo.size > 3000000){
				return res.status(400).json({error:'File size is to big!'});
			}
			product.photo.data = fs.readFileSync(file.photo.path);
			product.photo.contentType = file.photo.type;
		}
		//save to the DB
		product.save((error,item)=>{
			if(error){
				return res.status(400).json({error:'Unable to save!'});
			}
			return res.status(200).json(product);
		});
	})
}
exports.getProduct = (req,res) =>{
	req.product.photo = undefined;
	return res.json(req.product);
}
//middleware
exports.photo = (req,res,next) =>{
	if(req.product.photo.data){
		res.set("Content-Type",req.product.photo.contentType);
		return res.send(req.product.photo.data);
	}
	next();
}