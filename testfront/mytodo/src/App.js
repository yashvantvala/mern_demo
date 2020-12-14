import React from 'react';
import logo from './lco.png';
import './App.css';

class App extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			newItem:"",
			list :[]
		}
	}
	addItem(todoValue){
		if(todoValue!==""){
			const newItem = {
				id:Date.now(),
				value:todoValue,
				isDone:false
			};
			const list = [...this.state.list];
			list.push(newItem);
			//set state fot set new value
			this.setState({
				list:list,
				newItem:""
			});
		}
	}

	deleteItem(id){
		const list = [...this.state.list];
		const updatedlist = list.filter(item=>item.id!==id);
		this.setState({
			list:updatedlist,
			newItem:""
		});
	}
	updateInputs(input){
		this.setState({newItem:input});
	}
	//render for the class
	render(){
		return (
			<div className="main">
				<img src={logo} width="100" height="100" className="logo" />
				<h1 className="app-title text-center">My Todo App</h1>
				<div className="container">
					<p className="text-center">Add an item...</p>
					<br/>
					<div class="flex">
					<input type="text" className="input-text" placeholder="Write a todo" required value={this.state.newItem} onChange={e=>this.updateInputs(e.target.value)} />
					<button className="add-btn ml-1" onClick={()=>this.addItem(this.state.newItem)} disabled={!this.state.newItem.length}>Add Todo</button>
					</div>
				</div>
				<div className="list">
					<ul>
					{this.state.list.map(item=>{
						return(
							<li key={item.id}>
								<input 
								type="checkbox"
								name="isDone"
								checked={item.isDone}
								onChange={()=>{}}
								/>
								{item.value}
								<button className="btn ml-1" onClick={()=>this.deleteItem(item.id)}>Delete</button>
							</li>
						)
					})}
					<li>
						<input type="checkbox" name=""/>
						Record youtube videos
						<button className="btn ml-1">Delete</button>
					</li>
					</ul>
				</div>
			</div>
		)
	}
}

export default App