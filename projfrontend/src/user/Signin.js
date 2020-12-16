import React, {useState} from 'react';
import Base from '../core/Base';
import { Link, Redirect } from 'react-router-dom';
import { authenticate, isAutheticated, signin } from '../auth/helper/index';

const Signin = () =>{

	const [values,setValues] = useState({
		email:"",password:"",error:"",loading:false,didRedirect:false
	}) 

	const { email,password,error,loading, didRedirect }  = values;
	const {user} = isAutheticated();
	const handleChange = name => event =>{
		setValues({...values, error:false, [name]:event.target.value});
	}
	const loadingMessage = () =>{
		return(
			loading && (
				<div className="alert alert-info">
					<h2>Loading...</h2>
				</div>
			)
		)
	}
	const errorMessage = () => {
		return (
		  <div className="row">
			<div className="col-md-6 offset-sm-3 text-left">
			  <div
				className="alert alert-danger"
				style={{ display: error ? "" : "none" }}
			  >
				{error}
			  </div>
			</div>
		  </div>
		);
	  };
	const onSubmit = (event) =>{
			event.preventDefault();
			setValues({...values,error:false, loading:true});
			signin({email,password})
			.then(data=>{
				if(data.error){
					setValues({...values,error:data.error, loading:false});
				}else{
					authenticate(data,()=>{
						setValues({
							...values,didRedirect:true
						});
					})
				}
			})
			.catch(console.log('sign in request failed'));
	  }
	const performRedirect = () =>{
		//WIP to redirect
		if(didRedirect){
			if(user && user.role==1){
				return <p>redirect to admin</p>
			}else{
				return <p>redirect to user dashboard</p>
			}
		}
		if(isAutheticated()){
			return <Redirect to="/" />
		}
	}
	const signinForm = () => {
		return(
			<div className="row">
				<div className="col-md-6 offset-sm-3 text-left">
					<form>
						<div className="form-group">
							<label className="text-light">Email</label>
							<input type="email" className="form-control" value={email} onChange={handleChange("email")} />
						</div>
						<div className="form-group">
							<label className="text-light">Password</label>
							<input type="password" className="form-control" value={password} onChange={handleChange("password")} />
						</div>
						<button className="btn btn-success btn-block my-2 form-control" onClick={onSubmit} >Submit</button>
					</form>
				</div>
			</div>
		)
	}
	return(
		<Base title="Sign in page" description="A page for user to signin">
			{errorMessage()}
			{loadingMessage()}
			{signinForm()}
			{performRedirect()}
			<p className="text-white text-center">{JSON.stringify(values)}</p>
		</Base>
	)
}

export default Signin;