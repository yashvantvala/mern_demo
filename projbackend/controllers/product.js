const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { sortBy } = require('lodash');

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

exports.deleteProduct = (req,res) =>{
	let product = req.product;
	product.remove((error,item)=>{
		if(error){
			return res.status(400).json({error:'Unable to delete the product'});
		}
		return res.json({message:"Product deleted successfully."});
	})
}
exports.updateProduct = (req,res) =>{
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (error,fields,file)=>{
		if(error){
			return res.status(400).json({error:'Unable to Update data'});
		}
		//update product
		let product = req.product;
		product = _.extend(product, fields);

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
				return res.status(400).json({error:'Unable to Update!'});
			}
			return res.status(200).json(product);
		});
	})	
}
//product listing
exports.getAllProducts = (req,res) =>{
	let limit = req.query.limit?parseInt(req.query.limit):8;
	let sortBy = req.query.sortBy?req.query.sortBy:"_id";
	Product.find()
	.select("-photo")
	.populate("category")
	.sort([[sortBy, "asc", ]])
	.limit(limit)
	.exec((error,items)=>{
		if(error){
			return res.status(400).json({error:'No product found!'});
		}
		return res.json(products);
	})
}

exports.updateStock = (req,res,next) =>{
	let operations = req.body.order.products.map(prod=>{
		return {updateOne:{
			filter: {_id:prod._id},
			update:{$inc:{stock:-prod.count, sold:+prod.count}}
		}
	}
	});

	Product.bulkWrite(operations, {}, (error,items)=>{
		if(error){
			return res.status(400).json({error:'Bulk operations failed'});
		}
		next();
	});
}
exports.getAllUniqueCategories = (req,res) =>{
	Product.distinct("category",{}, (error,category)=>{
		if(error){
			return res.status(400).json({error:'No category found!'});
		}
		return res.json(category);
	})
}