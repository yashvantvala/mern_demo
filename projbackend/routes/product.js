const express = require('express');
const router = express.Router();
const { isSignedIn, isAdmin,isAuthenticated } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');
const { getProductById, createProduct, getProduct, photo } = require('../controllers/product');

//all param goes here
router.param("userId", getUserById);
router.param("productId", getProductById);

//all routes goes here
router.post("/product/create/:userId", isSignedIn,isAuthenticated,isAdmin, createProduct);

router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);
module.exports = router;