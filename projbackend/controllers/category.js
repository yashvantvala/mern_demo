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
//create category
exports.createCategory = (req,res) =>{
	const category = new Category(req.body);
	category.save((error,category)=>{
		if(error){
			return res.status(400).json({error:'Not able to save category'});
		}
		return res.json({category});
	})
}

//Ger categories
exports.getCategory = (req,res) =>{
	return res.status(200).json(req.category);
}
exports.getAllCategory = (req,res) =>{
	Category.find().exec((error,items)=>{
		if(error){
			return res.status(400).json({error:'No categories found'});
		}
		return res.status(200).json({items});
	})		
}
exports.updateCategory = (req,res) =>{
	const category = req.category;
	category.name = req.body.name;
	category.save((error,category)=>{
		if(error){
			return res.status(400).json({error:'Failed to update category'});
		}
		return res.json(category)
	});
}
exports.removeCategory = (req,res) =>{
	const category = req.category;
	Category.remove((error,category)=>{
		if(error){
			return res.status(400).json('Unable to delete category');
		}
		return res.status(200).json({message:'Successfully deleted'});
	})
}