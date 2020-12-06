const category = require('../models/category');
const Category = require('../models/category');

exports.getCategoryById = (req,res,next,id) =>{
	Category.findById(id).exec((error,category)=>{
		if(error){
			return res.status(400).json({error:'Category not found'});
		}
		req.category = category;
		next();
	})
}

exports.createCategory = (req,res) =>{
	const category = new Category(req.body);
	category.save((error,category)=>{
		if(error){
			return res.status(400).json({error:'Not able to save category'});
		}
		return res.json(category);
	})
}