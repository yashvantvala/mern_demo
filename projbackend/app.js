const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
//initialize express app
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');

//DB connection
mongoose.connect(process.env.DB_URI,{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(()=>{
	console.log('db connected');
})
.catch((err)=>{
	console.log(err)
});

//middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api",authRoutes);
//PORT
const port = process.env.PORT || 5000;
app.listen(port,()=>console.log(`server is runnig on port ${port}`));