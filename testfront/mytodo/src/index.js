import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Router from './Router';
import User from './User';
import Notfound from './Notfound';
import reportWebVitals from './reportWebVitals';
import {Route, Link, Switch, BrowserRouter} from 'react-router-dom'

const routing = (
	<BrowserRouter>
	<div>
		<ul>
			<li><Link to="/">Home</Link></li>
			<li><Link exact to="/user">User</Link></li>
			<li><Link exact to="/router">Visit</Link></li>
			
		</ul>
	</div>
		<Switch>
			<Route exact path="/" component={App}></Route>
			<Route exact path="/router" component={Router}></Route>
			<Route exact path="/user" component={User}></Route>
			<Route component={Notfound}></Route>
		</Switch>
	</BrowserRouter>
)
ReactDOM.render(
	routing,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
